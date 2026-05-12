import express from 'express'
import authRoutes from './routes/auth.routes'
import transactionsRoutes from './routes/transactions.routes'

export const createServer = () => {
  const app = express()

  const API_PREFIX = '/api/v1'

  app.use(express.json())

  app.use(`${API_PREFIX}/auth`, authRoutes)
  app.use(`${API_PREFIX}/transactions`, transactionsRoutes)

  return app
}
