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
	tools?: Tool[];
	tool_choice?: string | ToolChoice;
	files?: string[];
}

export interface ToolChoice {
	type: 'tool' | 'auto' | 'none';
	tool?: {
		name: string;
	};
}

export interface Tool {
	name: string;
	description: string;
	input_schema: Record<string, any>;
}

export interface ToolUse {
	id: string;
	name: string;
	input: Record<string, any>;
}

export interface CompletionResponse {
	id: string;
	completion: string;
	model: string;
	stop_reason: string;
	tool_uses?: ToolUse[];
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
	context_window?: number;
	supports_tools?: boolean;
	supports_files?: boolean;
	supports_vision?: boolean;
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
	tool_uses?: ToolUse[];
}

export interface StreamingMessageUpdate {
	type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop';
	message: Partial<ChatMessage>;
	index: number;
	content_block?: {
		type: string;
		text?: string;
	};
	delta?: {
		text?: string;
		tool_uses?: ToolUse[];
	};
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

	// File handling methods
	uploadFile?(file: File): Promise<string>;
	
	// Tool use methods
	executeToolCall?(toolCall: ToolUse): Promise<any>;

	// General methods similar to localhost server
	getConfig(): Promise<{ configJson: string; configJs: string }>;
}
