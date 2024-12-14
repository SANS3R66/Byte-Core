import { Client } from "../../Client";
import { LogicLaserMessageFactory } from "../LogicLaserMessageFactory";
import { PiranhaMessage } from "../PiranhaMessage";

export class TitanLoginMessage extends PiranhaMessage {
    constructor(bytes: Buffer, _client: Client) {
        super(bytes, _client, "TitanLoginMessage")
        this.setMessageType(10101)
    }

    public decode(): this {
        this.getClient().setHighId(this.readInt())
        this.getClient().setLowId(this.readInt())

        // lazy to read more
        return this
    }

    public process(): this {
        this.loggerPiranha.logPrint("highid: " + this.getClient().getHighId().toString() + ". lowid: " + this.getClient().getLowId().toString())

        LogicLaserMessageFactory.createMessageByType(20104, Buffer.alloc(0), this.getClient())
        return this
    }
}