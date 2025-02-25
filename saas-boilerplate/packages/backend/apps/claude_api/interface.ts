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
	stop?: string[];
	top_p?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
}

export interface CompletionResponse {
	id: string;
	completion: string;
	model: string;
	stop_reason: string;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

export interface ClaudeModelInfo {
	id: string;
	name: string;
	max_tokens: number;
	description: string;
}

export interface MessageContent {
	type: string;
	text?: string;
	source?: {
		type: string;
		media_type: string;
		data: string;
	};
}

export interface ChatMessage {
	role: string;
	content: string | MessageContent[];
}

export interface IClaudeClient {
	connected: boolean;
	url: URL | undefined;
	getUserToken(): string | undefined;

	// Claude-specific methods
	getCompletions(request: CompletionRequest): Promise<CompletionResponse>;
	getAvailableModels(): Promise<ClaudeModelInfo[]>;

	// Chat methods
	streamChat?(
		messages: ChatMessage[],
		options: CompletionRequest,
	): AsyncGenerator<ChatMessage>;

	// General methods similar to localhost server
	getConfig(): Promise<{ configJson: string; configJs: string }>;
}
