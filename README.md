This is a showcase for serverless-offline issue: https://github.com/dherault/serverless-offline/issues/747

Steps to reproduce:

1. clone this repo and cd into its directory
1. install dependencies: `npm install`
1. start serverless offline: `sls offline` or `npm start`
1. navigate browser to `localhost:4000/api`

Unsupported Media Type error is logged in the console:

    Serverless: GET /api (λ: apiTest)
    Serverless: Failure: Unsupported Media Type
    UnknownError: Unsupported Media Type

Expected - invoke lambda from within other http-event triggered lambda

I'm using node version 10.15.3

---

UPDATE: as pointed by @vepanimas, it works if function name is specified as: `{service-name}-{stage}-{name}`

in our case:

    INVOKE_FUNCTION: '${self:service}-${self:provider.stage}-invokeTest'
