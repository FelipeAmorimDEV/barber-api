import { Service } from "../../enterprise/entities/service"

import { ServicesRepository } from "../repositories/service-repository"


interface DeleteServiceUseCaseRequest {
  serviceId: string
}

interface DeleteServiceUseCaseResponse {
  service: Service
}

export class DeleteServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}
  async execute({ serviceId }:DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      throw new Error('Service not found.')
    }

    await this.servicesRepository.delete(service)
    
    return { service }
  }
}