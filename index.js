require("make-promises-safe");
require("dotenv").config();

// Require Third-party Dependencies
const koa = require("koa");
const koaRouter = require("koa-router");
const mindee = require("mindee");

// Load env
const { invoiceToken, receiptToken } = process.env;

// Init mindee client
const kMindeeClient = new mindee.Client({ invoiceToken, receiptToken });

// Init http server and router (with Koa.js);
const server = new koa();
const router = new koaRouter();

router.post("/file", async(ctx) => {
    const type = ctx.query.type ?? "invoice";

    // ctx.req is Node.js http.IncomingMessage
    const { [type]: rawMindeeResponse } = await kMindeeClient[type].parse(ctx.req, "stream", void 0, void 0, true);
    log.debug(JSON.stringify(rawMindeeResponse, null, 2));

    ctx.body = "ok";
});

server.use(router.routes()).use(router.allowedMethods());
server.listen(1337);
