/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Re-export interfaces
export * from './interface.js';

// Export client implementation
export { ClaudeClient } from './client.js';

// Export credentials manager
export { ClaudeCredentials, ClaudeAuth } from './credentials.js';

// Export utils
export {
	CLAUDE_API_URL,
	claudeTelemetryLog,
	formatClaudePrompt,
	cleanClaudeResponse,
} from './utils.js';

// Default initialization function
export async function createClaudeClient(
	serverUrl?: string,
	token?: string,
): Promise<import('./client.js').ClaudeClient> {
	const { ClaudeClient } = await import('./client.js');
	return new ClaudeClient(serverUrl, token);
}
