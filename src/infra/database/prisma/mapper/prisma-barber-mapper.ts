import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BarberUser } from "@/domain/identity-management/enterprise/entities/barber"
import { CustomerUser } from "@/domain/identity-management/enterprise/entities/customer"
import { Prisma, User as PrismaUser, Barber as PrismaBarber } from "@prisma/client"
type Barber = PrismaUser & {
  barber: PrismaBarber | null
}
export class PrismaBarberMapper {
  static toDomain(raw: Barber) {
    return BarberUser.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      bio: raw.barber?.bio ?? null,
      expertise: raw.barber?.expertise ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(barber: BarberUser): Prisma.BarberUncheckedCreateInput & Prisma.UserUncheckedCreateInput {
    return {
      id: barber.id.toString(),
      name: barber.name,
      email: barber.email,
      password: barber.password,
      bio: barber.bio!,
      expertise: barber.expertise!,
      createdAt: barber.createdAt,
      updatedAt: barber.updatedAt,
      barberId: barber.id.toString(),
    }
  }
}