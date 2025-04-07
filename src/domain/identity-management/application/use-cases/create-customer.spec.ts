import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCustumersRepository } from '../../../../test/repositories/in-memory-custumers-repository'

import { CreateCustomerUseCase } from './create-customer'

let inMemoryCustumersRepository: InMemoryCustumersRepository
let sut: CreateCustomerUseCase

describe("Create Custumer", async () => {
  beforeEach(() => {
    inMemoryCustumersRepository = new InMemoryCustumersRepository()
    sut = new CreateCustomerUseCase(inMemoryCustumersRepository)
  })


  it('create a customer', async () => {
    const { customer } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      userId: 'user-1',
      name: 'John Doe',
      phone: '87988052039'
    })

    expect(customer.userId.toValue()).toEqual('user-1')
    expect(customer.id).toBeTruthy()
    expect(customer.role).toEqual('customer')

  })
})

