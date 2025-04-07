import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { hash } from "bcryptjs"
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateCustomerUseCase } from "@/domain/identity-management/application/use-cases/create-customer";
import { b } from "vitest/dist/chunks/suite.B2jumIFP";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  birthDate: z.string().datetime()
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createCustomer: CreateCustomerUseCase){}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, phone, birthDate } = body

  const result = await this.createCustomer.execute({
      name,
      email,
      password,
      birthDate,
      phone
    })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case NotAllowedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      message: 'Account created successfully'
    }
  }
}