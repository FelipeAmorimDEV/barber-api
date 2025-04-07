import { UniqueEntityID } from "../../core/entities/unique-entity-id";
import { Scheduling, SchedulingProps } from "../../domain/scheduling/enterprise/entities/scheduling";
import { Status } from "../../domain/scheduling/enterprise/entities/value-objects/status";


export function makeScheduling(override: Partial<SchedulingProps> = {}, id?: UniqueEntityID) {
  const scheduling = Scheduling.create({
    status: Status.agendado(),
    barberId: new UniqueEntityID(),
    customerId: new UniqueEntityID(),
    serviceId: new UniqueEntityID(),
    startDate: new Date(),
    ...override,
  },
    id
  )

  return scheduling
}