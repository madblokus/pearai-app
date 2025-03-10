/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Define a simple version for constants
const constants = {
	c: "claude-api-key", // This would typically be a secure key
};

// Get a standardized timestamp
function getTimestamp() {
	const x = Date.now().toString();
	const l = new Date().getMinutes();
	const j = Math.floor(l / 2) + 10;
	return x.slice(0, -2) + j.toString();
}

// Basic telemetry info (customize as needed)
const Telemetry = {
	extensionVersion: process.env.EXTENSION_VERSION ?? "0.0.0",
	os: process.env.OS ?? "Unknown",
	uniqueId: process.env.UNIQUE_ID ?? "None",
};

export async function getHeaders() {
	return {
		key: constants.c,
		timestamp: getTimestamp(),
		v: "1",
		version: Telemetry.extensionVersion,
		os: Telemetry.os,
		uniqueId: Telemetry.uniqueId,
	};
}
