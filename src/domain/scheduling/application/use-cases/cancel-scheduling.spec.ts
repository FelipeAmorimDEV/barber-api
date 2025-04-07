import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemorySchedulingRepository } from '../../../../test/repositories/in-memory-scheduling-repository'

import { makeScheduling } from '../../../../test/factories/make-scheduling'
import { CancelSchedulingUseCase } from './cancel-scheduling'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemorySchedulingsRepository: InMemorySchedulingRepository
let sut: CancelSchedulingUseCase

describe("Cancel Scheduling", async () => {
  beforeEach(() => {
    inMemorySchedulingsRepository = new InMemorySchedulingRepository()
    sut = new CancelSchedulingUseCase(inMemorySchedulingsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })


  it('should be able to cancel a scheduling', async () => {
    
    const schedulingCreated = makeScheduling({
      customerId: new UniqueEntityID('customer-1'),
      startDate: new Date(2024,11,15,10,0,0)
    })
    inMemorySchedulingsRepository.create(schedulingCreated)

    vi.setSystemTime(new Date(2024,11,15,8,0,0))
    const { scheduling } = await sut.execute({
      schedulingId: schedulingCreated.id.toValue(),
      userId: 'customer-1'
    })

    expect(scheduling).toEqual(expect.objectContaining({
      status: { value: 'cancelado' }
    }))
  })

  it('Should not be able to cancel a scheduling less than two hours before.', async () => {
    const schedulingCreated = makeScheduling({
      customerId: new UniqueEntityID('customer-1'),
      startDate: new Date(2024,11,15,10,0,0)
    })
    inMemorySchedulingsRepository.create(schedulingCreated)

    vi.setSystemTime(new Date(2024,11,15,10,0,0))
    const { scheduling } = await sut.execute({
      schedulingId: schedulingCreated.id.toValue(),
      userId: 'customer-1'
    })

    expect(scheduling).toEqual(expect.objectContaining({
      status: { value: 'desistencia' }
    }))
    expect(scheduling.isTooLateToCancel).toBeTruthy()
  })
})

