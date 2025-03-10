"""Views for Claude API integration."""
import json
import os
import logging
import anthropic
from django.conf import settings
from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


logger = logging.getLogger(__name__)

# Load Claude settings from environment variables
CLAUDE_API_KEY = os.environ.get('CLAUDE_API_KEY')
CLAUDE_MODEL = os.environ.get('CLAUDE_MODEL', 'claude-3-7-sonnet-20250219')


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
        # Return information about Claude 3.7 models
        return Response({
            "available_models": [
                {
                    "id": "claude-3-7-sonnet-20250219",
                    "name": "Claude 3.7 Sonnet",
                    "is_default": True
                },
                {
                    "id": "claude-3-7-haiku-20250211",
                    "name": "Claude 3.7 Haiku",
                    "is_default": False
                },
                {
                    "id": "claude-3-7-opus-20250211",
                    "name": "Claude 3.7 Opus",
                    "is_default": False
                }
            ]
        })
    except Exception as e:
        logger.error(f"Error retrieving models: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tool_use(request):
    """
    Endpoint to use Claude 3.7 with tools.

    Expected request format:
    {
        "messages": [
            {"role": "user", "content": "What's the weather in San Francisco?"}
        ],
        "tools": [
            {
                "name": "get_weather",
                "description": "Get the current weather in a location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        "tool_choice": "auto",
        "max_tokens": 1000,
        "temperature": 0.7
    }
    """
    try:
        # Get parameters from request
        data = request.data
        messages = data.get('messages', [])
        tools = data.get('tools', [])
        tool_choice = data.get('tool_choice', 'auto')
        max_tokens = data.get('max_tokens', 1000)
        temperature = data.get('temperature', 0.7)

        # Validate input
        if not messages:
            return Response(
                {"error": "No messages provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not tools:
            return Response(
                {"error": "No tools provided"},
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
            tools=tools,
            tool_choice=tool_choice,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        # Prepare tool use data
        tool_uses = []
        if hasattr(response, 'tool_use'):
            for tool_use in response.tool_use:
                tool_uses.append({
                    "id": tool_use.id,
                    "name": tool_use.name,
                    "input": tool_use.input,
                })

        # Return the response
        return Response({
            "message": response.content[0].text if response.content else "",
            "model": response.model,
            "tool_uses": tool_uses,
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def stream_response(request):
    """
    Endpoint to stream responses from Claude 3.7.

    Expected request format:
    {
        "messages": [
            {"role": "user", "content": "Write a long story about a space adventure"}
        ],
        "max_tokens": 4000,
        "temperature": 0.7
    }
    """
    try:
        # Get parameters from request
        data = request.data
        messages = data.get('messages', [])
        max_tokens = data.get('max_tokens', 4000)
        temperature = data.get('temperature', 0.7)
        tools = data.get('tools', None)
        tool_choice = data.get('tool_choice', None)

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

        # Create the streaming response
        def event_stream():
            try:
                # Build request parameters
                params = {
                    "model": CLAUDE_MODEL,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature
                }
                
                if tools:
                    params["tools"] = tools
                    
                if tool_choice:
                    params["tool_choice"] = tool_choice
                
                # Send streaming request to Claude
                with client.messages.stream(**params) as stream:
                    for text in stream.text_stream:
                        yield f"data: {json.dumps({'text': text})}\n\n"
                    
                    # Send final message with complete response and metadata
                    final_message = {
                        "done": True,
                        "model": stream.get_final_message().model,
                        "usage": {
                            "input_tokens": stream.get_final_message().usage.input_tokens,
                            "output_tokens": stream.get_final_message().usage.output_tokens
                        }
                    }
                    
                    # Add tool uses if present
                    if hasattr(stream.get_final_message(), 'tool_use'):
                        tool_uses = []
                        for tool_use in stream.get_final_message().tool_use:
                            tool_uses.append({
                                "id": tool_use.id,
                                "name": tool_use.name,
                                "input": tool_use.input,
                            })
                        final_message["tool_uses"] = tool_uses
                    
                    yield f"data: {json.dumps(final_message)}\n\n"
            
            except Exception as e:
                logger.error(f"Streaming error: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return StreamingHttpResponse(
            event_stream(),
            content_type='text/event-stream'
        )

    except Exception as e:
        logger.error(f"Error setting up streaming: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
