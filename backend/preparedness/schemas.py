from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class SafetyTipResponse(BaseModel):
    id: int
    hazard_type: str
    phase: str
    title: str
    content: str
    content_hi: Optional[str] = None
    icon: str = "💡"
    order_index: int = 0
    class Config:
        from_attributes = True

class SafetyTipCreate(BaseModel):
    hazard_type: str
    phase: str
    title: str
    content: str
    content_hi: Optional[str] = None
    icon: str = "💡"
    order_index: int = 0

class MicroChallengeResponse(BaseModel):
    id: int
    title: str
    title_hi: Optional[str] = None
    description: str
    description_hi: Optional[str] = None
    category: str
    points: int
    icon: str = "🎯"
    is_completed: bool = False
    class Config:
        from_attributes = True

class MicroChallengeCreate(BaseModel):
    title: str
    title_hi: Optional[str] = None
    description: str
    description_hi: Optional[str] = None
    category: str
    points: int = 10
    icon: str = "🎯"

class MicroChallengeComplete(BaseModel):
    challenge_id: int

class ReadinessOverview(BaseModel):
    quiz_score: int
    quizzes_completed: int
    micro_challenges_completed: int
    total_points: int
    level: str  # beginner, intermediate, prepared, expert
    badges: List[str]
