import { FedifyProcessingStatusOnFollow_t } from "./processing/on_follow/_types.d.ts";

export { FedifyProcessingStatusOnFollow_t } from "./processing/on_follow/_types.d.ts";

export interface FedifyKeyPair_t {
    publicKey: any,
    privateKey: any,
    value: any,
}


export interface FedifyFederation_t {
    setActorDispatcher: (arg0: string, arg1: ((x:any,y:any)=>any))=>any,
    setKeyPairsDispatcher: any,
    setInboxListeners: (arg0: string, arg1: string)=>FedifyInboxListenerSetter_t,
    on: (arg0: any, arg1: ((x:any,y:any)=>any))=>any,
    fetch: any,
    createContext: any,
}


export interface FedifyFederationContext_t {
    kv: any,
    federation: FedifyFederation_t,
    actor_callback_setter: FedifyActorCallbackSetter_t | null,
}

export interface FedifyActorCallbackSetter_t {
    setKeyPairsDispatcher: any,
}

export interface FedifyInboxListenerSetter_t {
    on: (arg0: any, arg1: ((x:any,y:any)=>any))=>FedifyInboxListenerSetter_t,
}


export type FedifyProcessingTypes_t = "on_follow" | "on_create";


export type FedifyProcessingStatus_t = 
    "created" | "finished" |
    FedifyProcessingStatusOnFollow_t
;
    
    
    

export interface FedifyProcessingRecord_t {
    type: FedifyProcessingTypes_t,
    context: any,
    status: FedifyProcessingStatus_t,
}

export type FedifyProcessingRecordKey_t = [
    "processing",
    FedifyProcessingTypes_t,
    number
];