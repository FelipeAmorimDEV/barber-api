import { BarbersRepository } from "@/domain/identity-management/application/repositories/barber-repository";
import { BarberUser } from "@/domain/identity-management/enterprise/entities/barber";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaBarberMapper } from "../mapper/prisma-barber-mapper";

@Injectable()
export class PrismaBarbersRepository implements BarbersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<BarberUser | null> {
    const barber = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        barber: true
      }
    })

    if (!barber) {
      return null
    }

    return PrismaBarberMapper.toDomain(barber)
  }
  async findByEmail(email: string): Promise<BarberUser | null> {
    const barber = await this.prisma.user.findFirst({
      where: {
        email
      },
      include: {
        barber: true
      }
    })

    if (!barber) {
      return null
    }

    return PrismaBarberMapper.toDomain(barber)
  }

  async create(barber: BarberUser): Promise<void> {
    const data = PrismaBarberMapper.toPrisma(barber)
    await this.prisma.user.create({
      data
    })
  }
  async delete(barber: BarberUser): Promise<void> {
    const data = PrismaBarberMapper.toPrisma(barber)
    await this.prisma.user.delete({
      where: {
        id: data.id
      }
    })
  }

}