from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# --- Volunteer ---
class VolunteerCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    skills: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class VolunteerResponse(BaseModel):
    id: int
    user_id: str
    full_name: str
    phone: Optional[str] = None
    skills: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_available: bool = True
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class VolunteerAvailabilityUpdate(BaseModel):
    is_available: bool

# --- Safe Check ---
class SafeCheckCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    message: str = "I am safe"

class SafeCheckResponse(BaseModel):
    id: int
    user_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    message: str
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- Help Request ---
class HelpRequestCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    request_type: str  # medical, rescue, shelter, food_water, other
    description: Optional[str] = None
    urgency: str = "medium"

class HelpRequestResponse(BaseModel):
    id: int
    user_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    request_type: str
    description: Optional[str] = None
    urgency: str
    status: str
    assigned_volunteer_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class HelpRequestStatusUpdate(BaseModel):
    status: str  # open, assigned, in_progress, resolved, closed

class HelpRequestAssign(BaseModel):
    volunteer_id: int

# --- Decision Support ---
class PriorityScore(BaseModel):
    help_request_id: int
    priority_score: float
    factors: dict
    recommendation: str
