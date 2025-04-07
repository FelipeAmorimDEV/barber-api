import { ServicesRepository } from "@/domain/services/application/repositories/service-repository";
import { Service } from "@/domain/services/enterprise/entities/service";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaServiceMapper } from "../mapper/prisma-service-mapper";

@Injectable()
export class PrismaServiceRepository implements ServicesRepository {
  constructor(private prisma: PrismaService) { }
  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        id
      }
    })

    if (!service) {
      return null
    }

    return PrismaServiceMapper.toDomain(service)
  }
  async create(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)
    await this.prisma.service.create({
      data
    })
  }
  async delete(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)
    await this.prisma.service.delete({
      where: {
        id: data.id
      }
    })
  }
  async save(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)
    await this.prisma.service.update({
      where: {
        id: data.id
      },
      data
    })
  }

}