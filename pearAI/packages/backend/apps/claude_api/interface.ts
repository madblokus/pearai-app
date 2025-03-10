/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface CompletionRequest {
	prompt: string;
	model: string;
	temperature?: number;
	max_tokens?: number;
	system_prompt?: string;
}

export interface CompletionResponse {
	id: string;
	completion: string;
	model: string;
	stop_reason: string;
}

export interface ClaudeModelInfo {
	id: string;
	name: string;
	max_tokens: number;
	description: string;
}

export interface IClaudeClient {
	connected: boolean;
	url: URL | undefined;
	getUserToken(): string | undefined;

	// Claude-specific methods
	getCompletions(request: CompletionRequest): Promise<CompletionResponse>;
	getAvailableModels(): Promise<ClaudeModelInfo[]>;

	// General methods similar to localhost server
	getConfig(): Promise<{ configJson: string; configJs: string }>;
}
