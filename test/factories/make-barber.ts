import { UniqueEntityID } from "../../core/entities/unique-entity-id";
import { BarberUser, BarberUserProps } from "../../domain/person/enterprise/entities//barber";
import { faker } from '@faker-js/faker'


export function makeBarber(override: Partial<BarberUserProps> = {}, id?: UniqueEntityID) {
  const barber = BarberUser.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.lorem.word(),
    expertise: faker.lorem.word(),
    userId: new UniqueEntityID(),
    ...override,
  },
    id
  )

  return barber
}