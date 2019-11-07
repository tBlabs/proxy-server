import { IoC } from "./IoC/IoC";
import { MessageBus } from "./Core/MessageBus";
import { Ping, PingHandler } from "./Handlers/Ping";
import { GetClientsGroup, GetClientsGroupHandler } from "./Handlers/GetClientsGroup";


const messageBus = IoC.get(MessageBus);

messageBus.Register(Ping, PingHandler);
messageBus.Register(GetClientsGroup, GetClientsGroupHandler);
