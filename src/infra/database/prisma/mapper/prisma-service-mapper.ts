import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Service } from "@/domain/services/enterprise/entities/service"
import { Prisma, Service as PrismaService } from "@prisma/client"

export class PrismaServiceMapper {
  static toDomain(raw: PrismaService) {
    return Service.create({
      name: raw.name,
      duration: raw.duration,
      price: raw.price,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id.toString(),
      name: service.name,
      duration: service.duration,
      price: service.price,
    }
  }
}