import { CustomersRepository } from "@/domain/identity-management/application/repositories/customer-repository";
import { CustomerUser } from "@/domain/identity-management/enterprise/entities/customer";
import { PrismaService } from "../prisma.service";
import { PrismaCustomerMapper } from "../mapper/prisma-customer-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string): Promise<CustomerUser | null> {
    const customer = await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        customer: true,
      },
    })
    
    if (!customer) {
      return null
    }
  
    return PrismaCustomerMapper.toDomain(customer)
  }
  async findById(id: string): Promise<CustomerUser | null> {
    const customer = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    })

    if (!customer) {
      return null
    }
  
    return PrismaCustomerMapper.toDomain(customer)
  }
  async create(customer: CustomerUser): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    const user = await this.prisma.user.create({
     data: {
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
     }
    })

    await this.prisma.customer.create({
      data: {
        phone: data.phone,
        birthDate: data.birthDate,
        customerId: user.id,
      },
    })
  }
  async delete(customer: CustomerUser): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)
    await this.prisma.customer.delete({
      where: {
        customerId: data.customerId,
      },
    })
    await this.prisma.user.delete({
      where: {
        email: data.email,
      },
    })
  }

}