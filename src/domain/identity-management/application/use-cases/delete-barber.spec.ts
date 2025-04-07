import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryServiceRepository } from '../../../../test/repositories/in-memory-service-repository'
import { makeService } from '../../../../test/factories/make-service'
import { DeleteBarberUseCase } from './delete-barber'
import { InMemoryBarbersRepository } from '../../../../test/repositories/in-memory-barbers-repository'
import { makeBarber } from '../../../../test/factories/make-barber'

let inMemoryBarbersRepository: InMemoryBarbersRepository
let sut: DeleteBarberUseCase

describe("Delete Barber", async () => {
  beforeEach(() => {
    inMemoryBarbersRepository = new InMemoryBarbersRepository()
    sut = new DeleteBarberUseCase(inMemoryBarbersRepository)
  })

  it('should be able to delete a barber', async () => {
    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)

    await sut.execute({
      userId: barber.id.toValue()
    })

    expect(inMemoryBarbersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a inexistent barber', async () => {
    await expect(() => {
      return sut.execute({
        userId: 'inexistent-barber'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

