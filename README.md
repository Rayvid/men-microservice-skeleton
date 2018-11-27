# microservice-skeleton

Sample micro service skeleton, basically for any MEN stack project

## DOCKER

### Launch locally

`make build up`

## CONFIGURATION

Configuration is set up in this order:
- Reads machine/container specific environment variables
- If and NODE_ENV is not production - reads `dev.env` in project root
- Attempts read environment file defined in `ENV_FILE` or `/run/secrets/env` if undefined.
- Runs `config` package picking up environment vars mapped in `config/custom-environment-variables.json`
- Populates unset, default values from `config/default.json`

Handling configuration this way allows developers to update configuration independently and let deployment team override any of those if needed.

`dev.env` file is for **development**, so no production values allowed there.

**Never push sensitive credentials to git**

### Production

Production setup depends on `ENV_FILE` environment variable. `dev.env` in repository root will be ignored.
