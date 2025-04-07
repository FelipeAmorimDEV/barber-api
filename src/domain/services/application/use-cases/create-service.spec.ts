import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryServiceRepository } from '../../../../test/repositories/in-memory-service-repository'
import { CreateServiceUseCase } from './create-service'

let InMemoryServicesRepository: InMemoryServiceRepository
let sut: CreateServiceUseCase

describe("Create Service", async () => {
  beforeEach(() => {
    InMemoryServicesRepository = new InMemoryServiceRepository()
    sut = new CreateServiceUseCase(InMemoryServicesRepository)
  })


  it('should be able to create a service', async () => {
    const { service } = await sut.execute({
      name: 'Corte Cabelo',
      duration: 30,
      price: 35
    })

    expect(InMemoryServicesRepository.items[0])
      .toEqual(expect.objectContaining(
        {
          name: 'Corte Cabelo'
        }
      ))
    expect(service.id).toBeTruthy()
  })
})

