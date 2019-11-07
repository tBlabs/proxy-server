import { IQueryHandler } from "../Core/IQueryHandler";
import { IQuery } from "../Core/IQuery";
import { injectable } from "inversify";
import { ClientsManager } from "../Services/DevicesManager";

class ClientDto
{
    constructor(
        public Id: string = "",
        public Group: string = "",
        public RegistrationTime: Date)
    { }
}
export class GetClientsGroup implements IQuery<ClientDto[]>
{
    constructor(public Name: string)
    { }
}

@injectable()
export class GetClientsGroupHandler implements IQueryHandler<GetClientsGroup, ClientDto[]>
{
    constructor(private _list: ClientsManager)
    { }

    async Handle(query: GetClientsGroup): Promise<ClientDto[]>
    {
        const clientsDtos = this._list.All
            .filter(x => x.Group === query.Name)
            .map(x => new ClientDto(x.Id, x.Group, x.RegistrationTime));
        // console.log(clientsDtos);
        return clientsDtos;
    }
}