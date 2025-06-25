export interface IJwtState {
    callee?: {
        name: string;
    };
    group?: string;
    jwt?: string;
    server?: string;
    tenant?: string;
    user?: {
        id: string;
        name: string;
    };
}
