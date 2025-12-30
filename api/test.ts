import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const data = {
		message: "Vercel Serverless is working",
		timestamp: new Date().toISOString(),
	};

	return response.status(200).json(data);
}
