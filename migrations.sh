#!/bin/sh
cd /application/ && flyway -configFiles=/application/db/conf/flyway.conf -locations=filesystem:/application/db/migrations migrate
