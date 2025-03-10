from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ClaudeUsage(BaseModel):
    input_tokens: int
    output_tokens: int
    total_tokens: int


class ClaudeMessage(BaseModel):
    role: str
    content: str


class ClaudeToolUse(BaseModel):
    id: str
    name: str
    input: Dict[str, Any]
    output: Optional[Any] = None


class ClaudeResponse(BaseModel):
    id: str
    type: str
    model: str
    role: str
    content: List[Dict[str, Any]]
    usage: ClaudeUsage
    stop_reason: str
    stop_sequence: Optional[str] = None
    tool_uses: Optional[List[ClaudeToolUse]] = None


class ClaudeVSCodeResponse(BaseModel):
    """Response model for VSCode integration"""
    id: str
    model: str
    content: str
    usage: ClaudeUsage
    stop_reason: str
    tool_uses: Optional[List[ClaudeToolUse]] = None
    metadata: Optional[Dict[str, Any]] = None


class ClaudeContentBlock(BaseModel):
    """Content block for streaming responses"""
    type: str
    text: Optional[str] = None
    source: Optional[Dict[str, Any]] = None


class ClaudeStreamingUpdate(BaseModel):
    """Update for streaming responses"""
    type: str
    message: Dict[str, Any]
    index: int
    content_block: Optional[ClaudeContentBlock] = None
    delta: Optional[Dict[str, Any]] = None
