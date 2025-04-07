import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemorySchedulingRepository } from '../../../../test/repositories/in-memory-scheduling-repository'

import { makeScheduling } from '../../../../test/factories/make-scheduling'
import { FetchAvailableTimeSlotsUseCase } from './fetch-available-time-slots'
import { InMemoryBarbersRepository } from '../../../../test/repositories/in-memory-barbers-repository'
import { makeBarber } from '../../../../test/factories/make-barber'

import { Service } from '../../../services/enterprise/entities/service'
import { InMemoryBarbersBlockTimeRepository } from '../../../../test/repositories/in-memory-barbers-block-time-repository'
import { makeBarberBlockTime } from '../../../../test/factories/make-barber-block-time'

let inMemorySchedulingsRepository: InMemorySchedulingRepository
let inMemoryBarbersRepository: InMemoryBarbersRepository
let inMemoryBarbersBlockTimeRepository: InMemoryBarbersBlockTimeRepository
let sut: FetchAvailableTimeSlotsUseCase

describe("Fetch Available Time Slots", async () => {
  beforeEach(() => {
    inMemorySchedulingsRepository = new InMemorySchedulingRepository()
    inMemoryBarbersRepository = new InMemoryBarbersRepository()
    inMemoryBarbersBlockTimeRepository = new InMemoryBarbersBlockTimeRepository()
    sut = new FetchAvailableTimeSlotsUseCase(inMemorySchedulingsRepository, inMemoryBarbersRepository, inMemoryBarbersBlockTimeRepository)
    vi.useFakeTimers()
  })


  afterEach(() => {
    vi.useRealTimers()
  })


  it('should be able to fetch the available time slots', async () => {
    vi.setSystemTime(new Date(2024,11,13,9,0,0))
    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)

    const availableSlots = await sut.execute({
      barberId: barber.id.toValue(),
      duration: 45,
      startDate: new Date()
    })

    const today = new Date()

    expect(availableSlots[0]).toEqual(
      expect.objectContaining(
        {
          startTime: new Date(today.setUTCHours(12, 0, 0, 0)).toISOString(),
          endTime: new Date(today.setUTCHours(12, 45, 0, 0)).toISOString()
        }
      )
    )
  })


  it('should be able to show only available time slot - scheduling', async () => {
    vi.setSystemTime(new Date(2024,11,13,9,0,0))
    const today = new Date()

    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)

    const scheduling = makeScheduling({
      barberId: barber.id,
      startDate: new Date(2024, 11, 13, 9, 0, 0),
      service: Service.create({ name: 'corte', duration: 45, price: 50 })
    })
    inMemorySchedulingsRepository.create(scheduling)

    const availableSlots = await sut.execute({
      barberId: barber.id.toValue(),
      duration: 45,
      startDate: today
    })

    expect(availableSlots[0]).toEqual(
      expect.objectContaining(
        {
          startTime: new Date(today.setUTCHours(12, 45, 0, 0)).toISOString(),
          endTime: new Date(today.setUTCHours(13, 30, 0, 0)).toISOString()
        }
      )
    )
  })

  it('should be able to show only available time slot - blocktime', async () => {
    vi.setSystemTime(new Date(2024,11,13,9,0,0))
    const today = new Date()

    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)

    const barberBlockTime = makeBarberBlockTime({
      barberId: barber.id,
      startTime: new Date(2024,11,13,9,0,0),
      endTime: new Date(2024,11,13,12,0,0)
    })
    inMemoryBarbersBlockTimeRepository.create(barberBlockTime)

    const availableSlots = await sut.execute({
      barberId: barber.id.toValue(),
      duration: 45,
      startDate: today
    })

    expect(availableSlots[0]).toEqual(
      expect.objectContaining(
        {
          startTime: new Date(today.setUTCHours(15, 0, 0, 0)).toISOString(),
          endTime: new Date(today.setUTCHours(15, 45, 0, 0)).toISOString()
        }
      )
    )
  })


})

