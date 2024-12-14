import { Client } from "../../Client";
import { PiranhaMessage } from "../PiranhaMessage";

export class ClientHelloMessage extends PiranhaMessage {
    constructor(bytes: Buffer, _client: Client) {
        super(bytes, _client, "ClientHelloMessage")
        this.setMessageType(10100)
    }

    public decode(): this {
        return this
    }

    public process(): this {
        this.loggerPiranha.logWarn("Gotcha ClientHelloMessage. Looks like client has PepperCrypto.")
        return this
    }
}