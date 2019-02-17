# No transpiler MEN microservice skeleton

Sample of simple micro service skeleton. It slowly evolved during few years of my own experience of solving similar problems in multiple projects, with multiple teams. So outsourcing it to shortcut others and hopefully get some contributions we all will benefit from.

## Code style this project is compatible with

```
{
    "extends": "eslint-config-airbnb",
    "rules": {
        "object-curly-newline": ["error", {
            "ObjectPattern": {"multiline": true}
        }]
    }
}
```
Maybe someone will make standard fork :)?

## Mongo as DAL

Mongoose underhood, but connection initialization approach tweaked to support multidatabase in single microservice and be lazy to microservice to start faster

## Sentry friendly

Sentry will see entire exception path when used provided Exception classes (or inherited ones)

## Gitlab CI read

Bind mservice version to commit hash automatically, lint, test

## Logging built in

Based on winston, extended to support provided Exception classes (or inherited ones) which allows you to see full exception trace and bubble `fields` (usefull in server based validation scenarios)

## DOCKER

### Launch locally

`make build up`
You might think its not windows friendly, but original author mostly uses it on windows with mingw. so it definitely is. On Mac/Linux though its very recomended to remove  `-- -L` from nodemon

### Debug locally

Standard vscode `Docker: Attach to Node` will work just fine

### `npm start` w/o docker

Yes it does work, you can even start w/o having database up, thanks to lazy db connection creation approach

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
