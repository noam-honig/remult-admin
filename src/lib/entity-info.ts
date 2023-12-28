import { ClassType } from 'remult'

export interface EntityUIInfo {
  key: string
  caption: string
  fields: FieldUIInfo[]
}

export interface FieldUIInfo {
  key: string
  caption: string
}
export interface AdminOptions {
  entities: ClassType<any>[]
}
