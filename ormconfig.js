module.exports = {
    "type": "postgres",
    "host": process.env.POSTGRESQL_HOST,
    "port": 5432,
    "username": process.env.POSTGRESQL_USER,
    "password": process.env.POSTGRESQL_PASSWORD,
    "database": process.env.POSTGRESQL_DB,
    "schema": process.env.POSTGRESQL_SCHEMA,
    "entities": ["src/**/**.entity.js"],
    "synchronize": false
};
