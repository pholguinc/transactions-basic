import * as joi from 'joi'
import * as dotenv from 'dotenv'

const nodeEnv = process.env.NODE_ENV || 'development'
dotenv.config({
  path: [`.env.${nodeEnv}`, '.env'],
  override: true,
})

interface EnvVars {
  NODE_ENV: string
  PORT: number
  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  JWT_SECRET: string
}

const envsSchema = joi.object<EnvVars>({
  NODE_ENV: joi.string().required(),
  PORT: joi.number().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  JWT_SECRET: joi.string().required(),
})

const { error, value } = envsSchema.validate(
  {
    ...process.env,
  },
  { allowUnknown: true },
) as { error: joi.ValidationError | undefined; value: EnvVars }

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: value.DB_PASSWORD,
  dbName: value.DB_NAME,
  jwtSecret: value.JWT_SECRET,
}
