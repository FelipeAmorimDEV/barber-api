import { Entity } from "../../../../core/entities/entities"
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id"
import { Optional } from "../../../../core/types/optional"

import { Status } from "./value-objects/status"

export interface SchedulingProps {
  customerId: UniqueEntityID
  barberId: UniqueEntityID
  serviceId: UniqueEntityID
  status: Status
  startDate: Date
  endDate: Date
  createdAt: Date
  isLateCancellation?: boolean | null
  updatedAt?: Date
}

export class Scheduling extends Entity<SchedulingProps> {
  get customerId() {
    return this.props.customerId
  }

  get barberId() {
    return this.props.barberId
  }

  get serviceId() {
    return this.props.serviceId
  }

  get status() {
    return this.props.status
  }


  get startDate() {
    return this.props.startDate
  }

  get endDate() {
    return this.props.endDate
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }


  get isLateCancellation(): boolean | undefined | null {
    return this.props.isLateCancellation
  }

  set isLateCancellation(value: boolean) {
    this.props.isLateCancellation = value
  }

  set status(status: Status) {
    this.props.status = status
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  canBeCanceledBy(userId: string): boolean {
    return this.barberId.toString() === userId || this.customerId.toString() === userId
  }

  isTooLateToCancel(currentDate: Date): boolean {
    const TWO_HOURS_IN_MS = 1000 * 60 * 60 * 2 // HOURS
    const timeDifference = Math.abs(this.startDate.getTime() - currentDate.getTime())
    return timeDifference < TWO_HOURS_IN_MS
  }

  hasSchedulingConflict(schedulingStartDate: Date, duration: number): boolean {
    const schedulingEndDate = new Date(schedulingStartDate)
    schedulingEndDate.setTime(schedulingEndDate.getTime() + duration * 60 * 1000) // 60 SECONDS

    const scheduleStart = this.props.startDate
    const scheduleEnd = this.props.endDate

    const hasConflict = 
      (schedulingStartDate >= scheduleStart && schedulingStartDate < scheduleEnd) || 
      (schedulingEndDate > scheduleStart && schedulingEndDate <= scheduleEnd) || 
      (schedulingStartDate <= scheduleStart && schedulingEndDate >= scheduleEnd)

      return hasConflict
  }

  static create(props: Optional<SchedulingProps, 'createdAt'>, id?: UniqueEntityID) {
    const scheduling = new Scheduling(
      {
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, 
    id
  )

  return scheduling
}
}