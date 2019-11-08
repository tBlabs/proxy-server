import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

export class HttpClient
{
    public async SendMessage(msg, headers = {})
    {
        try
        {
            const url = `http://localhost:${process.env.PORT}/MessageBus`;
          
            const response = await axios.post(url, msg, { headers: { "Content-Type": "application/json", ...headers } });

            return response.data;
        }
        catch (error)
        {
            // console.log('err', error.message);
        }
    }
}
