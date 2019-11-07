import { IQueryHandler } from "../Core/IQueryHandler";
import { IQuery } from "../Core/IQuery";
import { injectable } from "inversify";

export class Ping implements IQuery<PingResponse>
{

}

class PingResponse
{

}

@injectable()
export class PingHandler implements IQueryHandler<Ping, PingResponse>
{
    async Handle(query: Ping): Promise<PingResponse>
    {
        console.log('ping-pong');

        return new PingResponse();
    }
}