import * as React from 'react';
import { Types } from '../IoC/Types';
import { LazyInject } from '../IoC/IoC';
import { Button, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel, Select, MenuItem, Checkbox, Switch, Typography, Grid, Slider, Input, Box } from "@material-ui/core";
import { IAlert } from '../services/alert/IAlert';
import { TransCorder } from '../TransCorder';
import { DeviceConfig } from '../Device/DeviceConfig';

interface IProps
{
    device: TransCorder;
}

interface IState
{
    value: string;
    interval: number;
}

export class DeviceLoopController extends React.Component<IProps, IState>
{
    @LazyInject(Types.IAlert) private _alert: IAlert;

    constructor(props: any)
    {
        super(props);

        this.state = { value: "", interval: 1000 };
    }

    private async Update(config: Partial<DeviceConfig>): Promise<void>
    {
        try
        {
            await this.props.device.SetConfig(config);
            this._alert.Error("Config updated");
        }
        catch (error)
        {
            this._alert.Error("Can not update config: " + error.message);
        }
    }

    render()
    {
        return (
            <div>
                <RadioGroup>
                    <FormControlLabel value="1" control={ <Radio /> } label="CONTINUOUS" onClick={ async (e: any) =>
                    {
                        await this.Update({ Interval: 0, CanWork: true })
                    } } />
                    <FormControlLabel value="2" control={ <Radio /> } label="ON DEMAND" onClick={ async (e: any) =>
                    {
                        await this.Update({ CanWork: false });
                    } } />
                    <Box>
                        <FormControlLabel value="3" control={ <Radio /> } label="INTERVAL" onClick={ async (e: any) =>
                        {
                            await this.Update({ Interval: this.state.interval, CanWork: true })
                        } } />
                        <Input
                            value={ this.state.interval }
                            margin="dense"
                            onChange={ async (e) =>
                            {
                                e.preventDefault();
                                this.setState({ interval: +e.target.value });
                                await this.Update({ Interval: +e.target.value });
                            } }
                            inputProps={ {
                                step: 500,
                                min: 0,
                                max: 100000,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            } }
                        />
                    </Box>
                    <FormControlLabel value="4" control={ <Radio /> } disabled label="TIMER" />
                    <FormControlLabel value="5" control={ <Radio /> } disabled label="MOVEMENT DETECTION" />
                    <FormControlLabel value="6" control={ <Radio /> } disabled label="ON EXTERNAL INTERRUPT" />
                </RadioGroup>
                <hr />
                <Typography>Storage</Typography>
                <RadioGroup>
                    <FormControlLabel value="StoreInInternalMemory" control={ <Switch /> } disabled label="INTERNAL MEMORY" />
                    <FormControlLabel control={ <Switch /> } label="EXTERNAL MEMORY" onChange={ async (e: any) => this.Update({ StoreInExternalMemory: e.target.checked }) } />
                    <FormControlLabel control={ <Switch /> } label="CLOUD" onChange={ async (e: any) => await this.Update({ StoreInCloud: e.target.checked }) } />
                </RadioGroup>
            </div>
        );
    }
}