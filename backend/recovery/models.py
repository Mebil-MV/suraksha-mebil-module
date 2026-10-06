import json
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class DamageReportModel(Base):
    __tablename__ = "damage_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    category = Column(String(50), nullable=False)  # building, road, bridge, infrastructure, other
    severity = Column(String(20), nullable=False)  # minor, moderate, severe, destroyed
    description = Column(Text, nullable=True)
    image_refs_payload = Column(Text, default="[]")  # JSON array of image reference strings
    estimated_cost = Column(Float, nullable=True)
    status = Column(String(30), default="submitted")  # submitted, under_review, verified, approved, rejected
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    @property
    def image_refs(self):
        return json.loads(self.image_refs_payload) if self.image_refs_payload else []
    
    def set_image_refs(self, refs):
        self.image_refs_payload = json.dumps(refs)

class RecoverySchemeModel(Base):
    __tablename__ = "recovery_schemes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    authority = Column(String(200), nullable=True)  # Which govt body
    contact_info = Column(String(300), nullable=True)
    link = Column(String(500), nullable=True)
    hazard_type = Column(String(50), nullable=True)  # landslide, flood, earthquake, all
    max_compensation = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
