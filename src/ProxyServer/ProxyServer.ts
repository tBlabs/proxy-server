import { injectable } from "inversify";
import { MessageBus } from "../MessageBus/MessageBus";
import { Connection } from "../TransCorder";
import { ClientDto } from "./ClientDto";

@injectable()
export class ProxyServer
{
    private _bus: MessageBus;
    public Addr = "http://localhost:5000"; // "http://cqrs-proxy-server.herokuapp.com"

    constructor()
    {
        this._bus = new MessageBus(); // czy aby na pewno moge go wziąć z kontenera? tylko jeśli jest Transient, chyba że by zrobić jakiś dedykowany dla ProxyServera??
        this._bus.Url = this.Addr + '/MessageBus';
    }

    public async GetDevicesList(): Promise<ClientDto[]>
    {
        return await this._bus.Send<ClientDto[]>({ GetClientsGroup: { Name: "transcorder" } });
    }

    public async Ping()
    {
        await this._bus.Send({ Ping: {} });
    }
}