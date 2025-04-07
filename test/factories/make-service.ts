import { UniqueEntityID } from "../../core/entities/unique-entity-id";
import { faker } from '@faker-js/faker'
import { Service, ServiceProps } from "../../domain/services/enterprise/entities/service";


export function makeService(override: Partial<ServiceProps> = {}, id?: UniqueEntityID) {
  const service = Service.create({
    name: faker.lorem.word(),
    duration: 45,
    price: 55,
    ...override,
  },
    id
  )

  return service
}