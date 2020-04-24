# No transpiler (M)EN microservice skeleton - fastest way to kickoff your microservice

Simple Node.js based micro service skeleton. Really straightforward, just checkout and `docker-compose -f compose.dev.yml up`. Mongo initialization is lazy, on first call, so can be launched w/o actual mongo server running.

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
I know, not everybody loves semicolons, sorry about that ;)

## Mongo as data store

Mongoose used as ORM, but connection initialization approach tweaked to support multidatabase in single microservice (yes i know, thats quite rare, but still - happens) and to be lazy - to microservice to start faster and this skeleton to be usefull when mongo isn't actually used.

## Exception, not error

I know it's a complicated topic, but I think the support of inner exceptions (wrapping) and bubbling `fields` property from innermost exception to outermost (e.g. mongo fails validation and throws with `fields` containing validation errors, controller wraps with additional info and rethrows, frontend pickups fields and translates into error messages), comes vhandy in high level scenarios, for low level stuff - use error's. 

## Sentry friendly

Sentry will see entire exception path when provided Exception classes, or inherited ones, are used.

## Gitlab CI ready

Autobind mservice version to commit hash, lint, test. Push artifact to gitlab image repository.

## Logging built in

Based on winston, extended to support provided Exception classes (or inherited ones) which allows you to see full exception trace.

## (Unit) tests

Some sample global tests folder included to kickoff easily from there. Mocha + chai FTW.

## JWT

Both middleware to validate JWT and utility to get access token using client credentials flow, are present.

Middleware usage-cases:
* `validateAuth` - to just validate if JWT is issued by right authority, like `app.get('/version', middlewares.validateAuth, routes.versionCheck);`
* `validateAuthScope(scope)` - for validating if JWT is issued by right authority and contains required scope (or multiple, space separated, scopes), like `app.get('/version', middlewares.validateAuthScope('tooling:version.read'), routes.versionCheck);`
(note: theres way to bypass scopes check in dev mode, to speedup developement - check compose.dev.yml DEV_BYPASS_SCOPES env variable)

## Docker

### Launch locally

`make build up`, navigate to http://localhost:3000/swagger/. By default it runs in nodemon mode and detects changes.

On windows you can install make for git-bash/MinGW using this instruction https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058.

### Debug locally

Standard vscode Docker extension provided `Docker: Attach to Node` will work just fine out of the box.

### `npm start` w/o docker

Yes it does work, you can even start w/o having database up, thanks to lazy db connection creation approach.

## Configuration

Configuration is set up in this order:
- Default values comes from `config/default.json`
- If and `NODE_ENV` is not `production` - reads `dev.env` in project root and overwrites found variables
- Attempts read environment file defined in `ENV_FILE` or `/run/secrets/env` if undefined and overwrites found variables
- Picks up environment vars
(note: env vars are mapped in `config/custom-environment-variables.json`)

Handling configuration this way allows developers to update configuration independently and let deployment team override any of those using variety of methods.

`dev.env` file is for **development**, so no production values allowed there.

**Never push sensitive credentials to git**
