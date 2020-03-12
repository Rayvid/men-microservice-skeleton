# No transpiler (M)EN microservice skeleton

Simple Node.js based micro service skeleton. Mongo initialization is lazy, so can be used w/o actual mongo server running.

It slowly evolved as a result of my own experience of solving similar problems in multiple projects, with teams of very different skill level. So I am outsourcing it to shortcut others and hopefully to get some contributions we all will benefit from.

## Modules vs infrastructure code duplication

Some code can be moved to modules and in future definitely will be. On other hand some infra code duplication in microservices is ok. It allows you to finetune particular behaviour w/o making logic branch in the module.

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
Maybe someone will make standard fork, since not everybody loves semicolons :)?

## Mongo as data store

Mongoose used as ORM, but connection initialization approach tweaked to support multidatabase in single microservice and to be lazy - to microservice to start faster and this skeleton to be usefull when mongo isn't actually used.

## Sentry friendly

Sentry will see entire exception path when used provided Exception classes (or inherited ones).

## Gitlab CI ready

Binding mservice version to commit hash. lint, test steps.

## Logging built in

Based on winston, extended to support provided Exception classes (or inherited ones) which allows you to see full exception trace and bubble `fields` property (usefull in server based validation scenarios for example).

## Docker

### Launch locally

`make build up`, navigate to http://localhost:3000/swagger/

You might think its not windows friendly, since using make. But i am developing mostly using it on windows with mingw, so it definitely is windows friendly. On Mac/Linux though its very recomended to remove  `-- -L` inside package.json (to save alot of CPU when running in dev mode).

### Debug locally

Standard vscode Docker extension provided `Docker: Attach to Node` will work just fine out of the box.

### `npm start` w/o docker

Yes it does work, you can even start w/o having database up, thanks to lazy db connection creation approach.

## Configuration

Configuration is set up in this order:
- Reads machine/container specific environment variables
- If and NODE_ENV is not production - reads `dev.env` in project root
- Attempts read environment file defined in `ENV_FILE` or `/run/secrets/env` if undefined
- Runs `config` package picking up environment vars mapped in `config/custom-environment-variables.json`
- Populates unset, default values from `config/default.json`

Handling configuration this way allows developers to update configuration independently and let deployment team override any of those using variety of methods.

`dev.env` file is for **development**, so no production values allowed there.

**Never push sensitive credentials to git**
