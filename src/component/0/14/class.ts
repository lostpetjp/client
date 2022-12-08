import { Component, EventData, InitOptions } from "../.."
import { DocumentItem, DocumentM } from "../../../script/document"
import { AnimalMap, SearchAnimalId } from "../../../types/animal"
import { CaseListItemList } from "../../../types/case"
import { MatterMap, SearchMatterId } from "../../../types/matter"
import { PrefectureMap, SearchPrefectureId } from "../../../types/prefecture"
import { SearchSortId } from "../../../types/sort"
import { Content } from "../../content"
import { Template, TemplateReadyState } from "../../template"
import { SearchContent } from "../15/class"
import { SearchUrlObject } from "../16/class"
import { Pager } from "../17/class"
import { SearchItemList } from "../18/class"
import { SliderEvent } from "../20/class"
import { Breadcrumb } from "../24/class"
import { TopMessage } from "../25/class"
import { SearchClear } from "./clear"
import { SearchCount } from "./count"
import { SearchFilter } from "./filter"
import { SearchSort } from "./sort"
import { SearchTab } from "./tab"

type Options = InitOptions & {
}

export type SearchLocationObject = {
  matter: SearchMatterId
  animal: SearchAnimalId
  prefecture: SearchPrefectureId
  sort: SearchSortId
  page: number
  [key: string]: any
}

/**
 * Searchカテゴリのテンプレート
 */
export class SearchTemplate extends Component implements Template {
  P?: DocumentM
  readonly id: number = 1
  element?: HTMLElement
  content?: Content
  breadcrumb?: Breadcrumb

  readyState: TemplateReadyState = 0
  private article?: HTMLElement
  private header?: HTMLElement
  private heading?: HTMLElement

  matter?: MatterMap
  animal?: AnimalMap
  prefecture?: PrefectureMap

  location: SearchLocationObject = {
    matter: 0,
    animal: 0,
    prefecture: 0,
    sort: 0,
    page: 1,
  }

  clear?: SearchClear
  filter?: SearchFilter
  sort?: SearchSort
  tab?: SearchTab
  count?: SearchCount
  topPager?: Pager
  bottomPager?: Pager
  list?: SearchItemList

  constructor(options: Options) {
    super({
      P: options.P,
    });
  }

  ready(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.window!.fetch({
        credentials: false,
        method: "GET",
        path: "data",
      })
        .then((res) => {
          if (this.S) {
            this.matter = res.matter as MatterMap;
            this.animal = res.animal as AnimalMap;
            this.prefecture = res.prefecture as PrefectureMap;

            resolve();
          }
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }
        })
        .finally(reject);
    });
  }

  create(): void {
    const win = this.window!;
    const js = win.js;
    const element = win.element;

    const filter = this.filter = new SearchFilter({
      P: this,
    });

    const clear = this.clear = new SearchClear({
      P: this,
    });

    const sort = this.sort = new SearchSort({
      P: this,
    });

    const tab = this.tab = new SearchTab({
      P: this,
    });

    const count = this.count = new SearchCount({
      P: this,
    });

    const breadcrumb = this.breadcrumb = new (js.get(24) as typeof Breadcrumb)({
      P: this,
    });

    const itemList = this.list = new (js.get(18) as typeof SearchItemList)({
      P: this,
      data: {
        matter: this.matter!,
        animal: this.animal!,
        prefecture: this.prefecture!,
      },
    });

    itemList.element.classList.add("c25f");

    const topPager = this.topPager = this.createPager("a");
    const bottomPager = this.bottomPager = this.createPager("b");

    this.element = element.create({
      attribute: {
        class: "d2a",
      },
      children: this.article = element.create({
        attribute: {
          class: "c8 d2a1",
        },
        children: [
          this.header = element.create({
            attribute: {
              class: "c9 c25g",
            },
            children: [
              breadcrumb.element,
              this.heading = element.create({
                attribute: {
                  class: "c1",
                },
                children: "",
                tagName: "h1",
              }) as HTMLHeadingElement,
              clear.container = element.create({
                attribute: {
                  class: "c25w",
                },
                children: [
                  filter.element,
                  sort.element,
                ],
                tagName: "div",
              }) as HTMLDivElement,
              tab.element,
              count.element,
            ],
            tagName: "header",
          }) as HTMLDivElement,
          topPager.element,
          itemList.element,
          bottomPager.element,
        ],
        tagName: "article",
      }) as HTMLDivElement,
      tagName: "main",
    }) as HTMLDivElement;
  }

  parse(): void {
    const win = this.window!;
    const js = win.js;

    const doc = this.P!;

    const mainE = this.element = doc.main!;
    const articleE = this.article = mainE.getElementsByTagName("article")[0] as HTMLElement;
    const headerE = this.header = articleE.getElementsByTagName("header")[0] as HTMLElement;
    const headingE = this.heading = headerE.getElementsByTagName("h1")[0] as HTMLElement;

    const wrapperE = headerE.getElementsByClassName("c25w")[0] as HTMLDivElement;

    const filter = this.filter = new SearchFilter({
      element: wrapperE.getElementsByClassName("c25a")[0] as HTMLUListElement,
      P: this,
    });

    const clearE = wrapperE.getElementsByClassName("c25c")[0];

    this.clear = new SearchClear({
      container: wrapperE,
      element: (clearE as HTMLDivElement) || null,
      P: this,
    });

    this.sort = new SearchSort({
      element: wrapperE.getElementsByClassName("c25b")[0] as HTMLUListElement,
      P: this,
    });

    this.tab = new SearchTab({
      element: headerE.getElementsByClassName("c25e")[0] as HTMLUListElement,
      P: this,
    });

    this.count = new SearchCount({
      element: headerE.getElementsByClassName("c25d")[0] as HTMLDivElement,
      P: this,
    });

    this.breadcrumb = new (js.get(24) as typeof Breadcrumb)({
      element: headerE.getElementsByClassName("c31")[0] as HTMLUListElement,
      P: this,
    });

    const ulEs = articleE.getElementsByClassName("c27");
    this.topPager = this.createPager("a", ulEs[0] as HTMLUListElement);
    this.bottomPager = this.createPager("b", ulEs[1] as HTMLUListElement);

    this.list = new (js.get(18) as typeof SearchItemList)({
      P: this,
      element: articleE.getElementsByClassName("c25f")[0] as HTMLUListElement,
      data: {
        matter: this.matter!,
        animal: this.animal!,
        prefecture: this.prefecture!,
      },
    });
  }

  createPager(id: string, rootE?: HTMLUListElement): Pager {
    const win = this.window!;
    const js = win.js;
    const element = win.element;

    return new (js.get(17) as typeof Pager)({
      on: {
        change: (event: SliderEvent & EventData) => {
          const pager = event.target as Pager;
          const children = pager.content.childNodes;

          (children[1].firstChild!.firstChild as Text).data = ("" + event.value).replace(/(\d)(?=(\d{3})+\b)/g, "$1,");

          (children[0].childNodes[4] as Text).data = (1 === this.location.sort ? "更新" : "発生");

          clearTimeout(this.T[0]);

          this.T[0] = setTimeout(() => {
            if (this.S) {
              this.window!.fetch({
                credentials: false,
                method: "GET",
                body: {
                  path: (this.window!.js.get(16) as SearchUrlObject).create({
                    ...this.location,
                    page: event.value,
                  }, this),
                },
                path: "date",
              })
                .then((res) => {
                  if (this.S) {
                    if (res) {
                      const dateSet = res.data;

                      if (Array.isArray(dateSet) && 2 === dateSet.length) {
                        const children = pager.content.firstChild!.childNodes;
                        (children[0]!.firstChild as Text).data = dateSet[0] as string;
                        (children[2]!.firstChild as Text).data = dateSet[1] as string;
                      }
                    }
                  }
                })
                .catch((err) => {
                  if (this.S) {
                    console.error(err);
                    this.window!.throw();
                  }
                });
            }
          }, 150);
        },
        select: (event: SliderEvent & EventData) => {
          const win = this.window!;

          win.document.load({
            pathname: (win.js.get(16) as SearchUrlObject).create({
              ...this.location,
              page: event.value,
            }, this),
            scroll: "a" === (event.target as Pager).id ? {} : {
              left: 0,
              top: 0,
            },
            search: "",
            type: 1,
          });
        },
      },
      P: this,
      min: 1,
      max: 1,
      value: 1,
      id: id,
      element: rootE,
      createUrl: (page: number) => {
        return {
          pathname: (this.window!.js.get(16) as SearchUrlObject).create({
            ...this.location,
            page: page,
          }, this),
          search: "",
        };
      },
      content: element.create({
        attribute: {
          class: "c25h",
        },
        children: [
          {
            attribute: {
              class: "c25h1",
            },
            children: [
              {
                children: "",
                tagName: "span",
              },
              "〜",
              {
                children: "",
                tagName: "span",
              },
              "に",
              "",
            ],
            tagName: "div",
          },
          {
            attribute: {
              class: "c25h2",
            },
            children: [
              {
                attribute: {
                  class: "c25h2a",
                },
                children: "",
                tagName: "span",
              },
              {
                children: "ページ",
                tagName: "span",
              },
            ],
            tagName: "div",
          },
        ],
        tagName: "div",
      }) as HTMLDivElement,
    });
  }

  build(): void {
    const doc = this.P!;

    if (2 !== doc.mode) {
      const content = this.content! as SearchContent;

      (this.heading!.firstChild as Text).data = content.title!;
    } else {
    }
  }

  attach(): void {
    const params = new URLSearchParams(location.search);

    const win = this.window!;
    const js = win.js;

    if ("404" === params.get("status")) {
      js.load(25)
        .then((constructors: [typeof TopMessage]) => {
          if (this.S) {
            new constructors[0]({
              content: [
                "その案件は存在しないか、既に削除されています。",
              ],
              P: this,
            });
          }
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }
        });
    }

    win.document.on!(this, "load", () => {
      this.location = (this.window!.js.get(16) as SearchUrlObject).parse(location.pathname, this);

      if (1 === this.P!.mode) {
        const content = (this.content as SearchContent)!;

        this.filter!.update(this.location);
        this.clear!.update(this.location);
        this.sort!.update(this.location);

        this.tab!.update(this.location, content.count!);
        this.count!.update(this.location, content.count!);

        const pageOptions = {
          min: 1,
          max: content.totalPages!,
          value: this.location.page,
        };

        this.topPager!.update(pageOptions);
        this.bottomPager!.update(pageOptions);

        this.list!.update(content.items as CaseListItemList);

        this.breadcrumb!.update(content.breadcrumb!);
      }
    });
  }
}
