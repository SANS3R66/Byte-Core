import * as net from 'net'
import { Logger } from './Logger'
import { LogicLaserMessageFactory } from './Messaging/LogicLaserMessageFactory'
import { Client } from './Client'

export class Host {
    private static instance: Host
    private static logger: Logger

    private static ip = "0.0.0.0"
    private static port = 9339

    private static server: net.Server

    constructor() {
    }

    public static singleton(): Host {
        if (!Host.instance) {
            Host.instance = new Host()
            Host.logger = new Logger("Host")

            Host.logger.logPrint("Host singleton has been built!")
        }

        return Host.instance
    }

    public static run() {
        if (!Host.server) {
            Host.server = net.createServer((socket) => {
                Host.logger.logPrint("New client is connected!")

                const client = new Client(socket)

                socket.on('data', (data: Buffer) => {
                    // TODO: create a class that will process the data instead of putting everything in Host

                    const msgId = data.readUInt16BE(0)
                    const msgLength = data.readUIntBE(2, 3)
                    const msgVersion = data.readUInt16BE(5)

                    const totalMessageBuffer = data.subarray(7, msgLength)

                    LogicLaserMessageFactory.createMessageByType(msgId, totalMessageBuffer, client)
                })
            })

            Host.server.listen(this.port, this.ip, () => {
                Host.logger.logInfo("The server has been started!")
            })
        } else {
            Host.logger.logWarn("Server already was started.")
        }
    }
}