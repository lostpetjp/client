import { Component } from "../../../component"
import { DocumentItem, ContentData } from "../../../script/document"
import { Content } from "../../content"
import { DocTemplateContent } from "../1/class"

export type DocContentData = {
  title: string
  description: string
  body: any
} & ContentData;

export class TermsContent extends Component implements Content, DocTemplateContent {
  P?: DocumentItem

  title?: string
  description?: string
  element?: Node

  create(data: DocContentData): void {
    this.title = data.title;
    this.description = data.description;

    this.element = this.window!.element!.create(data.body);
  }
}