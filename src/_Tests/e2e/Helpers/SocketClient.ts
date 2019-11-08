import { HttpClient } from './HttpClient';
import * as SocketClientt from 'socket.io-client';

export class SocketClient
{
    private client: any;
    private onMessageCallback?: (msg) => void;

    constructor(private id: string, private group?: string)
    {

    }

    public async Connect()
    {
        return new Promise((resolve, reject) =>
        {
            let connectionString = '';
            if (this.group)
                connectionString = `http://localhost:${process.env.PORT}?id=${this.id}&group=${this.group}`;
            else
                connectionString = `http://localhost:${process.env.PORT}?id=${this.id}`;

            this.client = SocketClientt(connectionString, { rejectUnauthorized: false });

            this.client.on('message', (msg) =>
            {
                if (this.onMessageCallback)
                    this.onMessageCallback(msg);
            });

            this.client.on('connect', () => resolve());
        });
    }

    SendMessage(id, msg)
    {
        const http = new HttpClient();
        http.SendMessage(id, msg);
    }

    Dispose()
    {
        this.client.disconnect();
    }

    OnMessage(callback)
    {
        this.onMessageCallback = callback;
    }
}
