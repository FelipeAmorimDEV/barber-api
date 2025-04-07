import { BarberUser } from "@/domain/identity-management/enterprise/entities/barber" 

import { BarbersRepository } from "@/domain/identity-management/application/repositories/barber-repository" 


export class InMemoryBarbersRepository implements BarbersRepository {
  public items: BarberUser[] = [] 

  async findById(id: string) {
    const barber = this.items.find((item) => item.id.toString() === id)

    if (!barber) {
      return null
    }

    return barber
  }

  async create(barber: BarberUser) {
    this.items.push(barber)
  }

  async delete(barber: BarberUser) {
    const itemIndex = this.items.findIndex(item => item.id === barber.id)
    this.items.splice(itemIndex, 1)
  }
}