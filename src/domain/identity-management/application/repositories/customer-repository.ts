import { CustomerUser } from "../../enterprise/entities/customer";

export abstract class CustomersRepository {
  abstract findByEmail(email: string): Promise<CustomerUser | null>
  abstract findById(id: string): Promise<CustomerUser | null>
  abstract create(customer: CustomerUser): Promise<void>
  abstract delete(customer: CustomerUser): Promise<void>
}