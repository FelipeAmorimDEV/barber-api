import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { CustomerUser } from "@/domain/identity-management/enterprise/entities/customer"
import { Prisma, User as PrismaUser, Customer as PrismaCustomer } from "@prisma/client"
type Customer = PrismaUser & {
  customer: PrismaCustomer | null
}
export class PrismaCustomerMapper {
  static toDomain(raw: Customer) {
    return CustomerUser.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      phone: raw.customer?.phone ?? null,
      birthDate: raw.customer?.birthDate ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(customer: CustomerUser): Prisma.CustomerUncheckedCreateInput & Prisma.UserUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      password: customer.password,
      phone: customer.phone!,
      birthDate: customer.birthDate!,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      customerId: customer.id.toString(),
    }
  }
}