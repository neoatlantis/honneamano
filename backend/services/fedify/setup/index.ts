import {
    FedifyFederation_t,
    FedifyFederationContext_t
} from "./_types.d.ts";

import {
    Accept,
    Endpoints,
    Follow,
    Person,
    Undo,
    createFederation,
} from "jsr:@fedify/fedify@1.5.1";
import {
    DenoKvMessageQueue,
    DenoKvStore,
} from "jsr:@fedify/fedify@1.5.1/x/denokv";
import _ from "lodash";

import setActorDispatcher from "./setActorDispatcher.ts";
import setKeyPairsDispatcher from "./setKeyPairsDispatcher.ts";




let federation_instance: FedifyFederation_t | null = null;



export default async function setup_federation(){

    if(!_.isNil(federation_instance)) return federation_instance;

    // use a Deno KV database for storing the list of followers and cache:
    const kv = await Deno.openKv();

    // A `Federation` object is the main entry point of the Fedify framework.
    // It provides a set of methods to configure and run the federated server:
    const federation = (<unknown> createFederation({
        kv: new DenoKvStore(kv),
    })) as FedifyFederation_t;

    const context: FedifyFederationContext_t = {
        federation,
        kv,
        actor_callback_setter: null,
    };

    setActorDispatcher.call(context);
    setKeyPairsDispatcher.call(context);

    // Registers the inbox listeners, which are responsible for handling
    // incoming activities in the inbox:
    federation.setInboxListeners("/users/{identifier}/inbox", "/inbox")
    // The `Follow` activity is handled by adding the follower to the
    // follower list:
    .on(Follow, async (ctx, follow) => {
        if (follow.id == null || follow.actorId == null || follow.objectId == null) {
            return;
        }
        const result = ctx.parseUri(follow.objectId);
        if (result.type !== "actor" || result.identifier !== "demo") return;
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
        await kv.set(["followers", follow.id.href], follow.actorId.href);
    })
    // The `Undo` activity purposes to undo the previous activity.  In this
    // project, we use the `Undo` activity to represent someone unfollowing
    // this demo app:
    .on(Undo, async (ctx, undo) => {
        const activity = await undo.getObject(ctx); // An `Activity` to undo
        if (activity instanceof Follow) {
            if (activity.id == null) return;
            await kv.delete(["followers", activity.id.href]);
        } else {
            console.debug(undo);
        }
    })
    ;

    federation_instance = federation;
    return federation;
}