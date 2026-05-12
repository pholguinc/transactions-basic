import { envs } from '../src/infraestructure/config'

describe('Configuracion', () => {
  it('debería tener un puerto definido', () => {
    expect(envs.port).toBeDefined()
  })
})
