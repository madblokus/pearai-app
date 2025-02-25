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

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await this.userToken}`,
					...headers,
				},
				body: JSON.stringify(request),
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(
					`Failed to get completion (HTTP ${response.status}): ${text}`,
				);
			}

			const data = await response.json();
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
			return data.models || [];
		} catch (e) {
			console.error('Failed to get models', e);
			return [];
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
