import {
    FedifyFederation_t,
    FedifyFederationContext_t
} from "./_types.d.ts";
import _ from "lodash";

let federation_instance: FedifyFederation_t | null = null;

export default async function get_set_federation(
    creator?: ()=>Promise<FedifyFederation_t>
): Promise<FedifyFederation_t>{

    if(null !== federation_instance){
        return federation_instance;
    }

    if(undefined == creator){
        throw Error("Requires a function to create federation.");
    }

    federation_instance = await creator();
    return federation_instance;   
}