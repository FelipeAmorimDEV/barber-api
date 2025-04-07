import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCustumersRepository } from '../../../../test/repositories/in-memory-custumers-repository'
import { makeCustomer } from '../../../../test/factories/make-customer'
import { DeleteCustomerUseCase } from './delete-customer'

let inMemoryCustumersRepository: InMemoryCustumersRepository
let sut: DeleteCustomerUseCase

describe("Delete Customer", async () => {
  beforeEach(() => {
    inMemoryCustumersRepository = new InMemoryCustumersRepository()
    sut = new DeleteCustomerUseCase(inMemoryCustumersRepository)
  })

  it('should be able to delete a barber', async () => {
    const customer = makeCustomer()
    inMemoryCustumersRepository.create(customer)

    await sut.execute({
      userId: customer.id.toValue()
    })

    expect(inMemoryCustumersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a inexistent customer', async () => {
    await expect(() => {
      return sut.execute({
        userId: 'inexistent-barber'
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

