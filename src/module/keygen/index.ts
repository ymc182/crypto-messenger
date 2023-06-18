import { randomBytes } from "crypto";
import { privateKeyVerify, publicKeyCreate } from "secp256k1";
export async function generateKey() {
	let privateKey;
	do {
		privateKey = randomBytes(32);
	} while (!privateKeyVerify(privateKey));
	const publicKey = publicKeyCreate(privateKey);

	return {
		privateKey: privateKey.toString("hex"),
		publicKey: Buffer.from(publicKey).toString("hex").slice(2),
	};
}
