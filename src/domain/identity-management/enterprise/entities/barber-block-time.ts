import { Entity } from "../../../../core/entities/entities"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"

export interface BarberBlockTimeProps {
  barberId: UniqueEntityID
  createdAt: Date
  startTime: Date
  endTime: Date
  reason?: string | null
}

export class BarberBlockTime extends Entity<BarberBlockTimeProps> {
  get barberId() {
    return this.props.barberId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get startTime() {
    return this.props.startTime
  }

  get endTime() {
    return this.props.endTime
  }

  get reason() {
    return this.props.reason
  }

  hasBlockTimeConflict(schedulingStartDate: Date, duration: number) {
    const schedulingEndDate = new Date(schedulingStartDate)
    schedulingEndDate.setTime(schedulingEndDate.getTime() + duration * 60 * 1000)

    const blockStartDate = this.props.startTime
    const blockEndDate = this.props.endTime

    const hasConflict =
      (schedulingStartDate >= blockStartDate && schedulingStartDate < blockEndDate) ||
      (schedulingEndDate > blockStartDate && schedulingEndDate <= blockEndDate) ||
      (schedulingStartDate <= blockStartDate && schedulingEndDate >= blockEndDate)

    return hasConflict
  }

  static create(props: Optional<BarberBlockTimeProps, 'createdAt'>, id?: UniqueEntityID) {
    const barberBlockTime = new BarberBlockTime(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    )

    return barberBlockTime
  }
}