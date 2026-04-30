from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    role = Column(String(20), nullable=False, default='user')
    
    google_id = Column(String(255), unique=True, nullable=True)
    google_email = Column(String(120), unique=True, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    
    vault_entries = relationship("VaultEntry", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(username='{self.username}', role='{self.role}')>"

class VaultEntry(Base):
    __tablename__ = 'vault'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    service_name = Column(String(100), nullable=False)
    encrypted_password = Column(Text, nullable=False)
    armor_class = Column(String(50), default="Common")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="vault_entries")

    def __repr__(self):
        return f"<VaultEntry(service_name='{self.service_name}', user_id='{self.user_id}')>"
