import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryServiceRepository } from '../../../../test/repositories/in-memory-service-repository'
import { DeleteServiceUseCase } from './delete-service'
import { makeService } from '../../../../test/factories/make-service'
import { EditServiceUseCase } from './edit-service'

let inMemoryServicesRepository: InMemoryServiceRepository
let sut: EditServiceUseCase

describe("Edit Service", async () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServiceRepository()
    sut = new EditServiceUseCase(inMemoryServicesRepository)
  })

  it('should be able to delete a service', async () => {
    const createdService = makeService()
    inMemoryServicesRepository.create(createdService)

    const { service } = await sut.execute({
      serviceId: createdService.id.toValue(),
      name: 'Corte Cabelo',
      duration: 40,
      price: 50
    })

    expect(service.id).toBeTruthy()
    expect(service).toEqual(expect.objectContaining({
      name: 'Corte Cabelo'
    }))
  })

  it('should not be able to edit a inexistent service', async () => {
    await expect(() => {
      return sut.execute({
        serviceId: 'inexistent-service',
        name: 'Corte Cabelo',
        duration: 40,
        price: 50
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

