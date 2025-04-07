import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { BarberUser } from "../../enterprise/entities/barber"
import { BarbersRepository } from "../repositories/barber-repository"


interface CreateBarberUseCaseRequest {
  name: string
  email: string
  password: string
  expertise: string
  bio: string
}

interface CreateBarberUseCaseResponse {
  barber: BarberUser
}

export class CreateBarberUseCase {
  constructor(private barbersRepository: BarbersRepository) {}
  async execute({ bio, name, expertise, email, password}:CreateBarberUseCaseRequest): Promise<CreateBarberUseCaseResponse> {
    const barber = BarberUser.create({ name, expertise, email, password, bio })

    await this.barbersRepository.create(barber)

    return { barber }
  }
}