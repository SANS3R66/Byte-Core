// TODO: datareference methods (later)

import { Logger } from "../Logger"

export class ByteStream {
    private buffer: Buffer = Buffer.alloc(0)
    private offset: number = 0
    private readonly logger: Logger = new Logger("ByteStream")

    constructor() { }

    public getOffset(): number {
        return this.offset
    }

    public seek(n: number) {
        this.offset = n
    }

    public writeInt(n: number = 0) {
        this.expandBuffer(4)
        if (n < -2147483648) {
            this.logger.logWarn("Number is less than -2147483648!")
            this.buffer.writeInt32BE(0, this.offset)
        } else if (n > 2147483647) {
            this.logger.logWarn("Number is more than 2147483647!")
            this.buffer.writeInt32BE(0, this.offset)
        } else {
            this.buffer.writeInt32BE(n, this.offset)
        }

        this.offset += 4
    }

    public readInt(): number {
        const retval = this.buffer.readInt32BE(this.offset)
        this.offset += 4
        return retval
    }

    public writeShort(n: number) {
        this.expandBuffer(2)
        if (n < -32768) {
            this.logger.logWarn("Short is less than -32768!")
            this.buffer.writeInt16BE(0, this.offset)
        } else if (n > 32767) {
            this.logger.logWarn("Short is more than -32767!")
            this.buffer.writeInt16BE(0, this.offset)
        } else {
            this.buffer.writeInt16BE(n, this.offset)
        }
        this.offset += 2
    }

    public readShort(): number {
        const retval = this.buffer.readInt16BE(this.offset)
        this.offset += 2
        return retval
    }

    public writeString(str: string | null = null) {
        if (str) {
            this.writeInt(str.length)
            this.expandBuffer(str.length)
            this.buffer.write(str, this.offset, 'utf8')
            this.offset += str.length
        } else {
            this.writeInt(-1)
        }
    }

    public readString(): string {
        const len = this.readInt()
        const retval = this.buffer.toString('utf8', this.offset, this.offset + len)
        this.offset += len
        return retval
    }

    public writeByte(byte: number): void {
        this.buffer = Buffer.concat([this.buffer, Buffer.from([byte])]);
        this.offset++
    }

    public readByte(): number {
        const retval = this.buffer[this.offset]
        this.offset++
        return retval
    }

    // TODO: fix? writeVInt() & readVInt

    public writeVInt(n: number = 0, rotate = true): void {
        let v1 = (((n >> 25) & 0x40) | (n & 0x3F)),
            v2 = ((n ^ (n >> 31)) >> 6), v3

        n >>= 6;
        if (v2 == 0) {
            this.writeByte(v1);
        } else {
            this.writeByte(v1 | 0x80);
            v2 >>= 7;
            v3 = 0;
            if (v2 > 0) {
                v3 = 0x80;
            }
            this.writeByte((n & 0x7F) | v3);
            n >>= 7;
            while (v2 != 0) {
                v2 >>= 7;
                v3 = 0;
                if (v2 > 0) {
                    v3 = 0x80;
                }
                this.writeByte((n & 0x7F) | v3);
                n >>= 7;
            }
        }
    }

    public readVInt(rotate = true): number {
        let result = 0;
        let shift = 0;

        while (true) {
            let byte = this.readByte();

            if (rotate) {
                const lsb = (byte & 0x20) >> 5;
                const msb = (byte & 0x80) >> 7;
                byte = (byte & 0x1F) | (msb << 7) | (lsb << 6);
                rotate = false;
            }

            result |= (byte & 0x7F) << shift;
            shift += 7;

            if ((byte & 0x80) === 0) {
                break;
            }
        }

        return (result >>> 1) ^ (-(result & 1));
    }

    public expandBuffer(n: number) {
        const newBuffer = Buffer.alloc(n)
        this.buffer = Buffer.concat([this.buffer, newBuffer])
    }

    public reset() {
        this.buffer = Buffer.alloc(0)
        this.offset = 0
    }

    public getLength(): number {
        return this.buffer.length
    }

    public getBuffer(): Buffer {
        return this.buffer
    }

    public replaceBuffer(b: Buffer): Buffer {
        this.offset = 0
        return this.buffer = b
    }
}