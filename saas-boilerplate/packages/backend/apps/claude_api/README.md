# Claude API Integration

This Django app provides an API integration with Anthropic's Claude AI model.

## Setup

1. Ensure you have the `anthropic` Python package installed:
```bash
pip install anthropic
```

2. Configure your environment variables in the `.env` file:
```
CLAUDE_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-3-7-sonnet-20250219  # or your preferred model
```

## API Endpoints

### Generate Claude Response
`POST /api/claude/generate/`

This endpoint sends a message to Claude and returns the AI's response.

#### Request Format
```json
{
  "messages": [
    {"role": "user", "content": "Hello, Claude!"}
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
```

#### Response Format
```json
{
  "message": "Hello! I'm Claude, an AI assistant created by Anthropic...",
  "model": "claude-3-7-sonnet-20250219",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 42
  }
}
```

### Get Available Models
`GET /api/claude/models/`

Returns information about the available Claude models.

#### Response Format
```json
{
  "available_models": [
    {
      "id": "claude-3-7-sonnet-20250219",
      "name": "claude-3-7-sonnet-20250219",
      "is_default": true
    }
  ]
}
```

## Authentication

All endpoints require authentication using your SaaS Boilerplate authentication system.
