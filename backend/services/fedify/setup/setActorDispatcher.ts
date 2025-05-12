import {
    FedifyFederation_t,
    FedifyFederationContext_t,
    FedifyKeyPair_t,
    FedifyActorCallbackSetter_t,
} from "../_types.d.ts";
import { WEBUI_ROOT } from "@src/common/constants.ts";
import {
    Person,
    Endpoints,
} from "jsr:@fedify/fedify@1.5.1";

import { user_exists } from "@src/services/users/lookup.ts";



export default function setActorDispatcher(
    this: FedifyFederationContext_t
): FedifyFederationContext_t{

    // Registers the actor dispatcher, which is responsible for creating a
    // `Actor` object (`Person` in this case) for a given actor URI.
    // The actor dispatch is not only used for the actor URI, but also for
    // the WebFinger resource:
    let actor_callback_setter = this.federation.setActorDispatcher(
        "/users/{identifier}",
        async (ctx, identifier) => 
    {
        if(!(await user_exists(identifier))) return null;

        // A `Context<TContextData>` object has several purposes, and one of
        // them is to provide a way to get the key pairs for the actor in various
        // formats:
        const keyPairs = await ctx.getActorKeyPairs(identifier);

        return new Person({
            id: ctx.getActorUri(identifier),
            name: "Fedify Admin",
            summary: "This is a Fedify Test Admin account.",
            preferredUsername: identifier,
            url: new URL(`${WEBUI_ROOT}users/${identifier}`, ctx.url),
            inbox: ctx.getInboxUri(identifier),
            endpoints: new Endpoints({
                sharedInbox: ctx.getInboxUri(),
            }),
            // The `publicKey` and `assertionMethods` are used by peer servers
            // to verify the signature of the actor:
            publicKey: keyPairs[0].cryptographicKey,
            assertionMethods: keyPairs.map((keyPair: any) => keyPair.multikey),
        });
    });

    this.actor_callback_setter = actor_callback_setter as FedifyActorCallbackSetter_t;

    return this;
}