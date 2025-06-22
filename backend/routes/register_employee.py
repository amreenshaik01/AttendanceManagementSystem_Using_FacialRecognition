import os
import base64
import numpy as np
import face_recognition
from io import BytesIO
from PIL import Image
from werkzeug.security import generate_password_hash
from flask import Blueprint, request, jsonify
from models import db, Employee
from datetime import datetime

register_employee_bp = Blueprint('register_employee', __name__)

# Directory to save employee images
EMPLOYEE_IMAGES_DIR = os.path.join(os.getcwd(), "static", "employee_images")
os.makedirs(EMPLOYEE_IMAGES_DIR, exist_ok=True)

def save_employee_image(name, image):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f"{name}_{timestamp}.jpg"
    filepath = os.path.join(EMPLOYEE_IMAGES_DIR, filename)
    image.save(filepath)
    return filepath

@register_employee_bp.route('/register', methods=['POST'])
def register_employee():
    data = request.get_json()

    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    face_base64 = data.get('faceImage')

    if not all([full_name, email, password, face_base64]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if employee already exists
    if Employee.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409

    try:
        # Decode base64 to image
        face_bytes = base64.b64decode(face_base64.split(',')[1])
        image = Image.open(BytesIO(face_bytes))
        image_np = np.array(image)

        # Get face encoding
        encodings = face_recognition.face_encodings(image_np)
        if not encodings:
            return jsonify({'error': 'No face detected in the image'}), 422

        encoding = encodings[0]
        encoding_list = encoding.tolist()

        # Save image to disk
        image_path = save_employee_image(full_name, image)

        # Save to DB
        new_employee = Employee(
            full_name=full_name,
            email=email,
            password=generate_password_hash(password),
            face_encoding=str(encoding_list),
            image_path=image_path,
            role='employee'
        )
        db.session.add(new_employee)
        db.session.commit()

        return jsonify({'message': 'Employee registered successfully'}), 201

    except Exception as e:
        print('Error:', str(e))
        return jsonify({'error': 'Registration failed'}), 500
