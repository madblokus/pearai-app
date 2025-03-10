/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ClaudeAuth {
	accessToken: string;
	refreshToken: string;
}

export class ClaudeCredentials {
	private accessToken: string | undefined;
	private refreshToken: string | undefined;
	private getCredentials: (() => Promise<ClaudeAuth | undefined>) | undefined;
	private setCredentials: (auth: ClaudeAuth) => Promise<void>;

	constructor(
		getCredentials: (() => Promise<ClaudeAuth | undefined>) | undefined,
		setCredentials: (auth: ClaudeAuth) => Promise<void>,
	) {
		this.getCredentials = getCredentials;
		this.setCredentials = setCredentials;
	}

	public setAccessToken(value: string | undefined): void {
		console.log("Setting Claude access token:", value);
		this.accessToken = value;
		console.log("Claude access token set to:", this.accessToken);
	}

	public setRefreshToken(value: string | undefined): void {
		console.log("Setting Claude refresh token:", value);
		this.refreshToken = value;
		console.log("Claude refresh token set to:", this.refreshToken);
	}

	public getAccessToken(): string | undefined {
		console.log("Getting Claude access token");
		const token = this.accessToken;
		console.log("Returning Claude access token:", token);
		return token;
	}

	public async checkAndUpdateCredentials(): Promise<boolean> {
		try {
			let creds: ClaudeAuth | undefined;

			if (this.getCredentials && this.accessToken === undefined) {
				console.log("Attempting to get Claude credentials...");
				creds = await this.getCredentials();

				if (creds && creds.accessToken && creds.refreshToken) {
					this.accessToken = creds.accessToken;
					this.refreshToken = creds.refreshToken;
				} else {
					return false;
				}
			}

			// Here you would implement token validation/refresh logic
			// For now, we'll assume tokens are valid

			if (creds) {
				await this.setCredentials(creds);
			}
		} catch (error) {
			console.error("Error checking Claude token:", error);
			return false;
		}
		return true;
	}
}
