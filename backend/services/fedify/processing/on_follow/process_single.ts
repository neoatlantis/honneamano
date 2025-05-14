/*
Resumes execution of a state machine processing "on_follow" type tasks.
*/
import {
    FedifyProcessingTypes_t,
    FedifyProcessingStatus_t,
    FedifyProcessingRecord_t,
    FedifyProcessingRecordKey_t
} from "@src/services/fedify/_types.d.ts";
import { ensure_processing_kvdb } from "../index.ts";


export default async function process_single(
    store_key: FedifyProcessingRecordKey_t
){
    const kvdb = ensure_processing_kvdb();
    const kventry = await kvdb.get(store_key) as Deno.KvEntry;



}