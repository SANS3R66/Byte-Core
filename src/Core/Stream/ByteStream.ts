// https://github.com/tailsjs/nodebrawl-core/blob/main/ByteStream/index.js

export class ByteStream {
    public buffer: Buffer;
    public length: number;
    public offset: number;
    public bitOffset: number;

    constructor() {
        this.buffer = Buffer.alloc(0);
        this.length = 0;
        this.offset = 0;
        this.bitOffset = 0;
    }

    public readInt(): number {
        this.bitOffset = 0;
        return (
            (this.buffer[this.offset++] << 24 |
                (this.buffer[this.offset++] << 16 |
                    (this.buffer[this.offset++] << 8 |
                        this.buffer[this.offset++])))
        );
    }

    public skip(len: number) {
        this.bitOffset += len;
    }

    public readShort(): number {
        this.bitOffset = 0;
        return (this.buffer[this.offset++] << 8 | this.buffer[this.offset++]);
    }

    public writeShort(value: number) {
        this.bitOffset = 0;
        this.ensureCapacity(2);
        this.buffer[this.offset++] = (value >> 8);
        this.buffer[this.offset++] = (value);
    }

    public writeInt(value: number = 0) {
        this.bitOffset = 0;
        this.ensureCapacity(4);
        this.buffer[this.offset++] = (value >> 24);
        this.buffer[this.offset++] = (value >> 16);
        this.buffer[this.offset++] = (value >> 8);
        this.buffer[this.offset++] = (value);
    }

    public writeString(value: string | undefined = undefined) {
        if (value == null || value.length > 90000) {
            this.writeInt(-1);
            return;
        }

        const buf = Buffer.from(value, 'utf8');
        this.writeInt(buf.length);
        this.buffer = Buffer.concat([this.buffer, buf]);
        this.offset += buf.length;
    }

    public readString(): string {
        const length = this.readInt();

        if (length > 0 && length < 90000) {
            const stringBytes = this.buffer.subarray(this.offset, this.offset + length);
            const string = stringBytes.toString('utf8');
            this.offset += length;
            return string;
        }
        return '';
    }

    public readDataReference(): number[] {
        const a1 = this.readVInt();
        return [a1, a1 == 0 ? 0 : this.readVInt()];
    }

    public writeDataReference(value1: number, value2: number) {
        if (value1 < 1) {
            this.writeVInt(0);
        } else {
            this.writeVInt(value1);
            this.writeVInt(value2);
        }
    }

    public writeVInt(value: number = 0) {
        this.bitOffset = 0;
        let temp = (value >> 25) & 0x40;

        let flipped = value ^ (value >> 31);

        temp |= value & 0x3F;

        value >>= 6;
        flipped >>= 6;

        if (flipped === 0) {
            this.writeByte(temp);
            return 0;
        }

        this.writeByte(temp | 0x80);

        flipped >>= 7;
        let r = 0;

        if (flipped) { r = 0x80; }

        this.writeByte((value & 0x7F) | r);

        value >>= 7;

        while (flipped !== 0) {
            flipped >>= 7;
            r = 0;
            if (flipped) { r = 0x80; }
            this.writeByte((value & 0x7F) | r);
            value >>= 7;
        }
    }

    public readVInt(): number {
        let result = 0,
            shift = 0,
            s = 0,
            a1 = 0,
            a2 = 0;
        do {
            let byte = this.buffer[this.offset++];
            if (shift === 0) {
                a1 = (byte & 0x40) >> 6;
                a2 = (byte & 0x80) >> 7;
                s = (byte << 1) & ~0x181;
                byte = s | (a2 << 7) | a1;
            }
            result |= (byte & 0x7f) << shift;
            shift += 7;
            if (!(byte & 0x80)) { break; }
        } while (true);

        return (result >> 1) ^ (-(result & 1));
    }

    public writeBoolean(value: boolean) {
        if (this.bitOffset === 0) {
            this.ensureCapacity(1);
            this.buffer[this.offset++] = 0;
        }

        if (value) { this.buffer[this.offset - 1] |= (1 << this.bitOffset); }

        this.bitOffset = (this.bitOffset + 1) & 7;
    }

    public readBoolean(): boolean {
        return this.readVInt() >= 1;
    }

    public writeStringReference = this.writeString;

    public writeLongLong(value: number) {
        this.writeInt(value >> 32);
        this.writeInt(value);
    }

    public writeLogicLong(value1: number, value2: number) {
        this.writeVInt(value1);
        this.writeVInt(value2);
    }

    public readLogicLong(): number[] {
        return [this.readVInt(), this.readVInt()];
    }

    public writeLong(value1: number, value2: number) {
        this.writeInt(value1);
        this.writeInt(value2);
    }

    public readLong(): number[] {
        return [this.readInt(), this.readInt()];
    }

    public writeByte(value: number) {
        this.bitOffset = 0;
        this.ensureCapacity(1);
        this.buffer[this.offset++] = value;
    }

    public writeBytes(buffer: Buffer) {
        const length = buffer.length;

        if (buffer != null) {
            this.writeInt(length);
            this.buffer = Buffer.concat([this.buffer, buffer]);
            this.offset += length;
            return;
        }

        this.writeInt(-1);
    }

    public ensureCapacity(capacity: number) {
        const bufferLength = this.buffer.length;

        if (this.offset + capacity > bufferLength) {
            const tmpBuffer = Buffer.alloc(capacity);
            this.buffer = Buffer.concat([this.buffer, tmpBuffer]);
        }
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
