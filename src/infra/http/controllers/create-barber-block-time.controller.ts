import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateSchedulingUseCase } from "@/domain/scheduling/application/use-cases/create-scheduling";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CreateBarberBlockTimeUseCase } from "@/domain/identity-management/application/use-cases/create-barber-block-time";

const createBarberBlockTimeBodySchema = z.object({
  barberId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().optional(),
})

type CreateBarberBlockTimeBodySchema = z.infer<typeof createBarberBlockTimeBodySchema>

@Controller('barbers/block-time')
export class CreateBarberBlockTimeController {
  constructor(private createBarberBlockTime: CreateBarberBlockTimeUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBarberBlockTimeBodySchema))
  async handle(@Body() body: CreateBarberBlockTimeBodySchema) {
    const { barberId, startTime, endTime, reason } = body

    const result = await this.createBarberBlockTime.execute({
      barberId,
      endTime: new Date(endTime),
      startTime: new Date(startTime),
      reason
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
     
    }

    return {
      message: 'Barber block time created successfully'
    }
  }
}