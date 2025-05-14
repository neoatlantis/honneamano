import consola from "consola";

import {
    Follow,
} from "jsr:@fedify/fedify@1.5.1";

import {
    FedifyProcessingTypes_t,
    FedifyProcessingStatus_t,
    FedifyProcessingRecord_t,
    FedifyProcessingRecordKey_t
} from "@src/services/fedify/_types.d.ts";

import { ensure_processing_kvdb } from "../index.ts";


export async function create_processing_on_follow(ctx: any, follow: Follow){
    const kvdb = ensure_processing_kvdb();

    if (
        follow.id == null       ||
        follow.actorId == null  ||
        follow.objectId == null
    ){
        return;
    }

    const follow_as_jsonld = await follow.toJsonLd();

    const record: FedifyProcessingRecord_t = {
        type: "on_follow",
        status: "created",
        context: {
            url: ctx.url,
            follow: follow_as_jsonld,
        },
    }

    const record_key: FedifyProcessingRecordKey_t = [
        "processing",
        "on_follow",
        Date.now(),
    ];

    await kvdb.set(record_key, record);

    consola.info("New follow request recorded.");
}