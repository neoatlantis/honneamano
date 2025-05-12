export interface FedifyFederation_t {
    setActorDispatcher: (arg0: string, arg1: ((x:any,y:any)=>any))=>FedifyFederation_t,
    setKeyPairsDispatcher: any,
    setInboxListeners: any,
    on: (arg0: any, arg1: ((x:any,y:any)=>any))=>FedifyFederation_t,
}


export interface FedifyFederationContext_t {
    kv: any,
    federation: FedifyFederation_t,
}