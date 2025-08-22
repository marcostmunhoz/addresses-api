ARG CONTAINER_REGISTRY="acrsharedservices01.azurecr.io/docker.io/library"

FROM ${CONTAINER_REGISTRY}/node:22.18-alpine3.22

USER node
WORKDIR /usr/app

COPY --chown=node:node package.json ./package.json
COPY --chown=node:node package-lock.json ./package-lock.json

RUN npm ci --quiet --no-fund --loglevel=error

COPY --chown=node:node . .

RUN npm run build

ENV PORT=3000
EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]