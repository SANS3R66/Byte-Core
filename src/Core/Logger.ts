import clc from 'cli-color';

export class Logger {
    private logName: string;

    constructor(_logName: string) {
        this.logName = _logName;
    }

    public setLogName(n: string) {
        this.logName = n
    }

    public logInfo(message: string): void {
        console.log(clc.cyanBright(`[${this.logName}] -> ${message}`));
    }

    public logPrint(message: string): void {
        console.log(clc.black.bold(`[${this.logName}] -> ${message}`));
    }

    public logWarn(message: string): void {
        console.log(clc.yellow(`[WARN ${this.logName}] -> ${message}`));
    }

    public logError(message: string): void {
        console.log(clc.red.bold(`[ERR ${this.logName}] -> ${message}`));
    }
}
