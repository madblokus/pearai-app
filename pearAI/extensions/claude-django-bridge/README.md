# Claude Django Bridge Extension

This extension connects pearAI to a Claude API served by a Django backend from the saas-boilerplate project.

## Features

- Connects pearAI to a Claude API running on a Django backend
- Streams responses from the Claude API
- Supports authentication via Bearer token

## Requirements

- A running Django backend from saas-boilerplate with the Claude API endpoint
- The backend should be running at `http://localhost:5001` by default

## Configuration

You can configure the extension by modifying the `.env` file:

```
SAAS_CLAUDE_API_URL=http://localhost:5001/api/claude/stream/
# Add your API key here if needed for authentication
# SAAS_CLAUDE_API_KEY=your_api_key
```

## Usage

1. Make sure your Django backend is running at `http://localhost:5001`
2. The extension will automatically register the `saas-claude` provider with pearAI
3. You can select the `saas-claude` provider in pearAI's settings

## Troubleshooting

If the extension doesn't register automatically, you can manually register it by running the command:
```
> Claude Django Bridge: Register Provider
```

## Development

To build the extension:

```bash
npm install
npm run compile
```

## License

This extension is licensed under the MIT License. 