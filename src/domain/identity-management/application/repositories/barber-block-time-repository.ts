import { BarberBlockTime } from "../../enterprise/entities/barber-block-time";

export abstract class BarberBlockTimeRepository {
  abstract findById(id: string): Promise<BarberBlockTime | null>
  abstract findManyByBarberIdOnDate(barberId: string, date: Date): Promise<BarberBlockTime[]>
  abstract create(blockedTime: BarberBlockTime): Promise<void>
  abstract delete(blockedTime: BarberBlockTime): Promise<void>
}