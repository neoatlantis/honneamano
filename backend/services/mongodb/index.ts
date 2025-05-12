import { MongoClient } from "npm:mongodb";
import _ from "lodash";
import consola from "consola";

import { HonneamanoMongoDBConfig } from "@src/config.d.ts";



let client: any = null;
let dbname: string | null = null;

export default function exported(){
    if(_.isNil(client)){
        throw Error("MongoClient not initialized.");
    }
    return client.db(dbname);
}

exported.setup = async function (mongodb_config: HonneamanoMongoDBConfig){
    client = new MongoClient(mongodb_config.uri);
    dbname = mongodb_config.database_name;

    try{
        await client.connect();
        await exported().command({ ping: 1 });
        consola.info("Connected to mongodb.");
    } catch(e){
        consola.error("Error connecting to mongodb:", e);
        throw e;
    }
    return client;
}