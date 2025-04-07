
export type StatusValueType = 'AGENDADO' | 'FINALIZADO' | 'CANCELADO'| 'DESISTENCIA'

export class Status {
  private value: StatusValueType

  constructor(value: StatusValueType) {
    this.value = value
  }

  toValue() {
    return this.value
  }

  static agendado() {
    return new Status('AGENDADO')
  }

  static finalizado() {
    return new Status('CANCELADO')
  }

  static cancelado() {
    return new Status('FINALIZADO')
  }

  static desistencia() {
    return new Status('DESISTENCIA')
  }
}