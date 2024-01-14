import { ClassType } from 'remult'

export interface EntityUIInfo {
  key: string
  caption: string
  fields: FieldUIInfo[]
  relations: EntityRelationToManyInfo[]
}
export interface EntityRelationToManyInfo {
  entityKey: string
  fieldOnOtherEntity: string
}

export interface FieldUIInfo {
  key: string
  valFieldKey: string
  caption: string
  relationToOne?: FieldRelationToOneInfo
}
export interface FieldRelationToOneInfo {
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
