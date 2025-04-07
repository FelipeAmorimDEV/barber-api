import { addMinutes, isBefore, parseISO, formatISO } from 'date-fns'

import { BarbersRepository } from "../../../identity-management/application/repositories/barber-repository"
import { SchedulingRepository } from "../repositories/scheduling-repository"
import { Scheduling } from '../../enterprise/entities/scheduling'
import { BarberBlockTimeRepository } from '../../../identity-management/application/repositories/barber-block-time-repository'
import { BarberBlockTime } from '../../../identity-management/enterprise/entities/barber-block-time'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface FetchAvailableTimeSlotsUseCaseRequest {
  barberId: string
  duration: number
  startDate: Date
}

type AvailableSlot = {
  startTime: string;
  endTime: string;
};

type FetchAvailableTimeSlotsUseCaseResponse = Either<ResourceNotFoundError, {
  slots: AvailableSlot[]
}>


@Injectable()
export class FetchAvailableTimeSlotsUseCase {
  constructor(
    private schedulingsRepository: SchedulingRepository,
    private barbersRepository: BarbersRepository,
    private barbersBlockTimeRepository: BarberBlockTimeRepository
  ) { }

  private generateSlots(openTime: string, closeTime: string, duration: number, currentDate: string): AvailableSlot[] {
    const slots: AvailableSlot[] = []
    let currentTime = parseISO(`${currentDate}T${openTime}`)
    const endOfTheDay = parseISO(`${currentDate}T${closeTime}`)

    while (isBefore(currentTime, endOfTheDay)) {
      const slotEndTime = addMinutes(currentTime, duration)

      if (!isBefore(slotEndTime, endOfTheDay)) break
    
      slots.push({
        startTime: new Date(currentTime).toISOString(),
        endTime: new Date(slotEndTime).toISOString()
      })
      
      currentTime = slotEndTime
    }

    return slots
  }

  private filterConflictingSlots(slots: AvailableSlot[], schedulings: Scheduling[], blockSlots: BarberBlockTime[]): AvailableSlot[]  {
    return slots.filter((slot) => {
      const slotStart = new Date(slot.startTime)
      const slotEndTime = new Date(slot.endTime)

      const duration = (slotEndTime.getTime() - slotStart.getTime()) / (1000 * 60);

      const hasSchedulingConflict = schedulings.some((scheduling) => scheduling.hasSchedulingConflict(slotStart, duration))
      const hasBlockedConflict = blockSlots.some((blocked) => {
        const blockedStart = blocked.startTime
        const blockedEnd = blocked.endTime
        return (
          (slotStart >= blockedStart && slotStart < blockedEnd) ||
          (slotStart <= blockedStart && slotEndTime >= blockedEnd)
        )
      })

      return !hasSchedulingConflict && !hasBlockedConflict
    })
  }

  async execute({ barberId, duration, startDate }: FetchAvailableTimeSlotsUseCaseRequest): Promise<FetchAvailableTimeSlotsUseCaseResponse> {
    const barber = await this.barbersRepository.findById(barberId)

    if (!barber) {
      return left(new ResourceNotFoundError())
    }
    
    const workHours = '09:00-18:00'
    const [openTime, closeTime] = workHours.split('-')
    const currentDate = startDate.toISOString().split('T')[0]

    const schedulings = await this.schedulingsRepository.fetchManyByBarberIdOnDate(barber.id.toString(), startDate)
    const blockSlots = await this.barbersBlockTimeRepository.findManyByBarberIdOnDate(barberId, startDate)
    
    const slots = this.generateSlots(openTime, closeTime, duration, currentDate)
    const availablesSlots = this.filterConflictingSlots(slots, schedulings, blockSlots)

    return right({slots: availablesSlots})  
  }
}