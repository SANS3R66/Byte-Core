import * as net from 'net'

export class Client {
    private readonly socket: net.Socket
    private highId: number = 0
    private lowId: number = 0

    constructor(_socket: net.Socket) {
        this.socket = _socket
    }

    public getSocket(): net.Socket {
        return this.socket
    }

    public setLowId(n: number): number {
        return this.lowId = n
    }

    public getLowId(): number {
        return this.lowId
    }

    public setHighId(n: number): number {
        return this.highId = n
    }

    public getHighId(): number {
        return this.highId
    }
}