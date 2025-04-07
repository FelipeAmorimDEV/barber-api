import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BarberBlockTime } from "@/domain/identity-management/enterprise/entities/barber-block-time"
import { Service } from "@/domain/services/enterprise/entities/service"
import { Prisma, BarberBlockTime as PrismaBarberBlockTime } from "@prisma/client"

export class PrismaBarberBlockTimeMapper {
  static toDomain(raw: PrismaBarberBlockTime) {
    return BarberBlockTime.create({
      barberId: new UniqueEntityID(raw.barberId),
      startTime: raw.startTime,
      endTime: raw.endTime,
      createdAt: raw.createdAt,
      reason:  raw.reason,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(barberBlockTime: BarberBlockTime): Prisma.BarberBlockTimeUncheckedCreateInput {
    return {
      id: barberBlockTime.id.toString(),
      barberId: barberBlockTime.barberId.toString(),
      startTime: barberBlockTime.startTime,
      endTime: barberBlockTime.endTime,
      createdAt: barberBlockTime.createdAt,
      reason: barberBlockTime.reason,
      
    }
  }
}