import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the Claude client
from apps.integrations.claude.client import ClaudeClient
from apps.integrations.claude.exceptions import ClaudeClientException

# Test the Claude client
try:
    print("Testing Claude client...")
    result = ClaudeClient.get_code_completion(
        prompt="Write a simple Python function to calculate the factorial of a number.",
        language="Python"
    )

    print("\nClient Response:")
    print(f"Model: {result.model}")
    print(f"Stop Reason: {result.stop_reason}")

    print("\nCode Completion:")
    print(result.content)

    print("\nToken Usage:")
    print(f"Input tokens: {result.usage.input_tokens}")
    print(f"Output tokens: {result.usage.output_tokens}")
    print(f"Total tokens: {result.usage.total_tokens}")

    print("\nClaude client is working successfully!")

except ClaudeClientException as e:
    print(f"\nClaude client error: {e}")
except Exception as e:
    print(f"\nUnexpected error: {e}")
