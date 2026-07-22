declare namespace NodeJS {
    interface Require {
        context: (path: string) => unknown;
    }
}
