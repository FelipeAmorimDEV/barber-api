import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Status } from './status'

type SchedulingWithDetailsProps = {
  schedulingId: UniqueEntityID
  customerId: UniqueEntityID
  barberId: UniqueEntityID
  serviceId: UniqueEntityID
  status: Status
  serviceTime: number
  startDate: Date
  createdAt: Date
  isLateCancellation?: boolean
  updatedAt?: Date
}

export class SchedulingWithDetails extends ValueObject<SchedulingWithDetailsProps> {
  get schedulingId() {
    return this.props.schedulingId
  }

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

  get serviceTime() {
    return this.props.serviceTime
  }

  get startDate() {
    return this.props.startDate
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isLateCancellation() {
    return this.props.isLateCancellation
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: SchedulingWithDetailsProps) {
    const schedulingWithDetails = new SchedulingWithDetails(props)

    return schedulingWithDetails
  }
}
