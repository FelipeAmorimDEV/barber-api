import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryBarbersRepository } from '../../../../test/repositories/in-memory-barbers-repository'

import { CreateBarberUseCase } from './create-barber'

let inMemoryBarbersRepository: InMemoryBarbersRepository
let sut: CreateBarberUseCase

describe("Create Barber", async () => {
  beforeEach(() => {
    inMemoryBarbersRepository = new InMemoryBarbersRepository()
    sut = new CreateBarberUseCase(inMemoryBarbersRepository)
  })


  it('create a barber', async () => {
    const { barber } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      userId: 'user-1',
      name: 'John Doe',
      expertise: 'Corte Masculino'
    })

    expect(inMemoryBarbersRepository.items[0])
      .toEqual(expect.objectContaining(
        {
          name: 'John Doe'
        }
      ))
    expect(barber.id).toBeTruthy()
    expect(barber.role).toEqual('barber')
  })
})

