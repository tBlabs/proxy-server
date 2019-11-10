import { MessageBus } from "./MessageBus/MessageBus";
import { DeviceConfig } from "./Device/DeviceConfig";

export interface IConnection
{
    SetConnection(connectionString: string, deviceId: string): void;
    Send<T>(message: any): Promise<T>;
}

export class Connection implements IConnection
{
    private deviceId: string;

    constructor(private _messageBus: MessageBus)
    { }

    public SetConnection(connectionString: string, deviceId: string): void
    {
        this._messageBus.Url = connectionString + '/MessageBus';
        this.deviceId = deviceId;
    }

    public async Send<T>(message: any): Promise<T>
    {
        const headers = { "recipient": this.deviceId };
        return await this._messageBus.Send<T>(message, headers);
    }
}

export class Photo
{
    public Dir = "";
    public AsBase64 = "";
}

export class TransCorder
{
    private config: DeviceConfig = new DeviceConfig();

    constructor(private _connection: IConnection)
    { }

    public get Config(): DeviceConfig
    {
        return this.config;
    }

    public async GetConfig(): Promise<DeviceConfig>
    {
        this.config = await this._connection.Send<DeviceConfig>({ GetConfig: {} });
        console.log('Device config:', this.config);
        return this.config;
    }

    public async SetConfig(config: Partial<DeviceConfig>): Promise<void>
    {
        let configCopy = Object.assign(this.config, config);

        await this._connection.Send<DeviceConfig>({ Config: configCopy });

        this.config = configCopy; // override only when config update succeeded

        console.log('Config update succeeded', this.config);
    }

    public async Ping(): Promise<void>
    {
        await this._connection.Send<void>({ Ping: {} });
    }

    public async TakePicture(): Promise<Photo>
    {
        let photo: Photo = await this._connection.Send<Photo>({ TakePicture: { Unpack: true } });
        return photo;
    }
}