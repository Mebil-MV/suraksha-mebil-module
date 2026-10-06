from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class SafetyTipModel(Base):
    __tablename__ = "safety_tips"
    id = Column(Integer, primary_key=True, index=True)
    hazard_type = Column(String(50), nullable=False)  # landslide, flood, earthquake, fire, general
    phase = Column(String(20), nullable=False)  # before, during, after
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    content_hi = Column(Text, nullable=True)  # Hindi translation
    icon = Column(String(10), default="💡")
    order_index = Column(Integer, default=0)

class MicroChallengeModel(Base):
    __tablename__ = "micro_challenges"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    title_hi = Column(String(200), nullable=True)
    description = Column(Text, nullable=False)
    description_hi = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)  # knowledge, kit, drill, plan
    points = Column(Integer, default=10)
    icon = Column(String(10), default="🎯")

class UserMicroChallengeModel(Base):
    __tablename__ = "user_micro_challenges"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True, nullable=False)
    challenge_id = Column(Integer, nullable=False)
    completed_at = Column(DateTime, server_default=func.now())
