import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"
import { User, UserProps } from "./user"

export interface AdminUserProps extends UserProps{
  isActive: boolean
}

export class AdminUser extends User<AdminUserProps> {

  get isActive() {
    return this.props.isActive
  }

  set isActive(value: boolean) {
    this.isActive = value
  }

  static create(props: Optional<AdminUserProps, 'createdAt' | 'role' | 'avatar'>, id?: UniqueEntityID) {
    const admin = new AdminUser(
      {
      ...props,
      role: "ADMIN",
      createdAt: props.createdAt ?? new Date(),
      avatar: props.avatar ?? null
    }, 
    id
  )

  return admin
}
}