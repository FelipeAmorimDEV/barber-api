import { Injectable } from "@nestjs/common"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { CustomerUser } from "../../enterprise/entities/customer"
import { HashGenerator } from "../cryptography/hash-generator"
import { CustomersRepository } from "../repositories/customer-repository"
import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

interface CreateCustomerUseCaseRequest {
  name: string
  email: string
  password: string
  phone: string
  birthDate: string
}


type CreateCustomerUseCaseResponse = Either<NotAllowedError, { customer: CustomerUser }>

@Injectable()
export class CreateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository, private hashGenerator: HashGenerator) {}
  async execute({ name, phone, email, password, birthDate }:CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {

    const customerWithSameEmail = await this.customersRepository.findByEmail(email)

    console.log('CUSTOMER WITH SAME EMAIL', customerWithSameEmail)
    
    if (customerWithSameEmail) {
      return left(new NotAllowedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    
    const customer = CustomerUser.create({ name, phone, email, password: hashedPassword, birthDate: new Date(birthDate) })

   
    await this.customersRepository.create(customer)

    return right({ customer })
  }
}