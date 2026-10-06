import json
from sqlalchemy import Column, Integer, String, Text, Boolean
from database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)


class ChallengeModel(Base):
    __tablename__ = "preparedness_challenges"

    id = Column(Integer, primary_key=True, index=True)
    hazard_type = Column(String(50), nullable=False)
    difficulty = Column(String(20), default="basic")
    scenario_svg_key = Column(String(50), nullable=False)
    options_payload = Column(Text, nullable=False)
    correct_option_id = Column(String(50), nullable=False)
    points = Column(Integer, default=25)

    @property
    def options(self):
        return json.loads(self.options_payload)

class UserReadinessModel(Base):
    __tablename__ = "user_readiness"

    user_id = Column(String(100), primary_key=True, index=True)
    score = Column(Integer, default=0)
    completed_challenges = Column(Text, default="[]")
    unlocked_badges = Column(Text, default="[]")

    def get_completed(self):
        return json.loads(self.completed_challenges)

    def set_completed(self, list_data):
        self.completed_challenges = json.dumps(list_data)

    def get_badges(self):
        return json.loads(self.unlocked_badges)

    def set_badges(self, list_data):
        self.unlocked_badges = json.dumps(list_data)
        