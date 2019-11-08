import * as dotenv from 'dotenv';
dotenv.config();
import { HttpClient } from './Helpers/HttpClient';
import { SocketClient } from './Helpers/SocketClient';

test('http client to socket client', async (done) =>
{
    const client1 = new HttpClient();
    const client2 = new SocketClient("Id1");
    await client2.Connect();
 
    client2.OnMessage((msg) =>
    {
        expect(msg.Foo.Bar).toBe("bar");
     
        client2.Dispose();
        done();
    });

    await client1.SendMessage({ Foo: { Bar: "bar" } }, { "Recipient": "Id1" });
});

test('socket client to socket client', async (done) =>
{
    const client1 = new SocketClient("Id1"); // it uses HttpClient internally, so probably this test make no sense...
    const client2 = new SocketClient("Id2");
    await Promise.all([client1.Connect(), client2.Connect()]);
 
    client2.OnMessage((msg) =>
    {
        expect(msg.Foo.Bar).toBe("bar");
     
        client1.Dispose();
        client2.Dispose();
        done();
    });

    await client1.SendMessage({ Foo: { Bar: "bar" } }, { "Recipient": "Id2" });
});

test('should obtain clients in specified group', async (done) =>
{
    const client1 = new SocketClient("Id1", "Group1");
    const client2 = new SocketClient("Id2", "Group2");
    const client3 = new SocketClient("Id3", "Group1");
    await Promise.all([client1.Connect(), client2.Connect(), client3.Connect()]);
    
    const httpClient = new HttpClient();
    const clients = await httpClient.SendMessage({ GetClientsGroup: { Name: "Group1" }});

    expect(clients.length).toBe(2);
    expect(clients[0].Id).toContain("Id1");
    expect(clients[1].Id).toContain("Id3");

    client1.Dispose();
    client2.Dispose(); 
    client3.Dispose();
    done();
});