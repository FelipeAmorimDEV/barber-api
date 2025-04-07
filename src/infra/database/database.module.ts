import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CustomersRepository } from "@/domain/identity-management/application/repositories/customer-repository";
import { PrismaCustomersRepository } from "./prisma/repositories/prisma-customer-repository";
import { BarbersRepository } from "@/domain/identity-management/application/repositories/barber-repository";
import { PrismaBarbersRepository } from "./prisma/repositories/prisma-barbers-repository";
import { ServicesRepository } from "@/domain/services/application/repositories/service-repository";
import { PrismaServiceRepository } from "./prisma/repositories/prisma-service-repository";
import { BarberBlockTimeRepository } from "@/domain/identity-management/application/repositories/barber-block-time-repository";
import { PrismaBarbersBlockTimeRepository } from "./prisma/repositories/prisma-barber-block-time-repository";
import { SchedulingRepository } from "@/domain/scheduling/application/repositories/scheduling-repository";
import { PrismaSchedulingRepository } from "./prisma/repositories/prisma-scheduling-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository
    },
    {
      provide: BarbersRepository,
      useClass: PrismaBarbersRepository
    },
    {
      provide: ServicesRepository,
      useClass: PrismaServiceRepository
    },
    {
      provide: BarberBlockTimeRepository,
      useClass: PrismaBarbersBlockTimeRepository
    },
    {
      provide: SchedulingRepository,
      useClass: PrismaSchedulingRepository
    }
  ],
  exports: [
    PrismaService,
    CustomersRepository,
    BarbersRepository,
    ServicesRepository,
    BarberBlockTimeRepository,
    SchedulingRepository
  ],
})
export class DatabaseModule { }