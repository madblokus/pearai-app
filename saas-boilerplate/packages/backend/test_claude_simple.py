import os
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("CLAUDE_API_KEY")
model = os.getenv("CLAUDE_MODEL", "claude-3-7-sonnet-20250219")

# Define the same classes as in the actual client but simplified
class ClaudeUsage(BaseModel):
    input_tokens: int
    output_tokens: int
    total_tokens: int

class ClaudeResponse(BaseModel):
    id: str
    type: str
    model: str
    role: str
    content: List[Dict[str, Any]]
    usage: ClaudeUsage
    stop_reason: str
    stop_sequence: Optional[str] = None

class SimpleClaudeClient:
    @staticmethod
    def _make_request(messages, max_tokens=1000, temperature=0.7, system_prompt=None):
        """
        Make a request to the Claude API
        """
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }

        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }

        if system_prompt:
            payload["system"] = system_prompt

        print("Using headers:", headers)
        print("Using payload:", payload)

        response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
        response.raise_for_status()
        return ClaudeResponse(**response.json())

    @staticmethod
    def get_code_completion(prompt, context=None, language=None):
        """
        Get code completion from Claude
        """
        messages = [{"role": "user", "content": prompt}]

        system_prompt = "You are a helpful AI coding assistant."
        if context:
            system_prompt += f" Here is some context about the code: {context}"
        if language:
            system_prompt += f" The user is working with {language} code."

        response = SimpleClaudeClient._make_request(messages, max_tokens=2000, temperature=0.5, system_prompt=system_prompt)

        # Extract text content
        content_text = ""
        for content_item in response.content:
            if content_item.get("type") == "text":
                content_text += content_item.get("text", "")

        return {
            "id": response.id,
            "model": response.model,
            "content": content_text,
            "usage": response.usage,
            "stop_reason": response.stop_reason
        }

# Test the simple Claude client
try:
    print("Testing Simple Claude client...")
    print(f"Using API key: {api_key[:5]}...{api_key[-5:] if api_key else None}")
    print(f"Using model: {model}")

    result = SimpleClaudeClient.get_code_completion(
        prompt="Write a simple Python function to calculate the factorial of a number.",
        language="Python"
    )

    print("\nClient Response:")
    print(f"Model: {result['model']}")
    print(f"Stop Reason: {result['stop_reason']}")

    print("\nCode Completion:")
    print(result['content'])

    print("\nToken Usage:")
    print(f"Input tokens: {result['usage'].input_tokens}")
    print(f"Output tokens: {result['usage'].output_tokens}")
    print(f"Total tokens: {result['usage'].total_tokens}")

    print("\nSimple Claude client is working successfully!")

except Exception as e:
    print(f"\nError: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Status Code: {e.response.status_code}")
        try:
            error_data = e.response.json()
            print(f"Error Details: {error_data}")
        except:
            print(f"Response Text: {e.response.text}")
