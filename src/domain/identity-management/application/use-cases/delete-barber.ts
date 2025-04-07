import { BarbersRepository } from "../repositories/barber-repository"


interface DeleteBarberUseCaseRequest {
  barberId: string
}

interface DeleteBarberUseCaseResponse { }

export class DeleteBarberUseCase {
  constructor(private barbersRepository: BarbersRepository) {}
  async execute({ barberId }:DeleteBarberUseCaseRequest): Promise<DeleteBarberUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId)

    if (!barber) {
      throw new Error('Barber not found.')
    }

    await this.barbersRepository.delete(barber)
    
    return { }
  }
}