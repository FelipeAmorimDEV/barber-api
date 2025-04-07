import { Scheduling } from "../../enterprise/entities/scheduling"
import { Status } from "../../enterprise/entities/value-objects/status"
import { SchedulingRepository } from "../repositories/scheduling-repository"


interface CancelSchedulingUseCaseRequest {
  schedulingId: string
  userId: string
}

interface CancelSchedulingUseCaseResponse {
  scheduling: Scheduling
}

export class CancelSchedulingUseCase {
  constructor(
    private schedulingsRepository: SchedulingRepository,
  ) {}
  
  async execute({ schedulingId, userId}:CancelSchedulingUseCaseRequest): Promise<CancelSchedulingUseCaseResponse> {
    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      throw new Error('Scheduling not found.')
    }
  
    if (!scheduling.canBeCanceledBy(userId)) {
      throw Error('Not allowed.')
    }

    const currentDate = new Date()
    if (scheduling.isTooLateToCancel(currentDate)) {
      scheduling.status = Status.desistencia()
      scheduling.isLateCancellation = true
    } else {
      scheduling.status = Status.cancelado()
      scheduling.isLateCancellation = false
    }

    this.schedulingsRepository.save(scheduling)

    return { scheduling }
  }
}