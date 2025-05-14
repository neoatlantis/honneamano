import consola from "consola";
import _ from "lodash";

import {
    Follow,
} from "jsr:@fedify/fedify@1.5.1";

import {
    FedifyProcessingTypes_t,
    FedifyProcessingStatus_t,
    FedifyProcessingRecord_t,
    FedifyProcessingRecordKey_t
} from "@src/services/fedify/_types.d.ts";

import { queue_iterator, get_record } from "../queue_op.ts";
import {
    ephermal_encrypt_kv_key,
    ephermal_decrypt_kv_key
} from "@src/services/crypto/ephermal.ts";




export interface FedifyPendingOnFollowRequestsForUser_t {
    ref: string,
    actor?: string,
    object?: string,
}

export interface FedifyPendingOnFollowRequestsDecision_t {
    ref?: string,
    kvdb_key?: FedifyProcessingRecordKey_t,
    approved: boolean,
}




export async function list_pending_requests()
    : Promise<FedifyPendingOnFollowRequestsForUser_t[]>
{
    const result: FedifyPendingOnFollowRequestsForUser_t[] = [];

    for await (
        let pending_request of await queue_iterator("on_follow"))
    {
        await generate_result(
            pending_request.key,
            pending_request.value as FedifyProcessingRecord_t
        );
    }

    async function generate_result(
        kvdb_key: Deno.KvKey,
        pending_request: FedifyProcessingRecord_t
    ){
        let entry: FedifyPendingOnFollowRequestsForUser_t = {
            ref: await ephermal_encrypt_kv_key(kvdb_key),
        };
        let context: any = _.get(pending_request, "context");
        let follow: any = _.get(context, "follow");

        entry.actor = _.get(follow, "actor");
        entry.object = _.get(follow, "object");

        console.log(pending_request);
        result.push(entry);
    }

    return result;
}

export async function make_decision(
    decision: FedifyPendingOnFollowRequestsDecision_t
){
    let kvdb_key: FedifyProcessingRecordKey_t | null = null;
    if(null != decision.kvdb_key){
        kvdb_key = decision.kvdb_key;
    } else if (null != decision.ref){
        kvdb_key = await ephermal_decrypt_kv_key(decision.ref);
    }

    if(null == kvdb_key){
        throw Error("Must specify a reference.");
    }

    let record: FedifyProcessingRecord_t | null = null;
    try{
        record = await get_record(kvdb_key);
    } catch(e){
        consola.error(e);
    }
    if(null == record) return;

    

    // retrieve Follow obj
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
}