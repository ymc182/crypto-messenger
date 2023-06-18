//@ts-ignore
import schnorr from "bip-schnorr";
import { createHash } from "crypto";
import { verifyEvent } from "../src/module/event/verifyEvent";
import { generateKey } from "../src/module/keygen";
describe("verifyEvent", () => {
	it("should return true", async () => {
		const { privateKey, publicKey } = await generateKey();
		const dateNow = Math.floor(Date.now() / 1000);
		const eventId = JSON.stringify([0, publicKey, dateNow, 0, [["p", publicKey]], "test content"]);
		const hashedEvent = createHash("sha256").update(eventId).digest("hex");
		const signature = schnorr.sign(privateKey, Buffer.from(hashedEvent, "hex")).toString("hex");
		console.log(signature);
		const event = {
			id: hashedEvent,
			pubkey: publicKey,
			created_at: dateNow,
			kind: 0,
			tags: [["p", publicKey]],
			content: "test content",
			sig: signature,
		};
		console.log(event);
		const verified = await verifyEvent(event);
		expect(verified).toBe(true);
	});

	it("should return false", async () => {
		const { privateKey, publicKey } = await generateKey();
		const { privateKey: privateKey2, publicKey: publicKey2 } = await generateKey();
		const dateNow = Date.now();
		const eventId = JSON.stringify([0, publicKey, dateNow, 0, [["p", publicKey]], "test content"]);
		const hashedEvent = createHash("sha256").update(eventId).digest("hex");
		const signature = schnorr.sign(privateKey2, Buffer.from(hashedEvent, "hex")).toString("hex");
		const event = {
			id: hashedEvent,
			pubkey: publicKey,
			created_at: dateNow,
			kind: 0,
			tags: [["p", publicKey]],
			content: "test content",
			sig: signature,
		};
		const verified = await verifyEvent(event);
		expect(verified).toBe(false);
	});
});

/**
 * 
 * Event: 
 * {
  "id": <32-bytes lowercase hex-encoded sha256 of the serialized event data>,
  "pubkey": <32-bytes lowercase hex-encoded public key of the event creator>,
  "created_at": <unix timestamp in seconds>,
  "kind": <integer>,
  "tags": [
    ["e", <32-bytes hex of the id of another event>, <recommended relay URL>],
    ["p", <32-bytes hex of a pubkey>, <recommended relay URL>],
    ... // other kinds of tags may be included later
  ],
  "content": <arbitrary string>,
  "sig": <64-bytes hex of the signature of the sha256 hash of the serialized event data, which is the same as the "id" field>
}
 * To obtain the event.id, we sha256 the serialized event. The serialization is done over the UTF-8 JSON-serialized string (with no white space or line breaks) of the following structure:
 * [
  0,
  <pubkey, as a (lowercase) hex string>,
  <created_at, as a number>,
  <kind, as a number>,
  <tags, as an array of arrays of non-null strings>,
  <content, as a string>
]
 */
