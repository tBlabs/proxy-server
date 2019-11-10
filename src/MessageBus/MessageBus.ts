import { injectable } from "inversify";

@injectable()
export class MessageBus
{
    public Url: string = '';

    async Send<T>(message: any, headers: any = null): Promise<T>
    {
        try
        {
            console.log("Sending", message, "...");

            const serializedMessage = JSON.stringify(message);

            const requestConfig = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                body: serializedMessage
            };

            const start = +(new Date());

            const response = await fetch(this.Url, requestConfig);

            if (response.ok)
            {
                let result = null;

                if (+response.headers.get("Content-Length") === 0)
                {
                    result = "";
                }
                else
                {
                    result = await response.json();
                }


                console.log(`Result:`, result, ` (took ${ +(new Date()) - start } ms)`);

                return result;
            }
            else
            {
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error)
        {
            console.log("MESSAGE BUS ERROR:", error);

            throw new Error(error);
        }
    }
}