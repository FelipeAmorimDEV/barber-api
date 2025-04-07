import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryBarbersBlockTimeRepository } from '../../../../test/repositories/in-memory-barbers-block-time-repository'
import { DeleteBarberBlockTimeUseCase } from './delete-barber-block-time'
import { BarberBlockTime } from '../../enterprise/entities/barber-block-time'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryBarbersBlockTimeRepository: InMemoryBarbersBlockTimeRepository
let sut: DeleteBarberBlockTimeUseCase

describe("Delete Barber Block Time", async () => {
  beforeEach(() => {
    inMemoryBarbersBlockTimeRepository = new InMemoryBarbersBlockTimeRepository()
    sut = new DeleteBarberBlockTimeUseCase(inMemoryBarbersBlockTimeRepository)
  })


  it('should be able to delete a barber block time', async () => {
    const barberBlockTime = BarberBlockTime.create({
      barberId: new UniqueEntityID('barber-1'),
      startTime: new Date(2024,11,13,9,0,0),
      endTime: new Date(2024,11,13,11,0,0)
    })

    inMemoryBarbersBlockTimeRepository.create(barberBlockTime)

    await sut.execute({
     barberBlockTimeId: barberBlockTime.id.toValue()
    })

    expect(inMemoryBarbersBlockTimeRepository.items).toHaveLength(0)
  })
})

