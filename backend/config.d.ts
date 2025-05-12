export interface HonneamanoMongoDBConfig {
    uri: string,
    database_name: string,
}


export interface HonneamanoConfig {
    listen_port: number,

    mongodb: HonneamanoMongoDBConfig,
}