import { Component } from "../../../component"
import { DocumentItem, ContentData } from "../../../script/document"
import { Content, ContentOptions } from "../../content"
import { BreadcrumbItemList } from "../24/class";
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
  breadcrumb?: BreadcrumbItemList
} & ContentData;

export class SearchContent extends Component implements Content {
  P?: DocumentItem

  pathname: string
  search: string

  title?: string
  element?: Node

  items?: Array<any>
  count?: Array<number>
  totalPages?: number
  breadcrumb?: BreadcrumbItemList

  constructor(options: ContentOptions) {
    super({
      P: options.P,
    });

    this.pathname = options.pathname;
    this.search = options.search;
  }

  create(data: SearchContentData): void {
    this.title = data.title;

    this.items = data.items;
    this.count = data.count;
    this.totalPages = data.total_pages;
    this.breadcrumb = data.breadcrumb;

    this.element = this.window!.element!.create(data.body);
  }
}