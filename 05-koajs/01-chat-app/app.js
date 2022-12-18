const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

let subscribers = [];

app.use(async (ctx, next) => {
    await next();

    if (ctx.status === 404 && ctx.body === undefined) {
        ctx.body = 'unknown routes';
    }
});

router.get('/subscribe', async (ctx, next) => {
    await new Promise((resolve, reject) => {
        subscribers.push({ ctx, resolve });

        ctx.res.on('close', function () {
            subscribers = []
            resolve();
        });
    });
});

router.post('/publish', async (ctx, next) => {

    const message = ctx.request.body.message;

    if (!message) {        
        ctx.throw(400, 'message is empty');
    }

    subscribers.forEach(({ ctx, resolve }) => {
        ctx.body = message;
        resolve(ctx.body);
    });

    subscribers = [];

    ctx.status = 200;
    ctx.body = 'ok'
});

app.use(router.routes());

module.exports = app;
