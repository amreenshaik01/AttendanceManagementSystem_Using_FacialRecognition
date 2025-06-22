import os
import cv2
import face_recognition
import numpy as np
import pickle
from datetime import datetime

DATASET_DIR = 'dataset'
ENCODINGS_FILE = 'encodings.pkl'
BACKUP_DIR = 'backup_encodings'

def train_model():
    known_encodings = []
    known_names = []

    print("\n[INFO] Starting training...")
    
    if not os.path.exists(DATASET_DIR):
        print(f"[ERROR] Dataset directory '{DATASET_DIR}' does not exist.")
        return

    for user_folder in os.listdir(DATASET_DIR):
        user_path = os.path.join(DATASET_DIR, user_folder)
        if not os.path.isdir(user_path):
            continue

        print(f"[INFO] Processing user: {user_folder}")
        image_count = 0
        for img_name in os.listdir(user_path):
            img_path = os.path.join(user_path, img_name)
            image = cv2.imread(img_path)

            if image is None:
                print(f"[WARNING] Could not read {img_path}, skipping.")
                continue

            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            boxes = face_recognition.face_locations(rgb, model='hog')
            encodings = face_recognition.face_encodings(rgb, boxes)

            if not encodings:
                print(f"[WARNING] No face found in {img_path}")
                continue

            for encoding in encodings:
                known_encodings.append(encoding)
                known_names.append(user_folder)
                image_count += 1

        print(f"[INFO] Encoded {image_count} face(s) for {user_folder}")

    # Backup old encodings
    if os.path.exists(ENCODINGS_FILE):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = os.path.join(BACKUP_DIR, f'encodings_backup_{timestamp}.pkl')
        os.rename(ENCODINGS_FILE, backup_path)
        print(f"[BACKUP] Old encodings saved to: {backup_path}")
    
    if not known_encodings:
        print("[ERROR] No faces found to encode. Training aborted.")
        return


    # Save new encodings
    print(f"[INFO] Saving {len(known_encodings)} total encodings...")
    data = {"encodings": known_encodings, "names": known_names}
    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump(data, f)

    print("[SUCCESS] Model trained and saved to encodings.pkl")

if __name__ == "__main__":
    train_model()
