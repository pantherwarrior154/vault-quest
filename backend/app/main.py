from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import sqlite3
from .encryption import encrypt_password, decrypt_password

app = FastAPI(title="Vault-Quest API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
DB_PATH = "vault_quest.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service_name TEXT NOT NULL,
            encrypted_password TEXT NOT NULL,
            armor_class TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class PotionRequest(BaseModel):
    length: int
    complexity: int

class VaultEntry(BaseModel):
    service_name: str
    password: str
    armor_class: str = "Common"

@app.get("/")
def read_root():
    return {"message": "Welcome to the Alchemist's Lab API"}

@app.post("/generate")
def generate_password(request: PotionRequest):
    import random
    import string
    
    charsets = {
        1: string.ascii_letters + string.digits,
        2: string.ascii_letters + string.digits + "!@#$%^&*",
        3: string.ascii_letters + string.digits + string.punctuation
    }
    
    charset = charsets.get(request.complexity, charsets[2])
    password = "".join(random.choice(charset) for _ in range(request.length))
    
    return {"password": password}

@app.post("/vault/add")
def add_to_vault(entry: VaultEntry):
    encrypted = encrypt_password(entry.password)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO vault (service_name, encrypted_password, armor_class) VALUES (?, ?, ?)",
        (entry.service_name, encrypted, entry.armor_class)
    )
    conn.commit()
    conn.close()
    
    return {"status": "Vaulted successfully!"}

@app.get("/vault/list")
def list_vault():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT service_name, encrypted_password, armor_class FROM vault")
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        decrypted = decrypt_password(row[1])
        results.append({
            "service_name": row[0],
            "password": decrypted,
            "armor_class": row[2]
        })
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
