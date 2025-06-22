from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Employee, Attendance
from datetime import datetime
from datetime import timedelta
from pytz import timezone
from services.face_recognition_service import recognize_face, save_dataset_image
from services.face_recognition_service import train_model as train_face_model
import base64
import random


employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/employee-login', methods=['POST'])
def employee_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        employee = Employee.query.filter_by(email=email).first()
        if not employee or not check_password_hash(employee.password, password):
            return jsonify({'success': False}), 401

        return jsonify({'success': True, 'username': employee.username})
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({'success': False, 'message': 'Server error'}), 500


@employee_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        raw_password = data.get('password')

        if Employee.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already exists'})
        if Employee.query.filter_by(username=username).first():
            return jsonify({'success': False, 'message': 'Username already exists'})

        hashed_password = generate_password_hash(raw_password)
        employee = Employee(username=username, email=email, password=hashed_password)
        db.session.add(employee)
        db.session.commit()

        return jsonify({'success': True})
    except Exception as e:
        print("Registration error:", str(e))
        return jsonify({'success': False, 'message': 'Server error'}), 500


@employee_bp.route('/capture-faces', methods=['POST'])
def capture_faces():
    data = request.get_json()
    username = data.get('username')
    images = data.get('images')

    for idx, img in enumerate(images):
        save_dataset_image(username, img, idx)

    return jsonify({'success': True})


@employee_bp.route('/mark-in', methods=['POST'])
def mark_in():
    img_data = request.get_json().get('image')
    name = recognize_face(img_data)
    if not name:
        return jsonify({'success': False, 'message': 'Face not recognized'})

    emp = Employee.query.filter_by(username=name).first()
    today = datetime.today().date()
    record = Attendance.query.filter_by(employee_id=emp.id, date=today).first()
    
    ist = timezone('Asia/Kolkata')
    now = datetime.now(ist)
    if record and record.time_in:
        return jsonify({'success': False, 'message': 'Already marked in'})
    elif not record:
        record = Attendance(employee_id=emp.id, date=today)

    record.time_in = now.strftime("%H:%M:%S")
    db.session.add(record)
    db.session.commit()

    return jsonify({'success': True, 'username': name, 'time': now.strftime("%H:%M:%S")})




@employee_bp.route('/mark-out', methods=['POST'])
def mark_out():
    img_data = request.get_json().get('image')
    name = recognize_face(img_data)
    if not name:
        return jsonify({'success': False, 'message': 'Face not recognized'})

    emp = Employee.query.filter_by(username=name).first()
    today = datetime.today().date()
    record = Attendance.query.filter_by(employee_id=emp.id, date=today).first()

    if not record or record.time_out:
        return jsonify({'success': False, 'message': f'{name} already marked in at {record.time_in}'})

    ist = timezone('Asia/Kolkata')
    now = datetime.now(ist)
    record.time_out = now.strftime("%H:%M:%S")
    record.total_hours = calculate_hours(record.time_in, record.time_out)
    db.session.commit()

    return jsonify({'success': True, 'username': name, 'time': now.strftime("%H:%M:%S")})


def calculate_hours(tin, tout):
    fmt = '%H:%M:%S'
    tdelta = datetime.strptime(tout, fmt) - datetime.strptime(tin, fmt)
    return str(tdelta)


@employee_bp.route('/api/train-model', methods=['POST'])
def train_model_api():
    try:
        train_face_model()
        return jsonify({"success": True, "message": "Model trained successfully!"})
    except Exception as e:
        print("Training Error:", str(e))
        return jsonify({"success": False, "message": "Training failed!"}), 500



@employee_bp.route('/employee-report', methods=['GET'])
def employee_report():
    username = request.args.get('username')
    try:
        employee = Employee.query.filter_by(username=username).first()
        if not employee:
            return jsonify({'success': False, 'message': 'Employee not found'}), 404

        # Get attendance records
        records = Attendance.query.filter_by(employee_id=employee.id).order_by(Attendance.date.desc()).all()

        # Generate all dates from the earliest attendance to today
        if records:
            earliest_date = records[-1].date
        else:
            earliest_date = datetime.today().date()

        today = datetime.today().date()
        delta = today - earliest_date
        all_dates = [earliest_date + timedelta(days=i) for i in range(delta.days + 1)]

        attendance_map = {r.date: r for r in records}

        results = []
        for date in reversed(all_dates):  # recent dates first
            r = attendance_map.get(date)
            if r:
                results.append({
                    "date": date.strftime('%d-%m-%Y'),
                    "time_in": r.time_in or "-",
                    "time_out": r.time_out or "-",
                    "total_hours": r.total_hours or "-",
                    "status": "Present"
                })
            else:
                results.append({
                    "date": date.strftime('%d-%m-%Y'),
                    "time_in": "-",
                    "time_out": "-",
                    "total_hours": "-",
                    "status": "Absent"
                })

        return jsonify({'success': True, 'records': results})
    except Exception as e:
        print("Error in employee_report:", str(e))
        return jsonify({'success': False, 'message': 'Error fetching report'}), 500


otp_store = {}  # TEMP storage for demo

@employee_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')

    employee = Employee.query.filter_by(email=email).first()
    if not employee:
        return jsonify({'success': False, 'message': 'Email not registered'}), 404

    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp
    print(f"[INFO] OTP for {email} is {otp}")

    return jsonify({'success': True, 'otp': otp})  # returning OTP directly



@employee_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    entered_otp = data.get('otp')
    new_password = data.get('new_password')

    if otp_store.get(email) != entered_otp:
        return jsonify({'success': False, 'message': 'Invalid OTP'}), 400

    employee = Employee.query.filter_by(email=email).first()
    if not employee:
        return jsonify({'success': False, 'message': 'Email not found'}), 404

    employee.password = generate_password_hash(new_password)
    db.session.commit()
    otp_store.pop(email, None)

    return jsonify({'success': True})
