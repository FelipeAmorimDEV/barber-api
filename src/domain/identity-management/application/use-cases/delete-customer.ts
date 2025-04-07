import { CustomersRepository } from "../repositories/customer-repository"

interface DeleteCustomerUseCaseRequest {
  customerId: string
}

interface DeleteCustomerUseCaseResponse { }

export class DeleteCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}
  async execute({ customerId }:DeleteCustomerUseCaseRequest): Promise<DeleteCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      throw new Error('Customer not found.')
    }

    await this.customersRepository.delete(customer)
    
    return { }
  }
}