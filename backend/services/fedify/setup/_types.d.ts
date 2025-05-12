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