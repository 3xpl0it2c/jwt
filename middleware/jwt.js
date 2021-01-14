const { verify } = require('jsonwebtoken');

// Blocks if no JWT is found.
const handler = async (ctx, next) => {
	const jwt = ctx.headers['authorization'];
	
	verify(jwt, ctx.JWTSecret, (err, payload) => {
		ctx.assert(!err, 500, 'Internal Server Error');
		ctx.state.user = payload;
	});

	await next();
};

module.exports = (router) => router.all('/', handler);
