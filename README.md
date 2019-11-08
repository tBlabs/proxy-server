# General purpose CQRS proxy server
 
### Glossary 
| Token   | Definition                               |
|---------|------------------------------------------|
| `message` | Regular `POST /MessageBus` request with json body and `Content-Type: application/json` header. Body must be serialized object with one key as `Message Name` and one value as `Message Body`. `Message Body` is regular json object. Ex. `{ Foo: { Bar: "bar" } }` |
| `client` | Anybody who connects to proxy server via socket. |

### Register your client

Everyone who want to be a receiver of messages must attach to server via socket.

Call server with usage of `socket.io-client` with `id` param and optional `group` param.  
Ex. `http://{proxyIp}:{port}?id={yourId}&group={optionalGroupName}`

`id` is your client unique identifier. There is no duplicates control!  
`group` is required for distinguish between clients classes (ex. IoT devices and web clients)

Example client code (Node.js):
```
import ...
```

### Send message to client

Send `message` with extra `Recipient` header containing client `id`.


### Get list of clients from specified group

`message`: `{ GetGroupClients: { Name } }`.



*Prepared for Linux environment.*

## Before start

Use `npm i` to install local packages. Use `npm run preinstall` to install global packages.

Add `.env`. You can based on `.env.example`.

Use `npm run serve` to build and run your code continuously.

## Args

Just call it directly: `node startup.js --foo bar`. 
Don't do it by npm scripts like `npm run run -- --foo bar`. It may not work.
