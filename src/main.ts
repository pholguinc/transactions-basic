import { createServer } from './interfaces/http/createServer'
import { envs } from './infraestructure/config'

const main = () => {
  const app = createServer()

  app.listen(envs.port, () => {
    console.log(`🚀 Server running at http://localhost:${envs.port}`)
  })
}

main()
