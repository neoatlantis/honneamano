import { Application } from "oak/application";
import { Router } from "oak/router";
import { WEBUI_ROOT } from "@src/common/constants.ts";

const root_router = new Router();
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

root_router.use(WEBUI_ROOT, web_router.routes());
root_router.use(WEBUI_ROOT, web_router.allowedMethods());


root_router.get("/", (ctx) => {
    ctx.response.body = `
    <!DOCTYPE html>
    <html><body><script>window.location.href="${WEBUI_ROOT}";</script></body></html>`;
});


const app = new Application();
app.use(root_router.routes());
app.use(root_router.allowedMethods());

export default async function get_webui(){
    return app;
}
