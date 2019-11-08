import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { IEnvironment } from './Services/Environment/IEnvironment';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { MessageBus } from './Core/MessageBus';
import { ClientsManager } from './Services/DevicesManager';

@injectable()
export class Main
{
    constructor(
        private _messageBus: MessageBus,
        @inject(Types.IEnvironment) private _env: IEnvironment,
        private _devicesList: ClientsManager)
    { }

    private get ClientDir(): string
    {
        const s = __dirname.split(path.sep); // __dirname returns '/home/tb/projects/EventsManager/bin'. We don't wanna 'bin'...
        return s.slice(0, s.length - 1).join(path.sep) + '/client';
    }

    public async Start(): Promise<void>
    {
        const server = express();
        server.use(cors({ exposedHeaders: 'Content-Length' }));
        server.use(bodyParser.json());
        server.use(express.static(this.ClientDir));

        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/ping', (req, res) => res.send('pong'));

        server.post('/MessageBus', async (req, res) =>
        {
            const message = req.body;
            const recipient = req.headers.recipient;

            if (recipient)
            {
                try
                {
                    console.log('Message to device', recipient, ':', message);
                    const result = await this._devicesList.Send(recipient, message);

                    res.send(result);
                }
                catch (ex)
                {
                    console.log(`Sending message to ${recipient} error:`, ex);
                    res.status(500).send(ex);
                }
            }
            else
            {
                console.log('Message to server:', message);
                try
                {
                    // console.log('BODY', req.body);
                    const result = await this._messageBus.Execute(message);
                    res.send(result);
                }
                catch (error) 
                {
                    console.log('MESSAGE BUS ERROR:', error.message);
                    res.send(error.message);
                }
            }
        });

        const httpServer = http.createServer(server);
        const socket = socketIo(httpServer);

        // Device --> Server
        socket.on('connection', (socket: socketIo.Socket) =>
        {
            const query = socket.handshake.query;

            console.log(`DEVICE "${query.id}" ("${query.group ? query.group : "all"}" group) CONNECTED @ ${socket.id}`);

            this._devicesList.Add(query.id, query.group || "_no_group_", socket);

            socket.on('i-am-alive', (id, counter) => console.log('i-am-alive', id, counter));

            socket.on('reconnect_failed', (x) =>
            {
                console.log('reconnect_failed', x);
            });
            socket.on('reconnect_error', (x) =>
            {
                console.log('reconnect_error', x);
            });
            socket.on('reconnecting', (x) =>
            {
                console.log('reconnecting', x);
            });
            socket.on('reconnect_attempt', (x) =>
            {
                console.log('reconnect_attempt', x);
            });
            socket.on('reconnect', (x) =>
            {
                console.log('reconnect', x);
            });
            socket.on('connect_error', (x) =>
            {
                console.log('connect_error', x);
            });
            socket.on('connect_timeout', (x) =>
            {
                console.log('connect_timeout', x);
            });
            socket.on('error', (x) =>
            {
                console.log('error', x);
            });
            socket.on('disconnect', (reason) =>
            {
                console.log('DISCONNECT', socket.id, 'BECAUSE', reason);

                this._devicesList.Remove(socket.id);
            });
        });

        const port = process.env.PORT;// this._env.ValueOrDefault('PORT', '5000');
        console.log('Trying to start at port '+port);
        httpServer.listen(port, () => console.log('SERVER STARTED @ ' + port));

        process.on('SIGINT', () =>
        {
            httpServer.close(() => console.log('SERVER CLOSED'));
        });
    }
}
