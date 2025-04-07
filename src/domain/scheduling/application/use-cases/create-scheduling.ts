import { Scheduling } from "../../enterprise/entities/scheduling"
import { Status } from "../../enterprise/entities/value-objects/status"
import { BarberBlockTimeRepository } from "../../../identity-management/application/repositories/barber-block-time-repository"
import { BarbersRepository } from "../../../identity-management/application/repositories/barber-repository"
import { CustomersRepository } from "../../../identity-management/application/repositories/customer-repository"


import { SchedulingRepository } from "../repositories/scheduling-repository"
import { ServicesRepository } from "../../../services/application/repositories/service-repository"
import { Injectable } from "@nestjs/common"
import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"


interface CreateSchedulingUseCaseRequest {
  customerId: string
  barberId: string
  serviceId: string
  startDate: Date
}

type CreateSchedulingUseCaseResponse = Either<ResourceNotFoundError, { scheduling: Scheduling }>

@Injectable()
export class CreateSchedulingUseCase {
  constructor(
    private schedulingsRepository: SchedulingRepository,
    private servicesRepository: ServicesRepository,
    private custumersRepository: CustomersRepository,
    private barbersRepository: BarbersRepository,
    private barbersBlockTimeRepository: BarberBlockTimeRepository,
  ) {}
  async execute({ serviceId, barberId, customerId, startDate}:CreateSchedulingUseCaseRequest): Promise<CreateSchedulingUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)
    if (!service) {
      return left(new ResourceNotFoundError())
    }

    const custumer = await this.custumersRepository.findById(customerId)
    if (!custumer) {
      return left(new ResourceNotFoundError())
    }

    const barber = await this.barbersRepository.findById(barberId)
    if (!barber) {
      return left(new ResourceNotFoundError())
    }

    const schedulings = await this.schedulingsRepository.fetchManyByBarberIdOnDate(barber.id.toString(), startDate)
    const blockTimes = await this.barbersBlockTimeRepository.findManyByBarberIdOnDate(barber.id.toString(), startDate)

    const hasSchedulingConflict = schedulings.some((item) => item.hasSchedulingConflict(startDate, service.duration))
    const hasBlockTimeConflict = blockTimes.some((item) => item.hasBlockTimeConflict(startDate, service.duration))

    if (hasSchedulingConflict || hasBlockTimeConflict) {
      return left(new ResourceNotFoundError())
    }

    const endDate = new Date(startDate.getTime() + service.duration * 60000)

    const scheduling = Scheduling.create(
      { 
        customerId: custumer.id, 
        serviceId: service.id, 
        barberId: barber.id, 
        startDate, 
        status: Status.agendado(),
        endDate
      })

    

      
      await this.schedulingsRepository.create(scheduling)


    return right({ scheduling })
  }
}