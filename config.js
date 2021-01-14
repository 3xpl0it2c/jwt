module.exports = {
	slonik: {
		host: 'localhost',
		port: 5432,
		database: 'jwt_users',
		user: process.env.NODE_PSQL_USER,
		password: process.env.NODE_PSQL_PASS,
	},
	server: {
		port: 8080,
	}
};
