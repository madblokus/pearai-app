import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("CLAUDE_API_KEY")
if not api_key:
    print("Error: CLAUDE_API_KEY environment variable not set")
    exit(1)

# Backend API URL
backend_url = "http://localhost:5001/api/claude/chat/"
auth_url = "http://localhost:5001/api/auth/login/"

# First, authenticate to get a valid JWT token
print(f"Authenticating with {auth_url}...")
try:
    # You'll need to replace these with valid credentials
    auth_data = {
        "email": "admin@example.com",
        "password": "password"
    }

    auth_response = requests.post(
        auth_url,
        headers={"Content-Type": "application/json"},
        json=auth_data
    )

    if auth_response.status_code == 200:
        auth_data = auth_response.json()
        jwt_token = auth_data.get("access")
        print("Successfully authenticated and got JWT token")
    else:
        print(f"Authentication failed: {auth_response.status_code}")
        print(auth_response.text)
        # Fall back to a dummy token for testing
        jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        print("Using dummy token for testing")
except Exception as e:
    print(f"Authentication exception: {str(e)}")
    # Fall back to a dummy token for testing
    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    print("Using dummy token for testing")

# Test data
test_data = {
    "messages": [
        {
            "role": "user",
            "content": "Write a Python function to calculate the factorial of a number."
        }
    ],
    "model": "claude-3-7-sonnet-20250219",
    "max_tokens": 1000,
    "stream": False
}

# Make request to backend API
print(f"Making request to {backend_url}...")
try:
    response = requests.post(
        backend_url,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {jwt_token}"
        },
        json=test_data
    )

    # Check response
    if response.status_code == 200:
        print("Success! Response:")
        response_data = response.json()
        print(json.dumps(response_data, indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Exception: {str(e)}")

# Test streaming response
print("\nTesting streaming response...")
test_data["stream"] = True
try:
    response = requests.post(
        backend_url,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {jwt_token}"
        },
        json=test_data,
        stream=True
    )

    # Check response
    if response.status_code == 200:
        print("Success! Streaming response:")
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    line_str = line_str[6:]
                    if line_str.strip() == "[DONE]":
                        break
                    try:
                        data = json.loads(line_str)
                        if 'delta' in data and 'text' in data['delta']:
                            print(data['delta']['text'], end='')
                    except json.JSONDecodeError:
                        print(f"Error decoding JSON: {line_str}")
        print("\nStreaming complete.")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Exception: {str(e)}")
