FROM mhart/alpine-node:12.15

ENV NODE_ENV=development

# Default to UTF-8 file.encoding
ENV LANG C.UTF-8

RUN apk update && apk add bash git openssh openssl ffmpeg python make g++ p11-kit-trust

# add a simple script that can auto-detect the appropriate JAVA_HOME value
# based on whether the JDK or only the JRE is installed
RUN { \
    echo '#!/bin/sh'; \
    echo 'set -e'; \
    echo; \
    echo 'dirname "$(dirname "$(readlink -f "$(which javac || which java)")")"'; \
    } > /usr/local/bin/docker-java-home \
    && chmod +x /usr/local/bin/docker-java-home
ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk/jre
ENV PATH $PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin

ENV JAVA_VERSION 8u181
ENV JAVA_ALPINE_VERSION 8.242.08-r0

RUN set -x \
    && apk add --no-cache \
    openjdk8-jre="$JAVA_ALPINE_VERSION" \
    && [ "$JAVA_HOME" = "$(docker-java-home)" ]

WORKDIR /flyway

ENV FLYWAY_VERSION 6.2.2

RUN wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${FLYWAY_VERSION}/flyway-commandline-${FLYWAY_VERSION}.tar.gz \
    && tar -xzf flyway-commandline-${FLYWAY_VERSION}.tar.gz \
    && mv flyway-${FLYWAY_VERSION}/* . \
    && rm flyway-commandline-${FLYWAY_VERSION}.tar.gz \
    && ln -s /flyway/flyway /usr/local/bin/flyway

WORKDIR /application

ADD ormconfig.js ormconfig.js
ADD package.json package.json
ADD config config
ADD package-lock.json package-lock.json
ADD tsconfig.json tsconfig.json
ADD db db
ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

RUN npm ci

ADD src src

RUN npm run build

ENV NODE_ENV=production

EXPOSE 9080

ADD start.sh start.sh
ADD dev.sh dev.sh
ADD migrations.sh migrations.sh
