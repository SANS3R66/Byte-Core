import * as net from 'net'
import { Logger } from './Logger'
import { Client } from './Client'
import { MessageManager } from './Messaging/MessageManager'

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

    public static listen() {
        if (!Host.server) {
            Host.server = net.createServer((socket) => {
                Host.logger.logPrint("New client is connected!")

                const client = new Client(socket)

                socket.on('data', (data: Buffer) => {
                    MessageManager.receiveMessage(data, client)
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