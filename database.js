const { createPool, sql } = require('slonik');
const { hash, verify } = require('argon2');
const { compose } = require('./utils');

const logError = (subject) => (failSafeValue) => (reason) => (console.error(`${subject} Failure: ${reason}`), failSafeValue);
const logSlonikError = logError('Slonik');
const logArgon2Error = logError('Argon2');

const createPGConnString = ({host, port, user, pass, db}) => {
	const username = user ?? '';
	const connPassword = user && pass ? `:${pass}` : '';
	const database = db ? `/${db}` : '';
	const pgHost = username ? `@${host}` : host;
	const connQuery = `postgres://${username}${connPassword}${pgHost}:${port}`;

	return connQuery;
}

const createDBInstance = compose(createPool, createPGConnString);

const createUser = (slonikPool) => async (name, password) =>
	await slonikPool.connect(async (c) => {
		const hashedPassword = hash(password)
			.catch('This is not going to fail, but whatever');

		const values = sql.join([name, hashedPassword], sql`, `);
		const sqlQuery = sql`INSERT INTO USERS(name,password) VALUES(${values}) RETURNING id`;

		return await c.one(sqlQuery)
			.catch(logSlonikError(-1));
	});

const validateUser = (slonikPool) => async (name, passwordCandidate) =>
	await slonikPool.connect(async (c) => {
		const query = sql`SELECT password,id FROM USERS WHERE name=${name}`;
		const { password, id } = c.one(query);

		return verify(password, passwordCandidate)
			.then(() => id)
			.catch(logArgon2Error(false));
	});
