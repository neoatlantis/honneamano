import _ from "lodash";
import consola from "consola";
import { Application } from "oak/application";
import { Router } from "oak/router";
import { config } from "./config.ts";

import get_federation from "@src/services/fedify/federation.ts";


import startup from "./startup/index.ts";

await startup(config);

const basic_router = new Router();
const web_router = new Router();
web_router.get("/", (ctx) => {
    ctx.response.body = `<!DOCTYPE html>
    <html>
        <head><title>Hello oak!</title><head>
        <body>
        <h1>Hello oak!</h1>
        </body>
    </html>
`;
});

basic_router.use("/web/", web_router.routes());
basic_router.use("/web/", web_router.allowedMethods());


basic_router.get("/", (ctx) => {
    ctx.response.body = `
    <!DOCTYPE html>
    <html>
        <head><title>Hello oak!</title><head>
        <body>
        <script>window.location.href="/web/";</script>
        </body>
    </html>
    `;
});


const app = new Application();
app.use(basic_router.routes());
app.use(basic_router.allowedMethods());


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