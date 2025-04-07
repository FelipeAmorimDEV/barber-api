import { CustomerUser } from "@/domain/identity-management/enterprise/entities/customer" 
import { CustomersRepository } from "@/domain/identity-management/application/repositories/customer-repository" 

export class InMemoryCustumersRepository implements CustomersRepository {
  public items: CustomerUser[] = []
  
  async findById(id: string) {
    const custumer = this.items.find((item) => item.id.toString() === id )

    if (!custumer) {
      return null
    }

    return custumer
  }

  async create(customer: CustomerUser) {
    this.items.push(customer)
  }

  async delete(customer: CustomerUser) {
    const itemIndex = this.items.findIndex(item => item.id === customer.id)
    this.items.splice(itemIndex, 1)
  }
}