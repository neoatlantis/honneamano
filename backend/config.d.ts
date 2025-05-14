export interface HonneamanoMongoDBConfig {
    uri: string,
    database_name: string,
}


export interface HonneamanoConfig {
    host: string,

    listen_port: number,

    kvdb: string,
    mongodb: HonneamanoMongoDBConfig,
}