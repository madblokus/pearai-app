from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ClaudeUsage(BaseModel):
    input_tokens: int
    output_tokens: int
    total_tokens: int


class ClaudeMessage(BaseModel):
    role: str
    content: str


class ClaudeResponse(BaseModel):
    id: str
    type: str
    model: str
    role: str
    content: List[Dict[str, Any]]
    usage: ClaudeUsage
    stop_reason: str
    stop_sequence: Optional[str] = None


class ClaudeVSCodeResponse(BaseModel):
    """Response model for VSCode integration"""
    id: str
    model: str
    content: str
    usage: ClaudeUsage
    stop_reason: str
    metadata: Optional[Dict[str, Any]] = None
