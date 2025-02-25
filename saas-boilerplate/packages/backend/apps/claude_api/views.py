"""Views for Claude API integration."""
import json
import os
import logging
import anthropic
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


logger = logging.getLogger(__name__)

# Load Claude settings from environment variables
CLAUDE_API_KEY = os.environ.get('CLAUDE_API_KEY')
CLAUDE_MODEL = os.environ.get('CLAUDE_MODEL', 'claude-3-opus-20240229')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_response(request):
    """
    Endpoint to send a message to Claude and get a response.

    Expected request format:
    {
        "messages": [
            {"role": "user", "content": "Hello, Claude!"}
        ],
        "max_tokens": 1000,
        "temperature": 0.7
    }
    """
    try:
        # Get parameters from request
        data = request.data
        messages = data.get('messages', [])
        max_tokens = data.get('max_tokens', 1000)
        temperature = data.get('temperature', 0.7)

        # Validate input
        if not messages:
            return Response(
                {"error": "No messages provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if API key is configured
        if not CLAUDE_API_KEY:
            logger.error("Claude API key not configured")
            return Response(
                {"error": "Claude API is not properly configured"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Initialize Anthropic client
        client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

        # Send request to Claude
        response = client.messages.create(
            model=CLAUDE_MODEL,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        # Return the response
        return Response({
            "message": response.content[0].text,
            "model": response.model,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens
            }
        })

    except anthropic.APIError as e:
        logger.error(f"Claude API error: {str(e)}")
        return Response(
            {"error": f"Claude API error: {str(e)}"},
            status=status.HTTP_502_BAD_GATEWAY
        )
    except Exception as e:
        logger.error(f"Error processing Claude request: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_models(request):
    """
    Endpoint to get information about available Claude models.
    """
    try:
        # This is a simple endpoint that just returns the configured model
        # In a real-world scenario, you might want to query the Anthropic API
        # to get the actual list of available models
        return Response({
            "available_models": [
                {
                    "id": CLAUDE_MODEL,
                    "name": CLAUDE_MODEL,
                    "is_default": True
                }
            ]
        })
    except Exception as e:
        logger.error(f"Error retrieving models: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
