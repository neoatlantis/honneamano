import _ from "lodash";
import { Application } from "oak/application";
import { Router } from "oak/router";
import { config } from "./config.ts";


import startup from "./startup/index.ts";

await startup(config);

const router = new Router();
router.get("/", (ctx) => {
    ctx.response.body = `<!DOCTYPE html>
    <html>
        <head><title>Hello oak!</title><head>
        <body>
        <h1>Hello oak!</h1>
        </body>
    </html>
`;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: config.listen_port });