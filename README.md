# No transpiler (M)EN microservice skeleton

Simple Node.js based micro service skeleton. Mongo initialization is lazy, on first call, so can be launched w/o mongo server running.

It slowly evolved as a result of my own experience of solving similar problems in multiple projects, with teams of very different skill level. So I am outsourcing it to shortcut others and hopefully to get some contributions we all will benefit from.

## Modules vs infrastructure code duplication

Some infra code duplication in microservices is ok. It allows you to finetune particular behaviour w/o making logic branch in the module, but you should be moving independent reusable blocks into the modules normally (potentially exceptions and some utils there moved into the modules in future).

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

Mongoose used as ORM, but connection initialization approach tweaked to support multidatabase in single microservice (yes i know, thats quite rare, but still - happens) and to be lazy - to microservice to start faster and this skeleton to be usefull when mongo isn't actually used.

## Sentry friendly

Sentry will see entire exception path when used provided Exception classes (or inherited ones).

## Gitlab CI ready

Autobind mservice version to commit hash, lint, test. Push artifact to gitlab image repository.

## Logging built in

Based on winston, extended to support provided Exception classes (or inherited ones) which allows you to see full exception trace and bubble `fields` property (usefull in server based validation scenarios for example).

## (Unit) tests

Some sample global tests folder included to kickoff from there

## Docker

### Launch locally

`make build up`, navigate to http://localhost:3000/swagger/. By default it runs in nodemon mode and detects changes.

On windows you can install make on windows using git bash and this instruction https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058.

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
