import { Entity } from "../../../../core/entities/entities";

export interface UserProps {
  name: string
  email: string
  password: string
  role: 'BARBER' | 'CUSTOMER' | 'ADMIN'
  avatar: string | null
  createdAt: Date
  updatedAt?: Date
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get avatar() {
    return this.props.avatar
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  touch() {
    this.props.updatedAt = new Date()
  }
}