# No transpiler (M)EN microservice project template - fastest way to kickoff your microservice

Micro service project template based on Node 16.4 with strong focus on KISS principles. Really straightforward, just checkout and `docker compose -f compose.dev.yml up`. Mongo initialization is lazy, on first call, so can be used w/o actual mongo server running.

It slowly evolved as a result of my own experience of solving similar problems in multiple projects, with teams of very different skill level. So keeping KISS principles is very important in this project. Well, you will probably find oauth2 stuff, model folder and exceptions not that simple, but at least you can find comments/readme explaining need for additional complexity there.

## Launch locally

`make build up`, navigate to http://localhost:3000/swagger/. By default it runs in nodemon mode and detects changes.

On windows you can install make for git-bash/MinGW using this instruction https://gist.github.com/evanwill/0207876c3243bbb6863e65ec5dc3f058.

You can connect mongodb on docker using this connection string: `mongodb://root:rootPassXXX@mongodb:27777/?authSource=admin`

## Debug locally

Standard vscode Docker extension provides `Docker: Attach to Node` debug mode, which work just fine out of the box.

### `npm start` w/o docker

Yes it does work, you can even start w/o having database up, thanks to lazy db connection creation approach.

## Configuration

Configuration is set up in this order (later ones superseeds earlier ones):
- Default values comes from `config/default.json`
- If `NODE_ENV` is not `production` - `dev.env` in project root gets loaded into environment
- Attempts read environment file defined in `ENV_FILE` or `/run/secrets/env` if it's undefined
- Picks up environment vars (you can set those in compose or dev.env)
- Command line arguments comes as highest priority https://github.com/lorenwest/node-config/wiki/Command-Line-Overrides

<sub>note: env vars are mapped to config scheme in `config/custom-environment-variables.json`</sub>

Handling configuration this way allows developers to update configuration wo headache and let's override config during CI/CD using variety of DevOps methods.

`dev.env` file is for **development**, so no production values allowed there.

**Never push sensitive credentials to git!**

## Modules vs infrastructure code duplication

Some infra code duplication in microservices is ok. It allows you to finetune particular behaviour w/o making logic branch in the module, but you should be moving independent reusable blocks into the modules normally - so potentially exceptions and some utils moved from skeleton into the standalone modules in the future.

## Code style this project is compatible with

```
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "google"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
          "max-len": ["error", {
            "code": 120,
            "ignoreUrls": true,
            "ignoreTrailingComments": true,
            "ignoreComments": true
          }]
    }
}
```
I know, not everybody loves semicolons, sorry about that ;)

## Mongo as data store

Mongoose used as ORM, but connection initialization approach tweaked to support multidatabase in single microservice (yes i know, thats quite rare, but still - happens) and to be lazy - to microservice to start faster and this project template to be usefull when mongo isn't actually used.

## Extending Error to become Exception

it's a complicated topic, but I think the support of inner Exception's (wrapping) and bubbling `fields` property from innermost exception to outermost (e.g. model fails validation and throws with `fields` containing validation errors, controller wraps with additional info and rethrows, frontend pickups fields and shows error messages), comes vhandy in high level scenarios, for low level stuff - its totally fine (and in fact, more portable) to keep using Error's.

## Sentry friendly

Sentry will see entire exception path (nested exceptions too) when provided Exception classes, or inherited ones, are used.

## CI ready

Gitlab - autobind mservice version to commit hash, lint, test. Push artifact to gitlab image repository.

Github - just lint and test for now.

## Logging built in

Based on winston, extended to support provided Exception classes (or inherited ones) which in order allows you to see full exception trace when Exception gets thrown.

## (Unit) tests

Some sample global tests folder included to kickoff easily from there. Mocha + Chai FTW.

## JWT

Both middleware to validate JWT and utility to get access token using client credentials flow, are present.

Middleware usage-cases:
* `validateAuth` - to just validate if JWT is issued by right authority, like `app.get('/version', middlewares.validateAuth, routes.versionCheck);`
* `validateAuthScope(scope)` - for validating if JWT is issued by right authority and contains required scope (or multiple, space separated, scopes), like `app.get('/version', middlewares.validateAuthScope('tooling:version.read'), routes.versionCheck);`

Token payload is transfered to res.locals.token.payload - in case you want to check claims manually.

<sub>note: theres way to bypass scopes check in dev mode, to speedup developement - check compose.dev.yml DEV_BYPASS_SCOPES env variable</sub>

## health/version/sentryPing endpoints

Some standard infrastructure endpoints example
