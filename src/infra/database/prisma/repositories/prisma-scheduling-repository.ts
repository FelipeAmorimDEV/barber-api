import { SchedulingRepository } from "@/domain/scheduling/application/repositories/scheduling-repository";
import { Scheduling } from "@/domain/scheduling/enterprise/entities/scheduling";
import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import { PrismaService } from "../prisma.service";
import { PrismaSchedulingMapper } from "../mapper/prisma-scheduling-mapper";

@Injectable()
export class PrismaSchedulingRepository implements SchedulingRepository {
  constructor(private prisma: PrismaService) {}

  async fetchManyByCustomerIdOnDate(customerId: string, date: Date): Promise<Scheduling[]> {
  const startOfDay = dayjs(date).startOf('day').toDate()
  const endOfDay = dayjs(date).endOf('day').toDate()

  const schedulings = await this.prisma.scheduling.findMany({
    where: {
      customerId,
      startDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  return schedulings.map(PrismaSchedulingMapper.toDomain)
  }
  async fetchManyByBarberIdOnDate(barberId: string, date: Date): Promise<Scheduling[]> {
    const startOfDay = dayjs(date).startOf('day').toDate()
  const endOfDay = dayjs(date).endOf('day').toDate()

  const schedulings = await this.prisma.scheduling.findMany({
    where: {
      barberId,
      startDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  return schedulings.map(PrismaSchedulingMapper.toDomain)
  }
  async findById(id: string): Promise<Scheduling | null> {
    const scheduling = await this.prisma.scheduling.findUnique({
      where: {
        id,
      },
    })

    if (!scheduling) {
      return null
    }

    return PrismaSchedulingMapper.toDomain(scheduling)
  }
  async create(scheduling: Scheduling): Promise<void> {
    const data = PrismaSchedulingMapper.toPrisma(scheduling)
    await this.prisma.scheduling.create({
      data,
    })
  }
  async save(scheduling: Scheduling): Promise<void> {
    const data = PrismaSchedulingMapper.toPrisma(scheduling)
    await this.prisma.scheduling.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

}