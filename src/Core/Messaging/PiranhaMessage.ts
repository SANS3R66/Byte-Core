import { dlopen } from "process";
import { Client } from "../Client";
import { DLogger } from "../DynamicLogger";
import { ByteStream } from "../Stream/ByteStream";

export class PiranhaMessage extends ByteStream {
    private messageId: number = 20000
    private messageVersion: number = 0 // useless ig?
    protected readonly logger2: DLogger = new DLogger("unknown PiranhaMessage") // TODO: change logger name idk
    private readonly client: Client
    private readonly messageTypeName: string

    constructor(bytes: Buffer, _client: Client, msgtypename: string) {
        super()
        this.replaceBuffer(bytes)

        this.client = _client
        this.messageTypeName = msgtypename
        this.logger2.setLogName(msgtypename)
        this.logger2.logPrint("Built " + msgtypename)
    }

    public static isServerMessage(n: number) {
        return n >= 20000
    }

    public setMessageType(n: number): number {
        return this.messageId = n
    }

    public getMessageType(): number {
        return this.messageId
    }

    public getClient(): Client {
        return this.client
    }

    public getMessageTypeName() { // TODO?

    }

    public send() {
        try {
            const header = Buffer.alloc(7)
            header.writeUInt16BE(this.messageId, 0)
            header.writeUIntBE(this.getLength(), 2, 3)
            header.writeUInt16BE(this.messageVersion, 5)

            this.client.getSocket().write(Buffer.concat([header, this.getBuffer(), Buffer.from([0xFF, 0xFF, 0x0, 0x0, 0x0, 0x0, 0x0])]))
        } catch (e) {
            this.logger2.logError("Couldn't send message! Error:" + e)
        }
    }

    public decode() { // should always return self!
        this.logger2.logError("Decode is not implemented in this PiranhaMessage!")
    }

    public encode() { // should always return self!
        this.logger2.logError("Encode is not implemented in this PiranhaMessage!")
    }

    public process() {

    }
}