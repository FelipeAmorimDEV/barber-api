import { Service } from "@/domain/services/enterprise/entities/service"; 

import { ServicesRepository } from "@/domain/services/application/repositories/service-repository"; 


export class InMemoryServiceRepository implements ServicesRepository {
  public items: Service[] = [] 
  
  async findById(id: string){
    const service = this.items.find((item) => item.id.toString() === id )

    if (!service) {
      return null
    }

    return service
  }

  async create(service: Service) {
    this.items.push(service)
  }

  async delete(service: Service) {
    const itemIndex = this.items.findIndex(item => item.id === service.id)
    this.items.splice(itemIndex, 1)
  }

  async save(service: Service) {
    const itemIndex = this.items.findIndex(item => item.id === service.id)
    this.items[itemIndex] = service
  }
}