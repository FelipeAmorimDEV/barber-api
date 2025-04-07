import { BarberUser } from "../../enterprise/entities/barber";

export abstract class BarbersRepository {
  abstract findByEmail(email: string): Promise<BarberUser | null>
  abstract findById(id: string): Promise<BarberUser | null>
  abstract create(barber: BarberUser): Promise<void>
  abstract delete(barber: BarberUser): Promise<void>
}