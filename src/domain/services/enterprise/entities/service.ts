import { Entity } from "../../../../core/entities/entities"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"

export interface ServiceProps {
  name: string
  duration: number
  price: number
  createdAt: Date
  updatedAt?: Date
}

export class Service extends Entity<ServiceProps> {
  get name() {
    return this.props.name
  }

  get duration() {
    return this.props.duration
  }

  get price() {
    return this.props.price
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set duration(duration: number) {
    this.props.duration = duration
    this.touch()
  }

  set price(price: number) {
    this.props.price = price
    this.touch()
  }

  static create(props: Optional<ServiceProps, 'createdAt'>, id?: UniqueEntityID) {
    const service = new Service(
      {
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, 
    id
  )

  return service
}
}