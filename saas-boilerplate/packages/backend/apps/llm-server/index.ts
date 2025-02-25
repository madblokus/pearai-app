/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/llm", async (req, res) => {
	try {
		const response = await fetch("https://your-marianai-server.com/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.MARIANAI_ACCESS_TOKEN}`,
			},
			body: JSON.stringify(req.body),
		});

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error forwarding LLM response:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.post("/fim", async (req, res) => {
	try {
		const response = await fetch("https://your-marianai-server.com/fim", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.MARIANAI_ACCESS_TOKEN}`,
			},
			body: JSON.stringify(req.body),
		});

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error forwarding FIM response:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/status", async (req, res) => {
	try {
		const response = await fetch("https://your-marianai-server.com/status", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.MARIANAI_ACCESS_TOKEN}`,
			},
		});

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error fetching status:", error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
