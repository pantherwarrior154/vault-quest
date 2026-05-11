import hashlib
import logging
import requests
import time
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models import VaultEntry
from app.encryption import decrypt_password

logger = logging.getLogger(__name__)

def check_password_breach(password: str) -> int:
    sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]

    try:
        response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        response.raise_for_status()
    except Exception:
        return -1

    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return int(count)
    return 0

def run_breach_scan(db_session: Session):
    entries = db_session.query(VaultEntry).all()
    if not entries:
        logger.info("[Breach Scan] No vault entries to scan.")
        return

    logger.info(f"[Breach Scan] Starting scan of {len(entries)} entries...")
    flagged = 0
    for entry in entries:
        password = decrypt_password(entry.encrypted_password)
        count = check_password_breach(password)
        if count >= 0:
            entry.breach_count = count
            entry.last_checked = datetime.now(timezone.utc)
            if count > 0:
                flagged += 1
                logger.warning(f"[Breach Scan] '{entry.service_name}' exposed {count:,} times!")
        time.sleep(1.5)
    db_session.commit()
    logger.info(f"[Breach Scan] Complete. {flagged}/{len(entries)} entries compromised.")
