import { Either, right } from "@/core/either"
import { Service } from "../../enterprise/entities/service"

import { ServicesRepository } from "../repositories/service-repository"
import { Injectable } from "@nestjs/common"


interface CreateServiceUseCaseRequest {
  name: string
  duration: number
  price: number
}

type CreateServiceUseCaseResponse = Either<null, { service: Service }>

@Injectable()
export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}
  async execute({ name, duration, price}:CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({ name, duration, price })

    await this.servicesRepository.create(service)

    return right({ service })
  }
}