# Use node version 16.15.1

# Stage 0: Install the base dependencies
#FROM node:16.15.1 //Not optimal
# Use deterministic docker base image tag
# Instead of generic image aliases, use SHA256 hashes or specific image version tags for deterministic builds.
FROM node:16.15.1-alpine3.16@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS dependencies

LABEL maintainer="Eirian Ta <tta6@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Optimize Node.js apps for production
# Some Node.js libraries and frameworks will only enable production-related optimization if they detect that the NODE_ENV env var set to production
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./
# OR: `COPY package*.json /app/` [WORKDIR is already set to /app]
# OR: `COPY package.json package-lock.json ./`

# Install only production dependencies
# Avoid pulling devDependencies and non-deterministic package install
RUN npm ci --only=production

###################################################################################

#Stage 1:
FROM node:16.15.1-alpine3.16@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS run

WORKDIR /app

# use port 8080 by default
ENV PORT=8080

COPY --from=dependencies /app /app

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Install curl
RUN apk --no-cache add curl=7.83.1-r2

# Start the container by running our server
# CMD npm start
CMD [ "node", "src/index.js" ]

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1
