import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import base64

# Simple Master Key for Phase 1 (We'll make this user-set later)
MASTER_KEY = b"thisisaverysecretkeyforvaultques" # 32 bytes for AES-256

def encrypt_password(password: str) -> str:
    # Generate a random IV
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(MASTER_KEY), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    # Padding
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(password.encode()) + padder.finalize()
    
    # Encrypt
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    
    # Combine IV and encrypted data and encode to Base64
    result = base64.b64encode(iv + encrypted_data).decode('utf-8')
    return result

def decrypt_password(encrypted_password: str) -> str:
    # Decode from Base64
    data = base64.b64decode(encrypted_password)
    iv = data[:16]
    encrypted_data = data[16:]
    
    cipher = Cipher(algorithms.AES(MASTER_KEY), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    
    # Decrypt
    decrypted_padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
    
    # Unpadding
    unpadder = padding.PKCS7(128).unpadder()
    decrypted_data = unpadder.update(decrypted_padded_data) + unpadder.finalize()
    
    return decrypted_data.decode('utf-8')
