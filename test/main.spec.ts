import { getServerPort } from '../src/main'

describe('main.ts', () => {
  it('debería devolver el puerto predeterminado 3000 cuando no se haya configurado el entorno.', () => {
    delete process.env.PORT

    expect(getServerPort()).toBe(3000)
  })

  it('debería devolver el puerto de la variable de entorno', () => {
    process.env.PORT = '5000'

    expect(getServerPort()).toBe('5000')
  })
})
