import hashlib
import requests
import time
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models import VaultEntry
from app.encryption import decrypt_password

def check_password_breach(password: str) -> int:
    sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]
    
    try:
        response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        response.raise_for_status()
    except Exception:
        return -1  # Indicate service error
    
    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return int(count)
    return 0

def run_breach_scan(db_session: Session):
    entries = db_session.query(VaultEntry).all()
    for entry in entries:
        password = decrypt_password(entry.encrypted_password)
        count = check_password_breach(password)
        if count >= 0:
            entry.breach_count = count
            entry.last_checked = datetime.now(timezone.utc)
        time.sleep(1.5)
    db_session.commit()
