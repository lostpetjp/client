import { Component } from "../.."
import { ContentData, DocumentItem } from "../../../script/document"
import { Content } from "../../content"

type CaseContentData = {
  title: string
  body: any

  id: number
} & ContentData

export class CaseContent extends Component implements Content {
  P?: DocumentItem

  title?: string
  element?: Node

  create(data: CaseContentData): void {
    this.title = data.title;

    this.element = this.window!.element!.create(data.body);
  }
}