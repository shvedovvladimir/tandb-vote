#!/bin/sh
cd /application/ && flyway -configFiles=/application/db/conf/flyway.conf -locations=filesystem:/application/db/migrations,filesystem:/application/db/fixtures migrate && npm run dev