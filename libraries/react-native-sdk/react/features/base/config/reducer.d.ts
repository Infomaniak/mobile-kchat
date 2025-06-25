import { IConfig } from './configType';
export interface IConfigState extends IConfig {
    analysis?: {
        obfuscateRoomName?: boolean;
    };
    disableRemoteControl?: boolean;
    error?: Error;
    oldConfig?: {
        bosh?: string;
        focusUserJid?: string;
        hosts: {
            domain: string;
            muc: string;
        };
        p2p?: object;
        websocket?: string;
    };
    visitors?: {
        enableMediaOnPromote?: {
            audio?: boolean;
            video?: boolean;
        };
    };
}
