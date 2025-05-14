import _ from "lodash";
import consola from "consola";

import { config } from "./config.ts";

import get_federation from "@src/services/fedify/federation.ts";
import get_app from "@src/services/webui/index.ts";
import { list_pending_requests as list_pending_follow_requests } from "@src/services/fedify/processing/on_follow/pending_requests.ts";


import startup from "./startup/index.ts";

await startup(config);

const app = await get_app();



Deno.serve({ port: config.listen_port }, async (req, info)=>{
    const pathname = new URL(req.url).pathname;
    consola.debug(`Access ${req.url} `);

    if(pathname.startsWith("/web/") || pathname == "/") {
        let response = (await app.handle(req, info.remoteAddr)) as Response;
        return response;
    }

    const federation = await get_federation();
    if(null === federation){
        return Response.error();
    }
    return await federation.fetch(req, { contextData: undefined });
});

list_pending_follow_requests()