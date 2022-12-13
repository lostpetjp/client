import { Component } from ".."
import { ContentData, DocumentItem } from "../../script/document"

export type ContentOptions = {
  P: Component
  pathname: string
  search: string
}

export interface Content extends Component {
  P?: DocumentItem
  id?: number
  pathname: string
  search: string

  ready?(): Promise<void>
  create(data: ContentData): Promise<void> | void
  parse?(): Promise<void> | void
  attach?(): Promise<void> | void
}
