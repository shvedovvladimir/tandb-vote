CREATE DATABASE tandb_vote_db;
CREATE USER postgres_app WITH PASSWORD 'postgres_password';
GRANT ALL PRIVILEGES ON DATABASE "tandb_vote_db" to postgres_app;
