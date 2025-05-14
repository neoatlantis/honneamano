import consola from "consola";
import _ from "lodash";
import {
    FedifyProcessingTypes_t,
    FedifyProcessingStatus_t,
    FedifyProcessingRecord_t,
    FedifyProcessingRecordKey_t
} from "@src/services/fedify/_types.d.ts";

import { ensure_processing_kvdb } from "./index.ts";

export async function* queue_iterator(
    processing_type: FedifyProcessingTypes_t,
    options?: any
){
    const kvdb = ensure_processing_kvdb();

    const db_iterator = await kvdb.list({
        prefix: ["processing", processing_type],
    }, options) as Deno.KvListIterator<FedifyProcessingRecord_t>;

    for await (let each of db_iterator){
        yield each;
    }
}

export async function get_record(
    kvdb_key: FedifyProcessingRecordKey_t
): Promise<FedifyProcessingRecord_t> {

    const kvdb = ensure_processing_kvdb();
    let entry = await kvdb.get(kvdb_key);

    if(entry.value == null){
        throw Error("No such record.");
    }

    let record = entry.value as FedifyProcessingRecord_t;
    return record;
}