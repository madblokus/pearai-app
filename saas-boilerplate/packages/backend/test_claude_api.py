import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("CLAUDE_API_KEY")

# Use the specific model version
model = "claude-3-7-sonnet-20250219"

print(f"Using model: {model}")

# Claude API endpoint
url = "https://api.anthropic.com/v1/messages"

# Headers for the request
headers = {
    "x-api-key": api_key,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
}

# Payload for the request
payload = {
    "model": model,
    "messages": [{"role": "user", "content": "Hello, Claude! Can you confirm you're working properly?"}],
    "max_tokens": 100
}

# Make the request
try:
    print("Sending request to Claude API...")
    response = requests.post(url, headers=headers, json=payload)

    # Check if the request was successful
    response.raise_for_status()

    # Parse the response
    result = response.json()

    print("\nAPI Response:")
    print(f"Status Code: {response.status_code}")
    print(f"Model: {result.get('model')}")

    # Extract the content from the response
    content = ""
    for item in result.get("content", []):
        if item.get("type") == "text":
            content += item.get("text", "")

    print("\nClaude's Response:")
    print(content)

    # Print usage information
    if "usage" in result:
        usage = result["usage"]
        print("\nToken Usage:")
        print(f"Input tokens: {usage.get('input_tokens', 'N/A')}")
        print(f"Output tokens: {usage.get('output_tokens', 'N/A')}")
        print(f"Total tokens: {usage.get('total_tokens', 'N/A')}")

    print("\nConnection to Claude API is working successfully!")

except requests.exceptions.RequestException as e:
    print(f"\nError connecting to Claude API: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Status Code: {e.response.status_code}")
        try:
            error_data = e.response.json()
            print(f"Error Details: {json.dumps(error_data, indent=2)}")
        except:
            print(f"Response Text: {e.response.text}")
except Exception as e:
    print(f"\nUnexpected error: {e}")
