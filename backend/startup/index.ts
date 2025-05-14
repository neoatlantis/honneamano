import consola from "consola";
import { HonneamanoConfig } from "@src/config.d.ts";

import get_mongodb from "@src/services/mongodb/index.ts";
import setup_fedify from "@src/services/fedify/setup/index.ts";

export default async function startup(config: HonneamanoConfig){
    consola.info("Honneamano starting up...");

    consola.info("Setting up mongodb...");
    await get_mongodb.setup(config.mongodb);
    consola.info("mongodb setup done.");

    consola.info("Setting up fedify...");
    await setup_fedify(
        config.kvdb,
        `http://${config.host}`
    );
    consola.info("fedify setup done.");
}