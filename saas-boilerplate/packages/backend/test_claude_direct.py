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

# Set the model
model = "claude-3-7-sonnet-20250219"
print(f"Using model: {model}")

# Claude API URL
claude_url = "https://api.anthropic.com/v1/messages"

# Headers for the request
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "anthropic-version": "2023-06-01",
    "x-api-key": api_key
}

# Test data
test_data = {
    "model": model,
    "messages": [
        {
            "role": "user",
            "content": "Write a Python function to calculate the factorial of a number."
        }
    ],
    "max_tokens": 1000,
    "stream": False
}

# Make request to Claude API
print(f"Making request to {claude_url}...")
try:
    response = requests.post(
        claude_url,
        headers=headers,
        json=test_data
    )

    # Check response
    if response.status_code == 200:
        print("Success! Response:")
        response_data = response.json()
        print(json.dumps(response_data, indent=2))

        # Print token usage
        if "usage" in response_data:
            usage = response_data["usage"]
            print(f"\nToken usage: {usage['input_tokens']} input tokens, {usage['output_tokens']} output tokens")
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
        claude_url,
        headers=headers,
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
