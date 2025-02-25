/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getHeaders } from './utils/headers.js';
import { ChatMessage, MessageContent } from './interface.js';

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

// Simple token counter approximation
// For exact counts, you should use a tokenizer library like tiktoken
export function countTokensApprox(text: string): number {
	if (!text) return 0;

	// Simple approximation: Claude models average ~4 chars per token
	const charCount = text.length;
	return Math.ceil(charCount / 4);
}

// Convert chat messages to Claude format
export function formatChatMessages(messages: ChatMessage[]): string {
	let formattedMessages = '';

	for (const message of messages) {
		const role = message.role.toLowerCase();
		let content = '';

		if (typeof message.content === 'string') {
			content = message.content;
		} else if (Array.isArray(message.content)) {
			content = message.content
				.map((part) => {
					if (part.type === 'text' && part.text) {
						return part.text;
					}
					// Handle image parts as needed
					return '';
				})
				.join('');
		}

		if (role === 'user' || role === 'human') {
			formattedMessages += `\n\nHuman: ${content}`;
		} else if (role === 'assistant') {
			formattedMessages += `\n\nAssistant: ${content}`;
		} else if (role === 'system') {
			// System message at the beginning gets special handling
			formattedMessages = `\n\nHuman: <system>\n${content}\n</system>\n${formattedMessages}`;
		}
	}

	// Ensure we end with Assistant:
	if (!formattedMessages.endsWith('Assistant: ')) {
		formattedMessages += '\n\nAssistant: ';
	}

	return formattedMessages;
}

// Strip images from content
export function stripImages(content: string | MessageContent[]): string {
	if (typeof content === 'string') {
		return content;
	}

	return content
		.filter((part) => part.type === 'text')
		.map((part) => part.text || '')
		.join('');
}
