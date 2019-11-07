# General purpose CQRS proxy server
 
### Glossary 

`message` - Regular `POST` request with json body and `Content-Type: application/json` header. Body must be serialized object with one key as `Message Name` and one value as `Message Body`. `Message Body` is regular json object. Ex. `{ Foo: { Bar: "bar" } }`
`client` - Anybody who connects to proxy server via socket.

### Register your client

Just connect to `socket.io-client` with `id` param.
Ex. `http://{proxyIp}?id={yourId}&group={optionalGroupName}`

`id` is your client unique identifier. There is no duplicates control!
`group` is required for distinguish between clients classes (ex. IoT devices and web clients)

### Send message to client

Send `message` with extra `Recipient` header.


### Get list of clients from specified group

`message`: `{ GetGroupClients: { [GroupName] } }`. GroupName is optional........




# express.ts

This a very basic startup project with `Node.js`, `ES7`, `Typescript` and `express` with `socket.io`.

There is also basic client connected via socket.

*Prepared for Linux environment.*

Extra features:
- Dependency Injection (in `./src/IoC`) with samples
- Local environment variables (in `.env`)
- Command line arguments parser (`StartupArgs` class)
- Some convenient commands (look at `package.json` `scripts` section)
- Test samples (`jest` inside)
- `async/await` included, `axios` on board
- Extra services: `Logger`, `Environment` and `RunMode`

## Before start

Use `npm i` to install local packages. Use `npm run preinstall` to install global packages.

Add `.env`. You can based on `.env.example`.

## Where to start?

In `Main.ts`, `Run()` method. This is the place for your code. Put all dependencies in a constructor (don't forget to add them to IoC `./src/IoC/IoC.ts` and optionally to `Types.ts`).

Use `npm run serve` to build and run your code continuously.

## How to call program with args?

Just call it directly: `node startup.js --foo bar`. 
Don't do it by npm scripts like `npm run run -- --foo bar`. It may not work.

## How to make this program executable?

Add `#!/usr/bin/env node` at the very begining of startup file (`startup.ts`). This is already done.
Then call `sudo chmod u+x ./bin/startup.js`.
Now you can use your script like a regular program. You can call it with `./startup`. No `node startup.js` needed.
