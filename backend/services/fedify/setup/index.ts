import {
    FedifyFederation_t,
    FedifyFederationContext_t
} from "../_types.d.ts";

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
import get_set_federation from "../federation.ts";
import {
    setup_processing,
    create_processing_on_follow,
} from "../processing/index.ts";



export default async function setup_federation(kvdb: string){

    // use a Deno KV database for storing the list of followers and cache:
    const kv = await Deno.openKv(kvdb);
    await setup_processing(kv);

    // A `Federation` object is the main entry point of the Fedify framework.
    // It provides a set of methods to configure and run the federated server:
    const federation = (<unknown> createFederation({
        kv: new DenoKvStore(kv),
    })) as FedifyFederation_t;

    await get_set_federation(async function(){
        return federation;
    });

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
    .on(Follow, (_, follow) => {
        create_processing_on_follow(follow);
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
}