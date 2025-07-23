declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    DB_HOST: string;
    DB_USER: string;
    DB_PORT: string;
    DB_PASS: string;
    DB_NAME: string;
    PORT: string;
  }
}
