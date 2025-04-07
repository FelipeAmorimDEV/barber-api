import { beforeEach, describe, expect, it } from 'vitest'

import { CreateBarberBlockTimeUseCase } from './create-barber-block-time'
import { InMemoryBarbersBlockTimeRepository } from '../../../../test/repositories/in-memory-barbers-block-time-repository'
import { InMemoryBarbersRepository } from '../../../../test/repositories/in-memory-barbers-repository'
import { makeBarber } from '../../../../test/factories/make-barber'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryBarbersBlockTimeRepository: InMemoryBarbersBlockTimeRepository
let inMemoryBarbersRepository: InMemoryBarbersRepository

let sut: CreateBarberBlockTimeUseCase

describe("Create Barber Block Time", async () => {
  beforeEach(() => {
    inMemoryBarbersBlockTimeRepository = new InMemoryBarbersBlockTimeRepository()
    inMemoryBarbersRepository = new InMemoryBarbersRepository()
    sut = new CreateBarberBlockTimeUseCase(inMemoryBarbersBlockTimeRepository, inMemoryBarbersRepository)
  })


  it('should be able to create a barber block time', async () => {
    const barber = makeBarber({}, new UniqueEntityID('barber-1'))
    inMemoryBarbersRepository.create(barber)

    const { barberBlockTime } = await sut.execute({
      barberId: barber.id.toValue(),
      startTime: new Date(2024, 11, 13, 10, 0, 0),
      endTime: new Date(2024, 11, 13, 13, 0, 0),
      reason: 'Consulta medica'
    })

    expect(barberBlockTime.id).toBeTruthy()
    expect(inMemoryBarbersBlockTimeRepository.items[0]).toEqual(expect.objectContaining({
      reason: 'Consulta medica'
    }))
  })
})

