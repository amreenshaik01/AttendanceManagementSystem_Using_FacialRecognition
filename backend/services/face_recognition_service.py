import os
import base64
import numpy as np
import cv2
import face_recognition
import pickle
from datetime import datetime

DATASET_DIR = "dataset"
ENCODINGS_FILE = "encodings.pkl"
BACKUP_DIR = "backup_encodings"


def save_dataset_image(username, img_base64, idx):
    user_dir = os.path.join(DATASET_DIR, username)
    os.makedirs(user_dir, exist_ok=True)
    img_data = base64.b64decode(img_base64.split(',')[1])
    img_array = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    path = os.path.join(user_dir, f"{username}_{idx}.jpg")
    cv2.imwrite(path, image)


def train_model():
    known_encodings = []
    known_names = []

    print("\n[INFO] Starting training...")

    if not os.path.exists(DATASET_DIR):
        print(f"[ERROR] Dataset directory '{DATASET_DIR}' does not exist.")
        return

    for username in os.listdir(DATASET_DIR):
        user_folder = os.path.join(DATASET_DIR, username)
        if not os.path.isdir(user_folder):
            continue

        print(f"[INFO] Processing user: {username}")
        for img_file in os.listdir(user_folder):
            path = os.path.join(user_folder, img_file)
            image = cv2.imread(path)
            if image is None:
                print(f"[WARNING] Could not read image {path}")
                continue

            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            boxes = face_recognition.face_locations(rgb, model='hog')
            encodings = face_recognition.face_encodings(rgb, boxes)

            if not encodings:
                print(f"[WARNING] No face found in {path}")
                continue

            for encoding in encodings:
                known_encodings.append(encoding)
                known_names.append(username)

    if not known_encodings:
        print("[ERROR] No faces found to encode. Training aborted.")
        return

    # Backup old encodings
    if os.path.exists(ENCODINGS_FILE):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = os.path.join(BACKUP_DIR, f'encodings_backup_{timestamp}.pkl')
        os.rename(ENCODINGS_FILE, backup_path)
        print(f"[BACKUP] Old encodings saved to: {backup_path}")

    # Save new encodings
    print(f"[INFO] Saving {len(known_encodings)} total encodings...")
    data = {"encodings": known_encodings, "names": known_names}
    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump(data, f)

    print("[SUCCESS] Model trained and saved to encodings.pkl")


def recognize_face(image_base64):
    try:
        with open(ENCODINGS_FILE, 'rb') as f:
            data = pickle.load(f)

        print("[DEBUG] Loaded names:", set(data["names"]))

        img_bytes = base64.b64decode(image_base64.split(',')[1])
        img_array = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        faces = face_recognition.face_locations(rgb, model='hog')
        encodings = face_recognition.face_encodings(rgb, faces)

        if not encodings:
            print("[DEBUG] No face found in captured image.")
            return None

        for encoding in encodings:
            matches = face_recognition.compare_faces(data["encodings"], encoding, tolerance=0.5)
            face_distances = face_recognition.face_distance(data["encodings"], encoding)

            if len(face_distances) == 0:
                print("[DEBUG] No encodings to compare with.")
                return None

            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                matched_name = data["names"][best_match_index]
                print(f"[DEBUG] Recognized as: {matched_name}")
                return matched_name
            else:
                print("[DEBUG] No close match found.")

    except Exception as e:
        print("[ERROR] Face recognition error:", str(e))
    return None
