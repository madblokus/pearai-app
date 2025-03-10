# Claude 3.7 Integration

This package provides React components for integrating Claude 3.7 AI into your SaaS Boilerplate application.

## Features

- Chat interface for Claude 3.7
- Support for different Claude 3.7 models (Sonnet, Haiku, Opus)
- Streaming responses
- Tool use capabilities
- File upload support

## Installation

The package is included in the SaaS Boilerplate monorepo. To use it in your webapp, add it to your dependencies:

```json
// packages/webapp/package.json
{
  "dependencies": {
    "@sb/webapp-libs-claude-integration": "*"
  }
}
```

Then run:

```bash
pnpm install
```

## Usage

### Basic Chat Component

```tsx
import { ClaudeChat } from '@sb/webapp-libs-claude-integration';

const MyComponent = () => {
  return (
    <div>
      <h1>Chat with Claude 3.7</h1>
      <ClaudeChat />
    </div>
  );
};
```

### With Custom Configuration

```tsx
import { ClaudeChat } from '@sb/webapp-libs-claude-integration';

const MyComponent = () => {
  return (
    <div>
      <h1>Custom Claude Chat</h1>
      <ClaudeChat 
        apiEndpoint="/api/claude_api/generate/"
        temperature={0.5}
        maxTokens={2000}
        initialMessages={[
          { role: 'assistant', content: 'Hello! How can I help you today?' }
        ]}
      />
    </div>
  );
};
```

## API Reference

### ClaudeChat Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiEndpoint` | string | '/api/claude_api/generate/' | API endpoint for Claude requests |
| `initialMessages` | Message[] | [] | Initial messages to display |
| `temperature` | number | 0.7 | Temperature for Claude responses |
| `maxTokens` | number | 1000 | Maximum tokens for Claude responses |
| `authToken` | string | undefined | Optional auth token for API requests |
| `className` | string | undefined | Optional CSS class name |

## Backend Requirements

This component requires the Claude API backend to be properly configured. Make sure you have:

1. Set up the Claude API endpoints in your Django backend
2. Configured your `CLAUDE_API_KEY` in your environment variables
3. Selected the appropriate `CLAUDE_MODEL` in your settings

## License

This package is part of the SaaS Boilerplate and is subject to the same license terms. 