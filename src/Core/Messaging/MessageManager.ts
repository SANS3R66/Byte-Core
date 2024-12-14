import { Client } from "../Client";
import { Logger } from "../Logger";
import { LogicLaserMessageFactory } from "./LogicLaserMessageFactory";

export class MessageManager {
    public static readonly logger = new Logger("MessageManager")
    constructor() { }

    public static receiveMessage(data: Buffer, client: Client) {
        const msgId = data.readUInt16BE(0)
        const msgLength = data.readUIntBE(2, 3)
        const msgVersion = data.readUInt16BE(5)

        const totalMessageBuffer = data.subarray(7, msgLength)

        LogicLaserMessageFactory.createMessageByType(msgId, totalMessageBuffer, client)
    }
}