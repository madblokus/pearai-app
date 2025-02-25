# Claude API Integration

This folder contains the Claude API integration components that work seamlessly between VSCode extension and the Django server running on localhost:5001.

## Overview

The Claude API integration consists of multiple components:

- **Client**: Handles communication with the Claude API via the localhost server
- **Credentials**: Manages authentication and token handling
- **Utils**: Provides utility functions for formatting prompts and responses
- **Interface**: Defines TypeScript interfaces for type safety

## Configuration

By default, the client connects to `http://localhost:5001`. You can customize this by setting the `CLAUDE_API_URL` environment variable.

## Usage

### From VSCode Extension

```typescript
import { createClaudeClient } from 'saas-boilerplate/packages/backend/apps/claude_api';

// Create a client
const client = await createClaudeClient(undefined, 'your-access-token');

// Get completions
const response = await client.getCompletions({
  prompt: 'Tell me a joke',
  model: 'claude-3-haiku-20240307',
  temperature: 0.7,
  max_tokens: 1000
});

console.log(response.completion);
```

### From Django Server

The Django server can use the same client by installing it as a package or importing the code directly.

## Available Models

- `claude-3-opus-20240229`: Most powerful Claude model for highly complex tasks
- `claude-3-sonnet-20240229`: Ideal balance of intelligence and speed
- `claude-3-haiku-20240307`: Fastest and most compact Claude model

## Authentication

Authentication is handled via access tokens. The client supports both access tokens and refresh tokens for maintaining persistent authentication.

## Error Handling

The client includes robust error handling for API calls, with detailed error messages and appropriate fallbacks when necessary.

## Extension

To extend or modify this integration, simply update the relevant files. The modular design makes it easy to add new features or models as they become available.
