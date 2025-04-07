import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateSchedulingUseCase } from "@/domain/scheduling/application/use-cases/create-scheduling";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

const createSchedulingBodySchema = z.object({
  barberId: z.string().uuid(),
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  startDate: z.string().datetime(),
})

type CreateSchedulingBodySchema = z.infer<typeof createSchedulingBodySchema>

@Controller('/scheduling')
export class CreateSchedulingController {
  constructor(private createScheduling: CreateSchedulingUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createSchedulingBodySchema))
  async handle(@Body() body: CreateSchedulingBodySchema) {
    const { barberId, customerId, serviceId, startDate } = body

    const result = await this.createScheduling.execute({
      barberId,
      customerId,
      serviceId,
      startDate: new Date(startDate)
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
      message: 'Scheduling created successfully'
    }
  }
}