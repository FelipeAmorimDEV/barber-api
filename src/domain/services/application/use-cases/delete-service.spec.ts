import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryServiceRepository } from '../../../../test/repositories/in-memory-service-repository'
import { DeleteServiceUseCase } from './delete-service'
import { makeService } from '../../../../test/factories/make-service'

let inMemoryServicesRepository: InMemoryServiceRepository
let sut: DeleteServiceUseCase

describe("Delete Service", async () => {
  beforeEach(() => {
    inMemoryServicesRepository = new InMemoryServiceRepository()
    sut = new DeleteServiceUseCase(inMemoryServicesRepository)
  })

  it('should be able to delete a service', async () => {
    const createdService = makeService()
    inMemoryServicesRepository.create(createdService)

    await sut.execute({
      serviceId: createdService.id.toValue()
    })

    expect(inMemoryServicesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a inexistent service', async () => {
    await expect(() => {
      return sut.execute({
        serviceId: 'inexistent-service'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

