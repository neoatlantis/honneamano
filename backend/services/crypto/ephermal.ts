import { encode as msgpackEncode, decode as msgpackDecode } from "npm:msgpack-lite";
import _ from "lodash";

// Generate a non-exportable AES-GCM 256-bit key at startup
const aesKey = await crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256,
    },
    false, // not exportable
    ["encrypt", "decrypt"],
);

function generateIv(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
}

export async function encrypt(obj: any): Promise<string> {
    const serialized = msgpackEncode(obj);
    const iv = generateIv();

    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        aesKey,
        serialized,
    );

    // Combine IV and ciphertext into one buffer
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Return as base64 string
    return btoa(String.fromCharCode(...combined));
}

export async function decrypt(data: string): Promise<any> {
    const combined = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        aesKey,
        ciphertext,
    );

    return msgpackDecode(new Uint8Array(decrypted));
}

export async function ephermal_encrypt_kv_key(obj: Deno.KvKey){
    return await encrypt(obj);
}

export async function ephermal_decrypt_kv_key(data: string){
    try{
        let decrypted = await decrypt(data);
        if(!_.isArray(decrypted)) throw Error();
        return decrypted;
    } catch(e){
        throw Error("Cannot decrypt kv key.");
    }
}
