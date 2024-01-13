import { ClassType } from 'remult'

export interface EntityUIInfo {
  key: string
  caption: string
  fields: FieldUIInfo[]
}

export interface FieldUIInfo {
  key: string
  caption: string
  relation?: FieldRelationInfo
}
export interface FieldRelationInfo {
  entityKey: string
  idField: string
  captionField: string
}
export interface AdminOptions extends DisplayOptions {
  entities: ClassType<any>[]
}
export interface DisplayOptions {
  baseUrl?: string
}
