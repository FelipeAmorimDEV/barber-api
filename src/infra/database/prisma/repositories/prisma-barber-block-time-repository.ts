import { BarberBlockTimeRepository } from "@/domain/identity-management/application/repositories/barber-block-time-repository";
import { BarberBlockTime } from "@/domain/identity-management/enterprise/entities/barber-block-time";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import dayjs from "dayjs";
import { PrismaBarberBlockTimeMapper } from "../mapper/prisma-barber-block-time-mapper";

@Injectable()
export class PrismaBarbersBlockTimeRepository implements BarberBlockTimeRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<BarberBlockTime | null> {
    const barberBlockTime = await this.prisma.barberBlockTime.findUnique({
      where: {
        id,
      },
    })

    if (!barberBlockTime) {
      return null
    }

    return PrismaBarberBlockTimeMapper.toDomain(barberBlockTime)
  }
  async findManyByBarberIdOnDate(barberId: string, date: Date): Promise<BarberBlockTime[]> {
    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();

    const blockTimes = await this.prisma.barberBlockTime.findMany({
      where: {
        barberId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return blockTimes.map(PrismaBarberBlockTimeMapper.toDomain)
  }
  async create(blockedTime: BarberBlockTime): Promise<void> {
    const data = PrismaBarberBlockTimeMapper.toPrisma(blockedTime)
    await this.prisma.barberBlockTime.create({
      data,
    })
  }
  async delete(blockedTime: BarberBlockTime): Promise<void> {
    const data = PrismaBarberBlockTimeMapper.toPrisma(blockedTime)
    await this.prisma.barberBlockTime.delete({
      where: {
        id: data.id,
      },
    })
  }
}