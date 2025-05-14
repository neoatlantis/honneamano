import {
    Accept,
    Endpoints,
    Follow,
    Person,
    Undo,
    createFederation,
} from "jsr:@fedify/fedify@1.5.1";

import {
    FedifyProcessingTypes_t,
    FedifyProcessingStatus_t,
    FedifyProcessingRecord_t
} from "../_types.d.ts";


let kvdb: Deno.Kv | null = null;

export function ensure_processing_kvdb(){
    if(null == kvdb) throw Error("tasks not setup.");
    return kvdb;
}

export async function setup_processing(existing_kvdb: Deno.Kv){
    if(null == existing_kvdb) throw Error("Expects an existing kvdb");
    kvdb = existing_kvdb;
}

export * from "./on_follow/create.ts";