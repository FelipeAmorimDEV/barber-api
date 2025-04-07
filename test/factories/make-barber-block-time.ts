import { UniqueEntityID } from "../../core/entities/unique-entity-id";
import { BarberBlockTime, BarberBlockTimeProps } from "../../domain/person/enterprise/entities/barber-block-time";


export function makeBarberBlockTime(override: Partial<BarberBlockTimeProps> = {}, id?: UniqueEntityID) {
  const barberBlockTime = BarberBlockTime.create({
    barberId: new UniqueEntityID(),
    reason: 'consulta medica',
    startTime: new Date(),
    endTime: new Date(),
    ...override,
  },
    id
  )

  return barberBlockTime
}