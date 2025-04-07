import { BarberBlockTime } from "@/domain/identity-management/enterprise/entities/barber-block-time"; 
import { BarberBlockTimeRepository } from "@/domain/identity-management/application/repositories/barber-block-time-repository"; 

import dayjs from 'dayjs'

export class InMemoryBarbersBlockTimeRepository implements BarberBlockTimeRepository {
  public items: BarberBlockTime[] = [] 
  
  async findById(id: string) {
    const barberBlockTime = this.items.find((item) => item.id.toString() === id)

    if (!barberBlockTime) {
      return null
    }

    return barberBlockTime
  }

  async findManyByBarberIdOnDate(barberId: string, date: Date) {
    const blockTimes = this.items.filter((item) => {
      const startOfDay = dayjs(date).startOf('date').toDate().getTime()
      const endOfDay = dayjs(date).endOf('date').toDate().getTime()

      const isSameBarber = item.barberId.toString() === barberId
      const isSameDate = item.startTime.getTime() >= startOfDay && item.startTime.getTime() <= endOfDay

      return isSameBarber && isSameDate
    })

    return blockTimes
  }

  async create(blockedTime: BarberBlockTime) {
    this.items.push(blockedTime)
  }

  async delete(blockedTime: BarberBlockTime) {
    const itemIndex = this.items.findIndex((item) => item.id === blockedTime.id)
    this.items.splice(itemIndex, 1)
  }
}