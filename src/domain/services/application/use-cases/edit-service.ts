import { Service } from "../../enterprise/entities/service"

import { ServicesRepository } from "../repositories/service-repository"


interface EditServiceUseCaseRequest {
  serviceId: string
  name: string
  duration: number
  price: number
}

interface EditServiceUseCaseResponse {
  service: Service
}

export class EditServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}
  async execute({ serviceId, name, duration, price }:EditServiceUseCaseRequest): Promise<EditServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      throw new Error('Service not found.')
    }

    service.name = name
    service.duration = duration
    service.price = price

    await this.servicesRepository.save(service)
    
    return { service }
  }
}