import * as React from 'react';
import { TransCorder, Connection, Photo, IConnection } from '../TransCorder';
import { MessageBus } from '../MessageBus/MessageBus';
import { Button } from '@material-ui/core';
import { Types } from '../IoC/Types';
import { LazyInject } from '../IoC/IoC';
import { IAlert } from '../services/alert/IAlert';
import { DeviceLoopController } from './DeviceLoopController';
import { Connection as ConnectionComponent } from './Connection';

interface IState
{
    photo: string;
}

export class DevicePanel extends React.Component<{}, IState>
{
    @LazyInject(Types.IAlert) private _alert: IAlert;

    private device: TransCorder;
    private _connector: IConnection;

    constructor(props: any)
    {
        super(props);

        this.state = { photo: "" };

        this._connector = new Connection(new MessageBus()); // MB nie bez powodu nie jest brany z IoC: bo jaki scope mu przydzielić jeśli paneli może być kilka a URL jest przydzielany w Connectorze?
        this._connector.SetConnection(ConnectionComponent.LocalAddr, "");
        this.device = new TransCorder(this._connector);
    }

    async TakePhoto()
    {
        try
        {
            const pic: Photo = await this.device.TakePicture();
            const photo = "data:image/jpeg;charset=utf-8;base64, " + pic.AsBase64;
            this.setState({ photo });
        }
        catch (error)
        {
            this._alert.Error("Can not receive picture: " + error.message);
        }
    }

    async Ping()
    {
        try
        {
            await this.device.Ping();
            this._alert.Error("Device Pong!");
        }
        catch (error)
        {
            this._alert.Error("Pong error" + error.message);
        }
    }

    render()
    {
        return (
            <div>
                <ConnectionComponent deviceConnection={ this._connector } />
                <hr />
                <Button variant="contained" color="primary" onClick={ async () => await this.Ping() }>Ping device</Button>
                <Button variant="contained" color="primary" onClick={ async () => await this.TakePhoto() }>TAKE PHOTO</Button>
                <br />
                <img style={ { width: "250px" } } src={ this.state.photo } />
                <hr />
                <DeviceLoopController device={ this.device } />
            </div>
        );
    }
}