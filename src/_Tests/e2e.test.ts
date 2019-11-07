import axios from 'axios';
import * as SocketClientt from 'socket.io-client';
axios.defaults.adapter = require('axios/lib/adapters/http');
import * as dotenv from 'dotenv';
dotenv.config();

class HttpClient
{
    public async SendMessage(id, msg)
    {
        try
        {
            let recipient = {};
            const url = `http://localhost:${ process.env.PORT }/MessageBus`;
            if (id !== "")
                recipient ={ "Recipient": id};
            const response = await axios.post(url, msg, { headers: { "Content-Type": "application/json", ...recipient } });

            return response.data;
        } 
        catch (error)
        {
            console.log('err', error.message);
        }
    }
}

class SocketClient
{
    private client: any;
    private onMessageCallback?: (msg) => void;

    constructor(id, group?)
    {
        let connectionString = '';

        if (group)
            connectionString = `http://localhost:${ process.env.PORT }?id=${id}&group=${group}`;
        else 
            connectionString = `http://localhost:${ process.env.PORT }?id=${id}`;

        this.client = SocketClientt(connectionString, { rejectUnauthorized: false });

        this.client.on('message', (msg) =>
        {
            if (this.onMessageCallback) this.onMessageCallback(msg);
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

test('http client to socket client', async (done) =>
{
    const client1 = new HttpClient();
    const client2 = new SocketClient("Id1");

    client2.OnMessage((msg) =>
    {
        expect(msg.Foo.Bar).toBe("bar");
     
        client2.Dispose();
        done();
    });

    await client1.SendMessage("Id1", { Foo: { Bar: "bar" } });
});

test('socket client to socket client', async (done) =>
{
    const client1 = new SocketClient("Id1"); // it uses HttpClient internally, so probably this test make no sense...
    const client2 = new SocketClient("Id2");

    client2.OnMessage((msg) =>
    {
        expect(msg.Foo.Bar).toBe("bar");
     
        client1.Dispose();
        client2.Dispose();
        done();
    });

    await client1.SendMessage("Id2", { Foo: { Bar: "bar" } });
});

test('http client with group to socket client  in group', async (done) =>
{
    const client1 = new SocketClient("Id1", "Group1");
    const client2 = new SocketClient("Id2", "Group2");
    const client3 = new SocketClient("Id3", "Group1");
    
    const httpClient = new HttpClient();
    const clients = await httpClient.SendMessage("", { GetClientsGroup: { Name: "Group1" }});

    expect(clients.length).toBe(2);
    expect(clients[0].Id).toContain("Id1");
    expect(clients[1].Id).toContain("Id3");

    client1.Dispose();
    client2.Dispose(); 
    client3.Dispose();
    done();
});