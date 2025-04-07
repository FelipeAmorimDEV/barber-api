import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"
import { User, UserProps } from "./user"

export interface BarberUserProps extends UserProps{
  expertise: string | null
  bio: string | null
}

export class BarberUser extends User<BarberUserProps> {
  get expertise() {
    return this.props.expertise
  }

  get bio() {
    return this.props.bio
  }

  set expertise(expertise: string | null) {
    this.props.expertise = expertise
    this.touch()
  }

  static create(props: Optional<BarberUserProps, 'createdAt' | 'role' | 'avatar'>, id?: UniqueEntityID) {
    const barber = new BarberUser(
      {
      ...props,
      role: "BARBER",
      createdAt: props.createdAt ?? new Date(),
      avatar: props.avatar ?? null
    }, 
    id
  )

  return barber
}
}