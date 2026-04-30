from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from .encryption import encrypt_password, decrypt_password
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .models import Base, User, VaultEntry

# --- Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-quest-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "726201702658-a01oskaisbkkpnpltij5f573johk2836.apps.googleusercontent.com")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./vault_quest.db")

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vault-Quest API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Database Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Helpers ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Pydantic Models ---
class UserCreate(BaseModel):
    username: str
    password: str

class ProfileUpdate(BaseModel):
    display_name: str
    avatar_url: str

class GoogleAuthRequest(BaseModel):
    credential: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PotionRequest(BaseModel):
    length: int
    complexity: int

class VaultEntryCreate(BaseModel):
    service_name: str
    password: str
    armor_class: str = "Common"

class VaultEntryOut(BaseModel):
    id: int
    service_name: str
    password: str
    armor_class: str

# --- Dependency ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None: raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise credentials_exception
    return user

# --- Routes ---

@app.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username exists")
    
    hashed_pw = get_password_hash(user_in.password[:72])
    new_user = User(
        username=user_in.username,
        hashed_password=hashed_pw,
        role='admin' if user_in.username.lower() in ['eden17', 'pantherwarrior154'] else 'user'
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username, "user_id": new_user.id, "role": new_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/google")
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        id_info = id_token.verify_oauth2_token(request.credential, google_requests.Request(), GOOGLE_CLIENT_ID)
        email = id_info['email']
        google_id = id_info['sub']
        
        # Check if user exists by google_id or google_email
        user = db.query(User).filter((User.google_id == google_id) | (User.google_email == email)).first()
        
        if not user:
            # Create new user
            username = email.split('@')[0]
            # Handle potential username collision
            base_username = username
            counter = 1
            while db.query(User).filter(User.username == username).first():
                username = f"{base_username}{counter}"
                counter += 1
            
            import secrets
            user = User(
                username=username,
                google_id=google_id,
                google_email=email,
                display_name=id_info.get('name'),
                avatar_url=None, # Leave null to trigger initiation screen
                hashed_password=get_password_hash(secrets.token_urlsafe(32)),
                role='admin' if username.lower() in ['eden17', 'pantherwarrior154'] or email.lower() in ['eden17@gmail.com', 'pantherwarrior154@gmail.com'] else 'user'
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update google_id if it was missing (linked by email)
            if not user.google_id:
                user.google_id = google_id
                db.commit()
                db.refresh(user)

        access_token = create_access_token(data={"sub": user.username, "user_id": user.id, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Google Auth Error: {e}")
        raise HTTPException(status_code=400, detail="Google Gate Barred")

@app.post("/token", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/profile/update")
def update_profile(profile: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.display_name = profile.display_name
    current_user.avatar_url = profile.avatar_url
    db.commit()
    return {"status": "Legend updated!"}

@app.get("/user/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "display_name": current_user.display_name,
        "avatar_url": current_user.avatar_url
    }

@app.post("/generate")
def generate_password(request: PotionRequest):
    import random, string
    charsets = {1: string.ascii_letters + string.digits, 2: string.ascii_letters + string.digits + "!@#$%^&*", 3: string.ascii_letters + string.digits + string.punctuation}
    charset = charsets.get(request.complexity, charsets[2])
    return {"password": "".join(random.choice(charset) for _ in range(request.length))}

@app.post("/vault/add")
def add_to_vault(entry: VaultEntryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_entry = VaultEntry(
        user_id=current_user.id,
        service_name=entry.service_name,
        encrypted_password=encrypt_password(entry.password),
        armor_class=entry.armor_class
    )
    db.add(new_entry)
    db.commit()
    return {"status": "Vaulted!"}

@app.get("/vault/list", response_model=List[VaultEntryOut])
def list_vault(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = db.query(VaultEntry).filter(VaultEntry.user_id == current_user.id).all()
    return [{"id": e.id, "service_name": e.service_name, "password": decrypt_password(e.encrypted_password), "armor_class": e.armor_class} for e in entries]

@app.delete("/vault/delete/{entry_id}")
def delete_vault_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(VaultEntry).filter(VaultEntry.id == entry_id, VaultEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Secret not found in your vault")
    db.delete(entry)
    db.commit()
    return {"status": "Secret banished from vault"}

@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403)
    u_count = db.query(User).count()
    p_count = db.query(VaultEntry).count()
    return {"total_users": u_count, "total_potions": p_count, "kingdom_status": "⚔️ Secure" if p_count > 0 else "🛡️ Vulnerable"}

@app.get("/admin/users")
def list_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403)
    users = db.query(User).all()
    return [
        {"id": u.id, "username": u.username, "role": u.role, "created_at": u.created_at, "display_name": u.display_name, "avatar_url": u.avatar_url}
        for u in users
    ]

@app.delete("/admin/user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403)
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="Hero not found")
    if user.id == current_user.id: raise HTTPException(status_code=400, detail="Cannot banish yourself")
    db.delete(user)
    db.commit()
    return {"status": "Banishment complete"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
