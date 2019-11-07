import { Socket } from "socket.io";
import { injectable } from "inversify";

class SocketClient
{
    constructor(
        public Id: string = "",
        public Group: string = "",
        public RegistrationTime: Date,
        public Socket: Socket)
    { }
}

@injectable()
export class ClientsManager
{
    private devices: SocketClient[] = [];
 
    public Remove(id: string): void
    {
        // WARNING: THIS IS NOT ATOMIC!
        const deviceToRemoveIndex = this.devices.findIndex(x=>x.Socket.id === id);
        this.devices.splice(deviceToRemoveIndex, 1);
    }

    public get All()
    {
        return this.devices;
    }

    public Add(id: string, group, socket)
    {
        this.devices.push(new SocketClient(id, group, new Date(), socket));
    }

    public Send(id, msg): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            const device: SocketClient | undefined = this.devices.find(x => x.Id == id);
            if (device === undefined) 
            {
                console.log(`Device "${id}" not found`);
                reject(`Device "${ id }" not found`);
                return;
            }
            device.Socket.once('result', (result) => 
            {
                console.log('result', result);
                resolve(result);
            });
            device.Socket.emit('message', msg);
            console.log('Emitted');
        });
    }
}