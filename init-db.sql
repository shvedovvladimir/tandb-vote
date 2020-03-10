CREATE DATABASE tandb_vote_db;

CREATE USER postgres_app_tandb_vote WITH PASSWORD 'postgres_password';

GRANT ALL PRIVILEGES ON DATABASE "tandb_vote_db" to postgres_app_tandb_vote;
