import { Component } from "../../../component"
import { DocumentItem, ContentData } from "../../../script/document"
import { Content } from "../../content"
export type SearchContentData = {
  title: string
  body: any

  matter: number
  animal: number
  prefecture: number
  sort: number
  page: number
  count: Array<number>

  items?: Array<any>
} & ContentData;

export class SearchContent extends Component implements Content {
  P?: DocumentItem

  title?: string
  element?: Node

  //matter?: number
  //animal?: number
  //prefecture?: number
  //sort?: number
  //page?: number

  items?: Array<any>
  count?: Array<number>
  totalPages?: number

  create(data: SearchContentData): void {
    this.title = data.title;

    // this.matter = data.matter;
    // this.animal = data.animal;
    // this.prefecture = data.prefecture;
    // this.sort = data.sort;
    // this.page = data.page;
    this.items = data.items;
    this.count = data.count;
    this.totalPages = data.total_pages;

    this.element = this.window!.element!.create(data.body);
  }
}