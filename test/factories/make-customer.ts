import { UniqueEntityID } from "../../core/entities/unique-entity-id";
import { faker } from '@faker-js/faker'
import { CustomerUser, CustomerUserProps } from "../../domain/person/enterprise/entities/customer";


export function makeCustomer(override: Partial<CustomerUserProps> = {}, id?: UniqueEntityID) {
  const customer = CustomerUser.create({
    email: faker.internet.email(),
    password: faker.lorem.word(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    userId: new UniqueEntityID(),
    ...override,
  },
    id
  )

  return customer
}