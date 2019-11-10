import * as React from 'react';
import { Types } from '../IoC/Types';
import { LazyInject } from './../IoC/IoC';
import { Button, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel, Select, MenuItem, Checkbox, Switch, Typography, Grid, Slider, Input, TextField, Box } from "@material-ui/core";
import { IAlert } from '../services/alert/IAlert';
import { IConnection } from '../TransCorder';
import { ProxyServer } from '../ProxyServer/ProxyServer';
import { ClientDto } from '../ProxyServer/ClientDto';

interface IProps
{
    deviceConnection: IConnection;
}

interface IState
{
    deviceId: string;
    pingReceivedLabel: boolean;
    directAddr: string;
    connectionType: string;
    devicesList: string[];
}

export class Connection extends React.Component<IProps, IState>
{
    @LazyInject(Types.ProxyServer) private _proxy: ProxyServer;
    @LazyInject(Types.IAlert) private _alert: IAlert;

    public static LocalAddr = "http://localhost:4000";

    constructor(props: any)
    {
        super(props);
        this.state = {
            deviceId: "",
            connectionType: "LOCAL",
            pingReceivedLabel: false, directAddr: "http://192.168.:4000",
            devicesList: []
        };
    }

    private ConnectTo(addr: string, deviceId?: string): void
    {
        this.props.deviceConnection.SetConnection(addr, deviceId || "");

        this._alert.Error('Switched to ' + addr + (deviceId ? ` (${ deviceId })` : ""));
    }

    render()
    {
        return (
            <div>
                <RadioGroup value={ this.state.connectionType }>

                    <FormControlLabel value="LOCAL" control={ <Radio /> } label="LOCAL" onClick={ async (e: any) =>
                    {
                        e.preventDefault();
                        this.setState({ connectionType: "LOCAL" });
                        this.ConnectTo(Connection.LocalAddr)
                    }
                    } />


                    <Box>
                        <FormControlLabel value="DIRECT" control={ <Radio /> } label="DIRECT" onClick={ async (e: any) =>
                        {
                            e.preventDefault();
                            this.setState({ connectionType: "DIRECT" });

                            this.ConnectTo(this.state.directAddr)
                        }
                        } />
                        <TextField
                            id="standard-basic"
                            label="IP"
                            margin="normal"
                            value={ this.state.directAddr }
                            onChange={ async (x) =>
                            {
                                const addr = x.target.value as string;
                                this.setState({ directAddr: addr, connectionType: "DIRECT" });
                                this.ConnectTo(addr);
                            }
                            }
                        />
                    </Box>

                    <Box>
                        <FormControlLabel value="REMOTE" control={ <Radio /> } label="REMOTE" onClick={ async (e: any) =>
                        {
                            e.preventDefault();
                            this.setState({ connectionType: "REMOTE" });
                            await this.GetDevicesList();
                            this.ConnectTo(this._proxy.Addr, this.state.deviceId)
                        }
                        } />

                        <FormControl variant="outlined">
                            <Select value={ this.state.deviceId }
                                onChange={ async (e) =>
                                {
                                    const selectedDevice = e.target.value as string;
                                    this.setState({ deviceId: selectedDevice, connectionType: "REMOTE" });
                                    this.ConnectTo(this._proxy.Addr, this.state.deviceId);
                                } }>
                                { this.state.devicesList.map(x => <MenuItem value={ x }>{ x }</MenuItem>) }
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="default" onClick={ async () => await this.GetDevicesList() }>REFRESH LIST</Button>
                        <Button variant="contained" color="primary" onClick={ async () => await this.Ping() }>PING SERVER</Button>

                    </Box>
                </RadioGroup>
            </div>
        );
    }

    public async GetDevicesList()
    {
        try
        {
            const devices: ClientDto[] = await this._proxy.GetDevicesList();

            this.setState({
                devicesList: devices.map(x => x.Id),
                deviceId: devices.length ? devices[0].Id : ""
            });

            this._alert.Error(devices.length + ' devices found');
        }
        catch (ex)
        {
            this._alert.Error('Can not obtain devices list: ' + ex.message);
        }
    }

    public async Ping()
    {
        try
        {
            await this._proxy.Ping();

            this._alert.Error("ProxyServer Pong!");
        }
        catch (ex)
        {
            this._alert.Error(ex.message);
        }
    }
}