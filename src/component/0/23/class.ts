import { Component } from "../.."
import { ContentData, DocumentItem } from "../../../script/document"
import { CaseItem, CaseListItemList } from "../../../types/case"
import { CommentItemList } from "../../../types/comment"
import { Content, ContentOptions } from "../../content"
import { BreadcrumbItemList } from "../24/class"

type CaseContentData = {
  title: string
  body: any

  breadcrumb: BreadcrumbItemList
  data: CaseItem
  pickup: [CaseListItemList, CaseListItemList]
  comment: CommentItemList

  id: number
  status: boolean
} & ContentData

export class CaseContent extends Component implements Content {
  P?: DocumentItem

  title?: string
  element?: Node

  pathname: string
  search: string

  photoSection?: HTMLElement
  videoSection?: HTMLElement
  descriptionSection?: HTMLElement
  commentSection?: HTMLElement
  newArivalsItemsSection?: HTMLElement
  randomItemsSection?: HTMLElement
  coverPhotoSection?: HTMLElement

  data?: CaseItem
  breadcrumb?: BreadcrumbItemList

  constructor(options: ContentOptions) {
    super({
      P: options.P,
    });

    this.pathname = options.pathname;
    this.search = options.search;
  }

  create(data: CaseContentData): void {
    // 存在しない記事の場合 (例外)
    if (!data.status) {
      return location.reload();
    }

    console.log("??", data);

    this.title = data.title;
    this.breadcrumb = data.breadcrumb;
    this.data = data.data;

    this.element = this.window!.element!.create(data.body);
  }

  parse(): void {
    const win = this.window!;
    const js = win.js;
    const doc = this.P!.P!;

    const mainE = this.element = doc.main!;

    this.photoSection = mainE.querySelector("#a") as HTMLElement;
    this.videoSection = mainE.querySelector("#b") as HTMLElement;
    this.descriptionSection = mainE.querySelector("#c") as HTMLElement;
    this.commentSection = mainE.querySelector("#d") as HTMLElement;
    this.newArivalsItemsSection = mainE.querySelector("#e") as HTMLElement;
    this.randomItemsSection = mainE.querySelector("#f") as HTMLElement;
    this.coverPhotoSection = mainE.querySelector("#g") as HTMLElement;
  }

  attach(): void {

  }
}


/*
// comment form
    this.comment = articleE.getElementsByClassName("c42b")[0] as HTMLDivElement;

    // this.commentButton = articleE.getElementsByClassName("c34f")[0].getElementsByClassName("c42f")[0] as HTMLAnchorElement;

    this.commentButton!.addEventListener("click", (event) => {
      event.preventDefault();

      this.window!.js.load(30)
        .then((constructors: [typeof CommentForm]) => {
          if (this.S) {
            new constructors[0]({
              on: {
                done: () => {

                },
              },
              P: this,
            });
          }
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }
        })
    }, {
      passive: false,
    });


*/