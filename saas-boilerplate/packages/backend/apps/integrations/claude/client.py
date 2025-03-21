import json
import requests
from typing import List, Dict, Any, Optional

from config import settings
from .types import ClaudeResponse, ClaudeVSCodeResponse
from .exceptions import ClaudeClientException

CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
CLAUDE_API_ERROR_MSG = "Claude service is currently unavailable. Please try again in a couple seconds."


class ClaudeClient:
    @staticmethod
    def _make_request(messages: List[Dict[str, str]], max_tokens: int = 1000, temperature: float = 0.7,
                      system_prompt: Optional[str] = None) -> ClaudeResponse:
        """
        Make a request to the Claude API
        """
        headers = {
            "x-api-key": settings.CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }

        payload = {
            "model": settings.CLAUDE_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }

        if system_prompt:
            payload["system"] = system_prompt

        try:
            response = requests.post(CLAUDE_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            return ClaudeResponse(**response.json())
        except requests.exceptions.RequestException as error:
            raise ClaudeClientException(CLAUDE_API_ERROR_MSG) from error

    @staticmethod
    def get_code_completion(prompt: str, context: Optional[str] = None,
                           language: Optional[str] = None) -> ClaudeVSCodeResponse:
        """
        Get code completion from Claude for VSCode integration
        """
        messages = [{"role": "user", "content": prompt}]

        system_prompt = "You are a helpful AI coding assistant."
        if context:
            system_prompt += f" Here is some context about the code: {context}"
        if language:
            system_prompt += f" The user is working with {language} code."

        try:
            response = ClaudeClient._make_request(messages, max_tokens=2000, temperature=0.5, system_prompt=system_prompt)

            # Extract the text content from the response
            content_text = ""
            for content_item in response.content:
                if content_item.get("type") == "text":
                    content_text += content_item.get("text", "")

            # Create a VSCode-specific response
            vscode_response = ClaudeVSCodeResponse(
                id=response.id,
                model=response.model,
                content=content_text,
                usage=response.usage,
                stop_reason=response.stop_reason,
                metadata={
                    "original_response": response.dict()
                }
            )

            return vscode_response
        except Exception as error:
            raise ClaudeClientException(CLAUDE_API_ERROR_MSG) from error
