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


export async function create_processing_on_follow(follow: Follow){
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


        /*
        const result = ctx.parseUri(follow.objectId);
        if (result.type !== "actor" || result.identifier !== "admin") return;
        const follower = await follow.getActor(ctx);
        // Note that if a server receives a `Follow` activity, it should reply
        // with either an `Accept` or a `Reject` activity.  In this case, the
        // server automatically accepts the follow request:

        await ctx.sendActivity(
            { handle: result.identifier },
            follower,
            new Accept({
                id: new URL(`#accepts/${follower.id.href}`, ctx.getActorUri(result.identifier)),
                actor: follow.objectId,
                object: follow
            }),
            );
        await kv.set(["followers", follow.id.href], follow.actorId.href);*/