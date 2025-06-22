from flask import Blueprint, request, jsonify
from models import db, Employee, Attendance
from datetime import datetime
from datetime import timedelta
from pytz import timezone
import subprocess
import csv
from flask import Response
from io import StringIO
from sqlalchemy import func, extract

admin_bp = Blueprint('admin', __name__)

ist = timezone('Asia/Kolkata')


@admin_bp.route('/report-by-date', methods=['GET'])
def report_by_date():
    date_str = request.args.get('date')
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()

        employees = Employee.query.all()
        attendance_records = Attendance.query.filter(Attendance.date == date).all()

        # Map employee_id → attendance record
        record_map = {r.employee_id: r for r in attendance_records}

        records = []
        present_count = 0
        absent_count = 0

        for emp in employees:
            rec = record_map.get(emp.id)
            if rec:
                records.append({
                    "username": emp.username,
                    "time_in": rec.time_in or "-",
                    "time_out": rec.time_out or "-",
                    "total_hours": rec.total_hours or "-",
                    "status": "Present",
                    "date": date.strftime('%d-%m-%Y')
                })
                present_count += 1
            else:
                records.append({
                    "username": emp.username,
                    "time_in": "-",
                    "time_out": "-",
                    "total_hours": "-",
                    "status": "Absent",
                    "date": date.strftime('%d-%m-%Y')
                })
                absent_count += 1

        # Sort alphabetically by username
        records = sorted(records, key=lambda x: x['username'].lower())

        return jsonify({
            'success': True,
            'records': records,
            'present_count': present_count,
            'absent_count': absent_count
        })
    except Exception as e:
        print("Error in report_by_date:", e)
        return jsonify({'success': False, 'message': 'Error fetching report'}), 500




@admin_bp.route('/report-by-employee', methods=['GET'])
def report_by_employee():
    username = request.args.get('username')
    start = request.args.get('start')
    end = request.args.get('end')

    try:
        employee = Employee.query.filter_by(username=username).first()
        if not employee:
            return jsonify({'success': False, 'message': 'Employee not found'}), 404

        start_date = datetime.strptime(start, "%Y-%m-%d").date()
        end_date = datetime.strptime(end, "%Y-%m-%d").date()

        # Create a date range
        delta = end_date - start_date
        all_dates = [start_date + timedelta(days=i) for i in range(delta.days + 1)]

        # Get existing records
        existing_records = Attendance.query.filter(
            Attendance.employee_id == employee.id,
            Attendance.date.between(start_date, end_date)
        ).all()

        record_map = {r.date: r for r in existing_records}

        results = []
        for date in all_dates:
            r = record_map.get(date)
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
        print("Error in report_by_employee:", e)
        return jsonify({'success': False, 'message': 'Error fetching employee report'}), 500



    
@admin_bp.route('/train-model', methods=['POST'])
def trigger_training():
    try:
        import sys
        subprocess.call([sys.executable, 'train.py'])  # Uses venv's Python
        return jsonify({'success': True, 'message': 'Model trained successfully'})
    except Exception as e:
        print(f"Training error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)})



@admin_bp.route('/export-csv', methods=['GET'])
def export_csv():
    try:
        date_str = request.args.get('date')
        if not date_str:
            return jsonify({'success': False, 'message': 'Date is required'}), 400

        date = datetime.strptime(date_str, "%Y-%m-%d").date()

        employees = Employee.query.all()
        attendance_records = Attendance.query.filter(Attendance.date == date).all()

        record_map = {r.employee_id: r for r in attendance_records}

        results = []
        for emp in employees:
            rec = record_map.get(emp.id)
            if rec:
                results.append({
                    "username": emp.username,
                    "time_in": rec.time_in or "-",
                    "time_out": rec.time_out or "-",
                    "total_hours": rec.total_hours or "-",
                    "status": "Present",
                    "date": date.strftime('%d-%m-%Y')
                })
            else:
                results.append({
                    "username": emp.username,
                    "time_in": "-",
                    "time_out": "-",
                    "total_hours": "-",
                    "status": "Absent",
                    "date": date.strftime('%d-%m-%Y')
                })

        # Sort by username
        results = sorted(results, key=lambda x: x['username'].lower())

        # Write to CSV
        si = StringIO()
        writer = csv.writer(si)
        writer.writerow(['Username', 'Date', 'Time In', 'Time Out', 'Total Hours', 'Status'])

        for row in results:
            writer.writerow([row['username'], row['date'], row['time_in'], row['time_out'], row['total_hours'], row['status']])

        output = si.getvalue()
        filename = f"attendance_{date.strftime('%Y%m%d')}.csv"

        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment;filename={filename}"}
        )
    except Exception as e:
        print("CSV Export Error:", str(e))
        return jsonify({'success': False, 'message': 'Failed to export CSV'}), 500




@admin_bp.route('/summary-report', methods=['GET'])
def summary_report():
    try:
        report_type = request.args.get('type')  # 'weekly' or 'monthly'
        today = datetime.now().date()

        if report_type == 'weekly':
            start_date = today - timedelta(days=6)
        elif report_type == 'monthly':
            start_date = today.replace(day=1)
        else:
            return jsonify({'success': False, 'message': 'Invalid report type'}), 400

        end_date = today
        all_dates = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
        employees = Employee.query.all()
        employee_names = {emp.id: emp.username for emp in employees}
        employee_count = len(employees)

        summary = []

        for date in all_dates:
            records = Attendance.query.filter(Attendance.date == date).all()
            present_ids = {rec.employee_id for rec in records}
            present_names = [employee_names[pid] for pid in present_ids]
            absent_names = [name for id_, name in employee_names.items() if id_ not in present_ids]

            summary.append({
                "date": date.strftime("%Y-%m-%d"),
                "present": len(present_names),
                "absent": employee_count - len(present_names),
                "present_names": present_names,
                "absent_names": absent_names
            })

        return jsonify({'success': True, 'summary': summary})
    except Exception as e:
        print("Summary Report Error:", e)
        return jsonify({'success': False, 'message': 'Error generating summary'}), 500
