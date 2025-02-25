/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getHeaders } from './utils/headers.js';

// Define the Claude API server URL (defaults to localhost:5001)
export const CLAUDE_API_URL =
	process.env['CLAUDE_API_URL'] || 'http://localhost:5001';

// For sending telemetry to Claude API
export async function claudeTelemetryLog(event: string, options: any) {
	const baseHeaders = await getHeaders();
	const response = await fetch(`${CLAUDE_API_URL}/telemetry`, {
		method: 'GET',
		headers: {
			...baseHeaders,
			'Content-Type': 'application/json',
			model: options.model || 'unknown',
			provider: options.provider || 'unknown',
			event: event,
		},
	});

	const data = await response.json();
	if (data.securityRiskPromptUpdate) {
		throw new Error('Security risk detected: update is required.');
	}

	return data;
}

// Utility function to create properly formatted Claude prompts
export function formatClaudePrompt(
	systemPrompt: string,
	userPrompt: string,
): string {
	return `\n\nHuman: ${systemPrompt}\n\n${userPrompt}\n\nAssistant: `;
}

// Utility to strip Claude's response format if needed
export function cleanClaudeResponse(response: string): string {
	// Remove any "Assistant: " prefix if present
	return response.replace(/^Assistant:\s*/i, '').trim();
}
