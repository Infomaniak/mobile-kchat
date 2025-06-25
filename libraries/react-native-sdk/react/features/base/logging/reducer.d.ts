type LogLevel = 'trace' | 'log' | 'info' | 'warn' | 'error';
export interface ILoggingState {
    config: {
        defaultLogLevel: LogLevel;
        disableLogCollector?: boolean;
        loggers: {
            [key: string]: LogLevel;
        };
    };
    logCollector?: {
        flush: () => void;
        start: () => void;
        stop: () => void;
    };
}
export {};
