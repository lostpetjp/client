import { Component } from ".."
import { StyleIdList } from "../../script/css"
import { ContentData, DocumentItem } from "../../script/document"

export interface Content extends Component {
  P?: DocumentItem
  id: number

  css: StyleIdList

  ready?(): Promise<void>
  create(data: ContentData): Promise<void> | void
  parse?(): Promise<void> | void
  attach?(): Promise<void> | void
}
