import { Client } from "../Client"
import { Logger } from "../Logger"
import { ClientHelloMessage } from "./Client/ClientHelloMessage"
import { TitanLoginMessage } from "./Client/TitanLoginMessage"
import { PiranhaMessage } from "./PiranhaMessage"
import { AuthenticationResponseMessage } from "./Server/AuthenticationResponseMessage"

export class LogicLaserMessageFactory {
    private static logger: Logger = new Logger("LogicLaserMessageFactory")

    constructor() { }

    public static createMessageByType(type: number, bytes: Buffer, client: Client | null) {
        switch (type) {
            case 10100:
                if (client) {
                    new ClientHelloMessage(bytes, client)
                        .decode()
                        .process()
                }
                break
            case 10101:
                if (client) {
                    new TitanLoginMessage(bytes, client)
                        .decode()
                        .process()
                }
                break

            case 20104:
                if (client) {
                    new AuthenticationResponseMessage(bytes, client)
                        .encode()
                        .send()
                }
                break
            default:
                this.logger.logWarn("No message for type " + type.toString() + ". Skip.")
                break
        }
    }
}