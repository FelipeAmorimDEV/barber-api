import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { PrismaService } from "../database/prisma/prisma.service";
import { DatabaseModule } from "../database/database.module";
import { CreateCustomerUseCase } from "@/domain/identity-management/application/use-cases/create-customer";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateServiceController } from "./controllers/create-service.controller";
import { CreateServiceUseCase } from "@/domain/services/application/use-cases/create-service";
import { FetchAvailableTimeSlotsUseCase } from "@/domain/scheduling/application/use-cases/fetch-available-time-slots";
import { FetchAvaliableTimeController } from "./controllers/fetch-avaliable-time.controller";
import { CreateSchedulingController } from "./controllers/create-scheduling.controller";
import { CreateSchedulingUseCase } from "@/domain/scheduling/application/use-cases/create-scheduling";
import { CreateBarberBlockTimeController } from "./controllers/create-barber-block-time.controller";
import { CreateBarberBlockTimeUseCase } from "@/domain/identity-management/application/use-cases/create-barber-block-time";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateServiceController,
    FetchAvaliableTimeController,
    CreateSchedulingController,
    CreateBarberBlockTimeController
  ],
  providers: [
    CreateCustomerUseCase,
    CreateServiceUseCase,
    FetchAvailableTimeSlotsUseCase,
    CreateSchedulingUseCase,
    CreateBarberBlockTimeUseCase
  ]
})
export class HttpModule {}