import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BarberBlockTime } from "@/domain/identity-management/enterprise/entities/barber-block-time"
import { Scheduling } from "@/domain/scheduling/enterprise/entities/scheduling"
import { Status } from "@/domain/scheduling/enterprise/entities/value-objects/status"
import { Service } from "@/domain/services/enterprise/entities/service"
import { Prisma, Scheduling as PrismaScheduling } from "@prisma/client"

export class PrismaSchedulingMapper {
  static toDomain(raw: PrismaScheduling) {
    return Scheduling.create({
      barberId:  new UniqueEntityID(raw.barberId),
      customerId: new UniqueEntityID(raw.customerId),
      serviceId: new UniqueEntityID(raw.serviceId),
      startDate: raw.startDate,
      endDate: raw.endDate,
      createdAt: raw.createdAt,
      status: new Status(raw.status),
      isLateCancellation: raw.isLateCancellation,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(scheduling: Scheduling): Prisma.SchedulingUncheckedCreateInput {
    return {
      id: scheduling.id.toString(),
      barberId: scheduling.barberId.toString(),
      customerId: scheduling.customerId.toString(),
      startDate: scheduling.startDate,
      endDate: scheduling.endDate,
      serviceId: scheduling.serviceId.toString(),
      status: scheduling.status.toValue(),
      createdAt: scheduling.createdAt,
      updatedAt: scheduling.updatedAt,
      isLateCancellation: scheduling.isLateCancellation,
    }
  }
}