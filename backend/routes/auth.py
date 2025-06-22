from flask import Blueprint, request, jsonify
from database import get_db_connection
import hashlib

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    hashed = hash_password(password)

    try:
        cur.execute("INSERT INTO admins (username, password) VALUES (?, ?)", (username, hashed))
        conn.commit()
    except Exception:
        conn.close()
        return jsonify({'error': 'User already exists'}), 409

    conn.close()
    return jsonify({'message': 'Admin registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    hashed = hash_password(password)
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM admins WHERE username = ? AND password = ?", (username, hashed))
    user = cur.fetchone()
    conn.close()

    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
