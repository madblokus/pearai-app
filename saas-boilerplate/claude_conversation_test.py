#!/usr/bin/env python
"""
Test script for Claude API conversations.
This script allows for multi-turn conversations with Claude.
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:5001"
GENERATE_ENDPOINT = f"{BASE_URL}/api/claude/generate/"

# You'll need to replace this with a valid authentication token
AUTH_TOKEN = "your_auth_token_here"  # Replace with your actual token

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {AUTH_TOKEN}"  # Adjust if your auth method is different
}

def send_message_to_claude(messages, max_tokens=1000, temperature=0.7):
    """Send a message to Claude and get a response."""
    data = {
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature
    }

    try:
        response = requests.post(GENERATE_ENDPOINT, headers=headers, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Error connecting to Claude API: {str(e)}")
        return None

def interactive_conversation():
    """Start an interactive conversation with Claude."""
    print("\nInteractive Conversation with Claude")
    print("Type 'exit' to end the conversation")
    print("=" * 50)

    # Keep track of the conversation history
    conversation = []

    while True:
        # Get user input
        user_message = input("\nYou: ")

        if user_message.lower() == 'exit':
            print("Ending conversation. Goodbye!")
            break

        # Add user message to conversation history
        conversation.append({"role": "user", "content": user_message})

        # Send the full conversation history to Claude
        response_data = send_message_to_claude(conversation)

        if response_data:
            claude_response = response_data.get("message", "No response")

            # Print Claude's response
            print(f"\nClaude: {claude_response}")

            # Add Claude's response to conversation history
            conversation.append({"role": "assistant", "content": claude_response})

            # Print token usage
            usage = response_data.get("usage", {})
            print(f"\n[Token usage - Input: {usage.get('input_tokens', 'N/A')}, Output: {usage.get('output_tokens', 'N/A')}]")
        else:
            print("\nFailed to get a response from Claude.")

def run_predefined_conversation():
    """Run a predefined conversation with Claude for testing."""
    print("\nRunning Predefined Conversation Test")
    print("=" * 50)

    # Predefined conversation for testing
    test_conversation = [
        {"role": "user", "content": "Hello Claude, how are you today?"},
        # Claude's response will be added here
        {"role": "user", "content": "Can you tell me about your capabilities?"},
        # Claude's response will be added here
        {"role": "user", "content": "Write a short poem about AI."}
        # Claude's response will be added here
    ]

    conversation = []

    for i, message in enumerate(test_conversation):
        # Add user message to conversation
        conversation.append(message)
        print(f"\nUser: {message['content']}")

        # Get Claude's response
        response_data = send_message_to_claude(conversation)

        if response_data:
            claude_response = response_data.get("message", "No response")
            print(f"\nClaude: {claude_response}")

            # Add Claude's response to the conversation
            conversation.append({"role": "assistant", "content": claude_response})

            # Print token usage
            usage = response_data.get("usage", {})
            print(f"\n[Token usage - Input: {usage.get('input_tokens', 'N/A')}, Output: {usage.get('output_tokens', 'N/A')}]")
            print("-" * 50)
        else:
            print("\nFailed to get a response from Claude.")
            break

if __name__ == "__main__":
    print("Claude API Conversation Test")
    print("=" * 50)
    print("1. Interactive conversation")
    print("2. Run predefined conversation test")
    print("=" * 50)

    choice = input("Enter your choice (1 or 2): ")

    if choice == "1":
        interactive_conversation()
    elif choice == "2":
        run_predefined_conversation()
    else:
        print("Invalid choice. Exiting.")
