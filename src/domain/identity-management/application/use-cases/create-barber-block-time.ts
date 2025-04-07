import { AbstractInstanceResolver } from "@nestjs/core/injector/abstract-instance-resolver"
import { BarberBlockTime } from "../../enterprise/entities/barber-block-time"
import { BarberBlockTimeRepository } from "../repositories/barber-block-time-repository"
import { BarbersRepository } from "../repositories/barber-repository"
import { Injectable } from "@nestjs/common"
import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"


interface CreateBarberBlockTimeUseCaseRequest {
  barberId: string
  startTime: Date
  endTime: Date
  reason?: string
}

type CreateBarberBlockTimeUseCaseResponse = Either<ResourceNotFoundError, { barberBlockTime: BarberBlockTime }>

@Injectable()
export class CreateBarberBlockTimeUseCase {
  constructor(
    private barbersBlockTimeRepository: BarberBlockTimeRepository, 
    private barbersRepository: BarbersRepository
  ) {}

  async execute({ barberId, startTime, endTime, reason }:CreateBarberBlockTimeUseCaseRequest): Promise<CreateBarberBlockTimeUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId)

    if (!barber) {
      return left(new ResourceNotFoundError())
    }

    const barberBlockTime = BarberBlockTime.create({ barberId: barber.id, startTime, endTime, reason})

    await this.barbersBlockTimeRepository.create(barberBlockTime)

    return right({ barberBlockTime })
  }
}