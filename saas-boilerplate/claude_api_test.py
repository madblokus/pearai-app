#!/usr/bin/env python
"""
Test script for Claude API endpoints.
This script tests both the /api/claude/models/ and /api/claude/generate/ endpoints.
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:5001"
MODELS_ENDPOINT = f"{BASE_URL}/api/claude/models/"
GENERATE_ENDPOINT = f"{BASE_URL}/api/claude/generate/"

# You'll need to replace this with a valid authentication token
# This can be obtained after logging into your app
AUTH_TOKEN = "your_auth_token_here"  # Replace with your actual token

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {AUTH_TOKEN}"  # Adjust if your auth method is different
}

def test_models_endpoint():
    """Test the models endpoint to get available Claude models."""
    print("Testing GET /api/claude/models/...")

    try:
        response = requests.get(MODELS_ENDPOINT, headers=headers)

        # Print response status and data
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error connecting to the models endpoint: {str(e)}")

    print("\n" + "-" * 50 + "\n")

def test_generate_endpoint():
    """Test the generate endpoint to get a response from Claude."""
    print("Testing POST /api/claude/generate/...")

    # Example message to send to Claude
    data = {
        "messages": [
            {"role": "user", "content": "What's the capital of France?"}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }

    try:
        response = requests.post(GENERATE_ENDPOINT, headers=headers, json=data)

        # Print response status and data
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error connecting to the generate endpoint: {str(e)}")

if __name__ == "__main__":
    print("Claude API Endpoint Testing Script")
    print("=" * 50)
    print("Make sure the server is running on port 5001")
    print("=" * 50 + "\n")

    # First, test the models endpoint
    test_models_endpoint()

    # Then, test the generate endpoint
    test_generate_endpoint()

    print("\nTesting completed!")
