import { Scheduling } from "@/domain/scheduling/enterprise/entities/scheduling"; 
import { SchedulingRepository } from "@/domain/scheduling/application/repositories/scheduling-repository";


export class InMemorySchedulingRepository implements SchedulingRepository {
  public items: Scheduling[] = []

  async fetchManyByCustomerIdOnDate(customerId: string, date: Date) {
    const startOfDay = new Date(date).setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999)

    const schedulings = this.items.filter((item) => {
      return item.customerId.toString() === customerId && item.startDate.getTime() >= startOfDay && item.startDate.getTime() < endOfDay
    })

    return schedulings
  }

  async fetchManyByBarberIdOnDate(barberId: string, date: Date) {
    const startOfDay = new Date(date).setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999)

    const schedulings = this.items.filter((item) => {
      return item.barberId.toString() === barberId && item.startDate.getTime() >= startOfDay && item.startDate.getTime() < endOfDay
    })

    return schedulings
  }

  async findById(id: string) {
    const scheduling = this.items.find((item) => item.id.toString() === id)

    if (!scheduling) {
      return null
    }

    return scheduling
  }

  async create(scheduling: Scheduling) {
    this.items.push(scheduling)
  }

  async save(scheduling: Scheduling) {
    const findIndex = this.items.findIndex((item) => item.id === scheduling.id)
    this.items[findIndex] = scheduling
  }
}