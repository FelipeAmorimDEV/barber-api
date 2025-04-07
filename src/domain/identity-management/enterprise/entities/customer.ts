import { Entity } from "../../../../core/entities/entities"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"
import { User, UserProps } from "./user"

export interface CustomerUserProps extends UserProps{
  phone: string | null
  birthDate: Date | null
}

export class CustomerUser extends User<CustomerUserProps> {
 
  get phone() {
    return this.props.phone
  }

  get birthDate() {
    return this.props.birthDate
  }

  set phone(phone: string | null) {
    this.props.phone = phone
    this.touch()
  }

  static create(props: Optional<CustomerUserProps, 'createdAt' | 'role' | 'avatar'>, id?: UniqueEntityID) {
    const customer = new CustomerUser(
      {
      ...props,
      role: "CUSTOMER",
      createdAt: props.createdAt ?? new Date(),
      avatar: props.avatar ?? null
    }, 
    id
  )

  return customer
}
}