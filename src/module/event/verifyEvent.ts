//the server side function
import { createHash } from "crypto";
// @ts-ignore
import schnorr from "bip-schnorr";
export interface EventData {
	pubkey: string;
	created_at: number;
	kind: number;
	tags: string[][];
	content: string;
	sig: string;
}
export async function verifyEvent(event: EventData) {
	try {
		const serialized = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
		const id = createHash("sha256").update(serialized).digest("hex");
		const sig = Buffer.from(event.sig, "hex");
		const pubkey = Buffer.from(event.pubkey, "hex");

		schnorr.verify(pubkey, Buffer.from(id, "hex"), sig);
		return true;
	} catch (e) {
		//type e is unknown here
		if (e instanceof Error) {
			console.log(e.message);
		}
		return false;
	}
}
