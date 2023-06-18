import { Request, Response } from "express";
import { generateKey } from "../module/keygen";

import { verifyEvent } from "../module/event/verifyEvent";
import { prisma } from "../prisma";

export async function keyGen(req: Request, res: Response) {
	const { privateKey, publicKey } = await generateKey();

	res.status(200).json({
		privateKey,
		publicKey,
	});
}

export async function insertEvent(req: Request, res: Response) {
	const event = req.body;
	const verified = await verifyEvent(event);
	if (!verified) {
		res.status(400).json({ verified, message: "event not verified" });
		return;
	}
	try {
		const eventCreated = await prisma.event.create({
			data: {
				id: event.id,
				pubkey: event.pubkey,
				created_at: event.created_at,
				kind: event.kind,
				tags: event.tags,
				content: event.content,
				sig: event.sig,
			},
		});

		res.status(200).json({ verified, eventCreated });
	} catch (e) {
		if (e instanceof Error) {
			res.status(400).json({ verified: false, message: e.message });
		} else {
			res.status(400).json({ verified: false, message: "unknown error" });
		}
	}
}
