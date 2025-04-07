import { Scheduling } from "../../enterprise/entities/scheduling";


export abstract class SchedulingRepository {
  abstract fetchManyByCustomerIdOnDate(customerId: string, date: Date): Promise<Scheduling[]>
  abstract fetchManyByBarberIdOnDate(barberId: string, date: Date): Promise<Scheduling[]>
  abstract findById(id: string): Promise<Scheduling | null>
  abstract create(scheduling: Scheduling): Promise<void>
  abstract save(scheduling: Scheduling): Promise<void>
}