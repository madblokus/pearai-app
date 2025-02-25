/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type {
	CompletionRequest,
	CompletionResponse,
	ClaudeModelInfo,
	IClaudeClient,
} from './interface.js';

import { getHeaders } from './utils/headers.js';
import { formatClaudePrompt, cleanClaudeResponse } from './utils.js';

// Default localhost URL with port 5001
const DEFAULT_CLAUDE_API_URL = 'http://localhost:5001';

export class ClaudeClient implements IClaudeClient {
	url: URL | undefined;

	constructor(
		serverUrl: string | undefined = DEFAULT_CLAUDE_API_URL,
		private readonly userToken: string | undefined,
	) {
		try {
			this.url =
				typeof serverUrl !== 'string' || serverUrl === ''
					? new URL(DEFAULT_CLAUDE_API_URL)
					: new URL(serverUrl);
		} catch (e) {
			console.warn('Invalid Claude API server url', e);
			try {
				this.url = new URL(DEFAULT_CLAUDE_API_URL);
			} catch {
				this.url = undefined;
			}
		}
	}

	getUserToken(): string | undefined {
		return this.userToken;
	}

	get connected(): boolean {
		return this.url !== undefined && this.userToken !== undefined;
	}

	// Claude-specific methods
	public async getCompletions(
		request: CompletionRequest,
	): Promise<CompletionResponse> {
		if (!this.url) {
			throw new Error('Claude API server URL is not defined');
		}

		const url = new URL('completions', this.url);
		const headers = await getHeaders();

		// Format the prompt properly for Claude if a system prompt is provided
		let formattedPrompt = request.prompt;
		if (request.system_prompt) {
			formattedPrompt = formatClaudePrompt(
				request.system_prompt,
				request.prompt,
			);
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await this.userToken}`,
					...headers,
				},
				body: JSON.stringify({
					...request,
					prompt: formattedPrompt,
				}),
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(
					`Failed to get completion (HTTP ${response.status}): ${text}`,
				);
			}

			const data = await response.json();

			// Clean up the response if needed
			if (data.completion) {
				data.completion = cleanClaudeResponse(data.completion);
			}

			return data;
		} catch (e) {
			console.error('Failed to get completion', e);
			throw e;
		}
	}

	public async getAvailableModels(): Promise<ClaudeModelInfo[]> {
		if (!this.url) {
			throw new Error('Claude API server URL is not defined');
		}

		const url = new URL('models', this.url);
		const headers = await getHeaders();

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${await this.userToken}`,
					...headers,
				},
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(
					`Failed to get models (HTTP ${response.status}): ${text}`,
				);
			}

			const data = await response.json();
			return (
				data.models || [
					{
						id: 'claude-3-opus-20240229',
						name: 'Claude 3 Opus',
						max_tokens: 200000,
						description: 'Most powerful Claude model for highly complex tasks',
					},
					{
						id: 'claude-3-sonnet-20240229',
						name: 'Claude 3 Sonnet',
						max_tokens: 180000,
						description: 'Ideal balance of intelligence and speed',
					},
					{
						id: 'claude-3-haiku-20240307',
						name: 'Claude 3 Haiku',
						max_tokens: 160000,
						description: 'Fastest and most compact Claude model',
					},
				]
			);
		} catch (e) {
			console.error('Failed to get models', e);
			// Fallback models if the API call fails
			return [
				{
					id: 'claude-3-opus-20240229',
					name: 'Claude 3 Opus',
					max_tokens: 200000,
					description: 'Most powerful Claude model for highly complex tasks',
				},
				{
					id: 'claude-3-sonnet-20240229',
					name: 'Claude 3 Sonnet',
					max_tokens: 180000,
					description: 'Ideal balance of intelligence and speed',
				},
				{
					id: 'claude-3-haiku-20240307',
					name: 'Claude 3 Haiku',
					max_tokens: 160000,
					description: 'Fastest and most compact Claude model',
				},
			];
		}
	}

	// General methods similar to localhost server
	public async getConfig(): Promise<{ configJson: string; configJs: string }> {
		const userToken = await this.userToken;
		const response = await fetch(new URL('sync', this.url).href, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});
		if (!response.ok) {
			throw new Error(
				`Failed to sync remote config (HTTP ${response.status}): ${response.statusText}`,
			);
		}
		const data = await response.json();
		return data;
	}
}
