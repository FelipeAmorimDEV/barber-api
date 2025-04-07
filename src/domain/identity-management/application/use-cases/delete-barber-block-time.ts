
import { BarberBlockTime } from "../../enterprise/entities/barber-block-time"
import { BarberBlockTimeRepository } from "../repositories/barber-block-time-repository"

interface DeleteBarberBlockTimeUseCaseRequest {
  barberBlockTimeId: string
}

interface DeleteBarberBlockTimeUseCaseResponse {
  barberBlockTime: BarberBlockTime
}

export class DeleteBarberBlockTimeUseCase {
  constructor(private barbersBlockTimeRepository: BarberBlockTimeRepository) {}
  async execute({ barberBlockTimeId }:DeleteBarberBlockTimeUseCaseRequest): Promise<DeleteBarberBlockTimeUseCaseResponse> {
    const barberBlockTime = await this.barbersBlockTimeRepository.findById(barberBlockTimeId)

    if (!barberBlockTime) {
      throw new Error("Barber block time not found.")
    }

    await this.barbersBlockTimeRepository.delete(barberBlockTime)

    return { barberBlockTime }
  }
}