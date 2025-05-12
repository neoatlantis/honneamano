import {
    FedifyFederation_t,
    FedifyFederationContext_t
} from "./_types.d.ts";
import {
    exportJwk,
    generateCryptoKeyPair,
    importJwk,
} from "jsr:@fedify/fedify@1.5.1";




export default function setKeyPairsDispatcher(this: FedifyFederationContext_t){
    const kv = this.kv;

    this.federation.setKeyPairsDispatcher(async (_: any, identifier: any) => {
        if (identifier !== "test") return [];
        const entry = await kv.get<{ privateKey: JsonWebKey, publicKey: JsonWebKey }>(["key"]);
        if (entry == null || entry.value == null) {
            // Generate a new key pair at the first time:
            const { privateKey, publicKey } = await generateCryptoKeyPair("RSASSA-PKCS1-v1_5");
            // Store the generated key pair to the Deno KV database in JWK format:
            await kv.set(
                ["key"],
                {
                    privateKey: await exportJwk(privateKey),
                    publicKey: await exportJwk(publicKey),
                }
            );
            return [{ privateKey, publicKey }];
        }
        // Load the key pair from the Deno KV database:
        const privateKey = await importJwk(entry.value.privateKey, "private");
        const publicKey =  await importJwk(entry.value.publicKey, "public");
        return [{ privateKey, publicKey }];
    });

    return this;
}