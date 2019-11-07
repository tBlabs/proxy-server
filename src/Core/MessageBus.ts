import { IoC } from "../IoC/IoC";
import { injectable } from "inversify";

@injectable()
export class MessageBus
{
    public Register(message, messageHandler)
    {
        IoC.bind(message.name).to(messageHandler).inTransientScope();
    }

    public Execute(message)
    {
        const messageName = Object.keys(message)[0];

        if (!IoC.isBound(messageName))
            throw new Error(`Can not find "${ messageName }"`);

        const messageBody = message[messageName];

        const handler: any = IoC.get(messageName);
        return handler.Handle(messageBody);
    }
}