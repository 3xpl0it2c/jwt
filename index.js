require('dotenv').register();

const Koa = require('koa');
const KRouter = require('@koa/router');
const config = require('./config');
const { createDBInstance } = require('./database');

const app = new Koa();
const router = new KRouter();
const slonik = createDBInstance(config.slonik);

app.context.db = slonik;

app
	.use(router.routes())
	.use(router.allowedMethods());

const onServerUp = () => {
	console.log(`The server is up and running,\nVisit http://localhost:${config.server.port}`);
};

app.listen(config.server.port, onServerUp);
