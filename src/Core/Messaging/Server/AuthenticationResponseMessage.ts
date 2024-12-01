import { Client } from "../../Client";
import { PiranhaMessage } from "../PiranhaMessage";

export class AuthenticationResponseMessage extends PiranhaMessage {
    constructor(bytes: Buffer, _client: Client) {
        super(bytes, _client, "AuthenticationResponseMessage")
        this.setMessageType(20104)
    }

    public encode(): this {
        this.writeInt(this.getClient().getHighId())
        this.writeInt(this.getClient().getLowId())

        this.writeInt(this.getClient().getHighId())
        this.writeInt(this.getClient().getLowId())

        this.writeString("") // token

        this.writeString() // facebook
        this.writeString() // gamecenter

        this.writeInt(29)
        this.writeInt() // those who know 💀
        this.writeInt() // those who know 💀

        this.writeString("dev")

        this.writeInt()
        this.writeInt()
        this.writeInt()

        this.writeString()
        this.writeString()
        this.writeString()

        this.writeInt()

        this.writeString()
        this.writeString("RU") // noradrenaline 💀
        this.writeString()

        this.writeInt(1)

        this.writeString()

        this.writeInt()

        this.writeInt()

        this.writeVInt()

        this.writeString()

        this.writeVInt(1)
        this.writeVInt(1)

        this.writeString()
        return this
    }

    public process(): this {
        return this
    }
}