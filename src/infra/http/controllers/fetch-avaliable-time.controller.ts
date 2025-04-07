import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Post, Query, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateServiceUseCase } from "@/domain/services/application/use-cases/create-service";
import { FetchAvailableTimeSlotsUseCase } from "@/domain/scheduling/application/use-cases/fetch-available-time-slots";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

const fetchAvaliableTimeBodySchema = z.object({
  barberId: z.string().uuid(),
  duration: z.coerce.number(),
  startDate: z.string().datetime(),
})

type FetchAvaliableTimeBodySchema = z.infer<typeof fetchAvaliableTimeBodySchema>

@Controller('/scheduling/avaliable-time')
export class FetchAvaliableTimeController {
  constructor(private fetchAvaliableTimeSlots: FetchAvailableTimeSlotsUseCase) { }

  @Get()
  @UsePipes(new ZodValidationPipe(fetchAvaliableTimeBodySchema))
  async handle(@Query() query: FetchAvaliableTimeBodySchema) {
    const { barberId, duration, startDate } = query

    const result = await this.fetchAvaliableTimeSlots.execute({
      barberId,
      duration,
      startDate: new Date(startDate)
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException("Error creating account")
      }
    }


    return {
      slots: result.value.slots
    }
  }
}