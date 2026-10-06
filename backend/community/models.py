import json
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class VolunteerModel(Base):
    __tablename__ = "volunteers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True, nullable=False)  # links to auth username
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    skills_payload = Column(Text, default="[]")  # JSON array of skill strings
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    
    @property
    def skills(self):
        return json.loads(self.skills_payload) if self.skills_payload else []
    
    def set_skills(self, skills_list):
        self.skills_payload = json.dumps(skills_list)

class SafeCheckModel(Base):
    __tablename__ = "safe_checks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    message = Column(String(500), default="I am safe")
    created_at = Column(DateTime, server_default=func.now())

class HelpRequestModel(Base):
    __tablename__ = "help_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    request_type = Column(String(50), nullable=False)  # medical, rescue, shelter, food_water, other
    description = Column(Text, nullable=True)
    urgency = Column(String(20), default="medium")  # low, medium, high, critical
    status = Column(String(20), default="open")  # open, assigned, in_progress, resolved, closed
    assigned_volunteer_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
