import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateServiceUseCase } from "@/domain/services/application/use-cases/create-service";

const createServiceBodySchema = z.object({
  name: z.string(),
  duration: z.coerce.number(),
  price: z.coerce.number(),
})

type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>

@Controller('/services')
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createServiceBodySchema))
  async handle(@Body() body: CreateServiceBodySchema) {
    const { name, duration, price } = body

    const result = await this.createService.execute({
      name,
      duration,
      price
    })

    if (result.isLeft()) {
      throw new BadRequestException("Error creating account")
    }


    return {
      message: 'Service created successfully'
    }
  }
}