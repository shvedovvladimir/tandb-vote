module.exports = {
    "type": "postgres",
    "host": process.env.POSTGRESSQL_HOST,
    "port": 5432,
    "username": process.env.POSTGRESSQL_USER,
    "password": process.env.POSTGRESSQL_PASSWORD,
    "database": process.env.POSTGRESSQL_DB,
    "schema": process.env.POSTGRESSQL_SCHEMA,
    "entities": ["src/**/**.entity.js"],
    "synchronize": false
};
