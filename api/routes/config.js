
export const config = {
    user: "txphrmdev",
    password: "empfrm@1",
    server: "txphrmdev.database.windows.net",
    database: "smapi",
    connectionTimeout: 3000,
    parseJSON: true,
    options: {
        trustedconnection: true,
        encrypt: true
    },
    pool: {
        min: 0,
        idleTimeoutMillis: 3000
    },
    port: 1433
};
