from typing import List, Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    is_admin: bool = False


class VisualOption(BaseModel):
    id: str
    symbol: str
    description_hint: Optional[str] = None

class ChallengeResponse(BaseModel):
    id: int
    hazard_type: str
    scenario_svg_key: str
    options: List[VisualOption]
    points: int

    class Config:
        from_attributes = True

class ChallengeCreate(BaseModel):
    hazard_type: str
    scenario_svg_key: str
    options: List[VisualOption]
    correct_option_id: str
    points: int


class ChallengeSubmission(BaseModel):
    selected_option_id: str

class VerificationResult(BaseModel):
    is_correct: bool
    correct_option_id: str
    points_awarded: int
    current_readiness_score: int
    unlocked_badge: Optional[str] = None

class UserReadinessProfile(BaseModel):
    user_id: str
    score: int
    completed_challenges: List[int]
    unlocked_badges: List[str]