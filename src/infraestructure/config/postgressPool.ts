import { Pool, type PoolConfig } from 'pg'
import { envs } from '.'

const poolConfig: PoolConfig = {
  host: envs.dbHost,
  port: envs.dbPort,
  database: envs.dbName,
  user: envs.dbUser,
  password: envs.dbPassword,
}

export const pool = new Pool(poolConfig)
