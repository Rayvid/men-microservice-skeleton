module.exports = {
    "root": true,
    "extends": "eslint-config-airbnb",
    "rules": {
        "object-curly-newline": ["error", {
            "ObjectPattern": {"multiline": true}
        }]
    },
    "env": {
      "mocha": true
    },
}