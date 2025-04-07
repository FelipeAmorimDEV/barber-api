import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryServiceRepository } from '../../../../test/repositories/in-memory-service-repository'
import { InMemoryBarbersRepository } from '../../../../test/repositories/in-memory-barbers-repository'
import { InMemoryCustumersRepository } from '../../../../test/repositories/in-memory-custumers-repository'
import { CreateSchedulingUseCase } from './create-scheduling'
import { InMemorySchedulingRepository } from '../../../../test/repositories/in-memory-scheduling-repository'
import { makeCustomer } from '../../../../test/factories/make-customer'
import { makeBarber } from '../../../../test/factories/make-barber'
import { makeService } from '../../../../test/factories/make-service'
import { InMemoryBarbersBlockTimeRepository } from '../../../../test/repositories/in-memory-barbers-block-time-repository'
import { makeBarberBlockTime } from '../../../../test/factories/make-barber-block-time'
import { InMemoryTabsRepository } from '../../../../test/repositories/in-memory-tabs-repository'
import { makeScheduling } from '../../../../test/factories/make-scheduling'
import { InMemoryItemsRepository } from '../../../../test/repositories/in-memory-items-repository'

let inMemoryServicesRepository: InMemoryServiceRepository
let inMemoryBarbersRepository: InMemoryBarbersRepository
let inMemoryCustomersRepository: InMemoryCustumersRepository
let inMemorySchedulingsRepository: InMemorySchedulingRepository
let inMemoryBarbersBlockTimeRepository: InMemoryBarbersBlockTimeRepository
let inMemoryTabsRepository: InMemoryTabsRepository
let inMemoryItemsRepository: InMemoryItemsRepository


let sut: CreateSchedulingUseCase

describe("Create Scheduling", async () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServiceRepository()
    inMemoryTabsRepository = new InMemoryTabsRepository()
    inMemoryBarbersRepository = new InMemoryBarbersRepository()
    inMemoryCustomersRepository = new InMemoryCustumersRepository()
    inMemorySchedulingsRepository = new InMemorySchedulingRepository()
    inMemoryBarbersBlockTimeRepository = new InMemoryBarbersBlockTimeRepository()
    inMemoryItemsRepository = new InMemoryItemsRepository()
    sut = new CreateSchedulingUseCase(inMemorySchedulingsRepository,inMemoryServicesRepository, inMemoryCustomersRepository, inMemoryBarbersRepository, inMemoryBarbersBlockTimeRepository, inMemoryTabsRepository, inMemoryItemsRepository)
  })


  it('should be able to create a scheduling', async () => {
    const customer = makeCustomer()
    inMemoryCustomersRepository.create(customer)
    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)
    const service = makeService()
    inMemoryServicesRepository.create(service)

    const { scheduling } = await sut.execute({
     customerId: customer.id.toValue(),
     barberId: barber.id.toValue(),
     serviceId: service.id.toValue(),
     startDate: new Date(2024,11,10,10,0,0)
    })

    expect(scheduling.id).toBeTruthy()
    expect(scheduling.status.toValue()).toEqual('agendado')
  })

  it('should not be able to create a scheduling with conflict date', async () => {
    const customer = makeCustomer()
    inMemoryCustomersRepository.create(customer)
    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)
    const service = makeService()
    inMemoryServicesRepository.create(service)

    await sut.execute({
     customerId: customer.id.toValue(),
     barberId: barber.id.toValue(),
     serviceId: service.id.toValue(),
     startDate: new Date(2024,11,10,10,0,0)
    })

    await expect(() => {
      return sut.execute({
        customerId: customer.id.toValue(),
        barberId: barber.id.toValue(),
        serviceId: service.id.toValue(),
        startDate: new Date(2024,11,10,10,40,0)
       })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a scheduling on blocked date', async () => {
    const customer = makeCustomer()
    inMemoryCustomersRepository.create(customer)
    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)
    const service = makeService()
    inMemoryServicesRepository.create(service)

    const blockTime = makeBarberBlockTime({
      barberId: barber.id,
      startTime: new Date(2024,11,10,9,0,0),
      endTime: new Date(2024,11,10,12,0,0),
    })

    inMemoryBarbersBlockTimeRepository.create(blockTime)

    await expect(() => {
      return sut.execute({
        customerId: customer.id.toValue(),
        barberId: barber.id.toValue(),
        serviceId: service.id.toValue(),
        startDate: new Date(2024,11,10,9,0,0)
       })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to create a tab after create a scheduling', async () => {
    const customer = makeCustomer()
    inMemoryCustomersRepository.create(customer)
    const barber = makeBarber()
    inMemoryBarbersRepository.create(barber)
    const service = makeService()
    inMemoryServicesRepository.create(service)

    const { scheduling } = await sut.execute({
      customerId: customer.id.toValue(),
      barberId: barber.id.toValue(),
      serviceId: service.id.toValue(),
      startDate: new Date(2024,11,10,9,0,0)
     })


     expect(inMemoryTabsRepository.items[0].id).toBeTruthy()
     expect(inMemoryTabsRepository.items[0].schedulingId).toEqual(scheduling.id)
     expect(inMemoryItemsRepository.items[0]).toEqual(expect.objectContaining({
      name: service.name
     }))
  })
})

