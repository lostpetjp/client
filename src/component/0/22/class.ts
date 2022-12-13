import { Component, InitOptions } from "../..";
import { DocumentM } from "../../../script/document";
import { SVGCopyElementJSON } from "../../../utils/svg/copy";
import { SVGFacebookElementJSON } from "../../../utils/svg/facebook";
import { SVGMenuElementJSON } from "../../../utils/svg/menu";
import { SVGTwitterElementJSON } from "../../../utils/svg/twitter";
import { Content } from "../../content";
import { Template, TemplateReadyState } from "../../template";
import { CaseContent } from "../23/class";
import { Breadcrumb } from "../24/class";
import { TopMessage } from "../25/class";
import { MediaViewer, MediaViewerItemList } from "../29/class";
import { CommentForm } from "../30/class";

type Options = InitOptions & {
}

/**
 * Caseカテゴリのテンプレート
 */
export class CaseTemplate extends Component implements Template {
  P?: DocumentM
  readonly id: number = 1
  element?: HTMLElement
  content?: CaseContent

  breadcrumb?: Breadcrumb
  closeButton?: HTMLAnchorElement
  posterButton?: HTMLAnchorElement
  editButton?: HTMLAnchorElement
  commentButton?: HTMLAnchorElement

  time?: HTMLTimeElement
  comment?: HTMLDivElement

  readyState: TemplateReadyState = 0
  private article?: HTMLElement
  private header?: HTMLElement
  private heading?: HTMLElement

  private mediaViewerListener: (event: Event) => void = (event: Event) => {
    event.preventDefault();

    const targetE = event.currentTarget as HTMLElement;

    this.window!.js.load(29)
      .then((constructors: [typeof MediaViewer]) => {
        if (this.S) {
          const mainE = this.element!;

          new constructors[0]({
            element: targetE,
            items: (Array.from(mainE?.getElementsByClassName("c35")) as Array<HTMLElement>).map((element: HTMLElement, index: number) => {
              return {
                element: element,
                index: index,
              };
            }),
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
  }

  constructor(options: Options) {
    super({
      P: options.P,
    });
  }

  create(): void {
    const win = this.window!;
    const js = win.js;
    const element = win.element;

    const breadcrumb = this.breadcrumb = new (js.get(24) as typeof Breadcrumb)({
      P: this,
    });

    this.element = element.create({
      attribute: {
        class: "d2a",
        role: "main",
      },
      children: this.article = element.create({
        attribute: {
          class: "c7 c9 d2a1",
        },
        children: [
          this.header = element.create({
            attribute: {
              class: "c9",
            },
            children: [
              breadcrumb.element,
              this.heading = element.create({
                attribute: {
                  class: "c1 c34h1",
                },
                children: "",
                tagName: "h1",
              }) as HTMLHeadingElement,
              {
                attribute: {
                  class: "c34e",
                },
                children: [
                  {
                    attribute: {
                      class: "c34e1",
                    },
                    children: [
                      this.editButton = element.create({
                        attribute: {
                          class: "a3 c34e1a ht2",
                          role: "button",
                        },
                        children: "編集する",
                        tagName: "a",
                      }) as HTMLAnchorElement,
                      this.posterButton = element.create({
                        attribute: {
                          class: "a3 c34e1a ht2",
                          href: "/poster",
                        },
                        children: "ポスター",
                        tagName: "a",
                      }) as HTMLAnchorElement,
                      this.closeButton = element.create({
                        attribute: {
                          class: "a3 c34e1a ht2",
                          role: "button",
                        },
                        children: "終了する",
                        tagName: "a",
                      }) as HTMLAnchorElement,
                    ],
                    tagName: "div",
                  },
                  {
                    attribute: {
                      class: "c34e2",
                    },
                    children: this.time = element.create({
                      attribute: {
                        class: "c34e2a",
                      },
                      tagName: "time",
                    }) as HTMLTimeElement,
                    tagName: "div",
                  },
                  {
                    attribute: {
                      class: "c34e3",
                    },
                    children: [
                      {
                        attribute: {
                          class: "a2 c34e3a",
                        },
                        children: element.create(SVGCopyElementJSON, {
                          attribute: {
                            height: "28",
                            width: "28",
                          },
                        }),
                        tagName: "a",
                      },
                      {
                        attribute: {
                          class: "a2 c34e3a",
                        },
                        children: element.create(SVGTwitterElementJSON, {
                          attribute: {
                            height: "28",
                            width: "28",
                          },
                        }),
                        tagName: "a",
                      },
                      {
                        attribute: {
                          class: "a2 c34e3a",
                        },
                        children: element.create(SVGFacebookElementJSON, {
                          attribute: {
                            height: "28",
                            width: "28",
                          },
                        }),
                        tagName: "a",
                      },
                      {
                        attribute: {
                          class: "a2 c34e3a",
                        },
                        children: element.create(SVGMenuElementJSON, {
                          attribute: {
                            height: "28",
                            width: "28",
                          },
                        }),
                        tagName: "a",
                      },
                    ],
                    tagName: "div",
                  },
                ],
                tagName: "div",
              },
            ],
            tagName: "header",
          }) as HTMLElement,
        ],
        tagName: "article",
      }) as HTMLElement,
      tagName: "main",
    }) as HTMLElement;
  }

  parse(): void {
    const win = this.window!;
    const js = win.js;
    const doc = this.P!;

    const mainE = this.element = doc.main!;
    const articleE = this.article = mainE.getElementsByTagName("article")[0] as HTMLElement;
    const headerE = this.header = articleE.getElementsByTagName("header")[0] as HTMLElement;
    this.heading = headerE.getElementsByTagName("h1")[0] as HTMLElement;

    this.breadcrumb = new (js.get(24) as typeof Breadcrumb)({
      element: headerE.getElementsByClassName("c31")[0] as HTMLUListElement,
      P: this,
    });

    const editEs = articleE.getElementsByClassName("c34e1a");
    this.editButton = editEs[0] as HTMLAnchorElement;
    this.posterButton = editEs[1] as HTMLAnchorElement;
    this.closeButton = editEs[2] as HTMLAnchorElement;

    this.time = articleE.getElementsByClassName("c34e2a")[0] as HTMLTimeElement;
  }

  build(): void {
    const content = this.content! as CaseContent;
    const caseItem = content.data!;

    console.log("build", this.article);

    if (2 !== this.P!.mode) {
      this.heading!.textContent = content.data!.head.title!;

      const date = new Date(caseItem.updated_at * 1000);

      this.time!.textContent = date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);

      this.article!.replaceChildren(...[
        this.header!,
        content.photoSection!,
        content.videoSection!,
        content.coverPhotoSection!,
        content.descriptionSection!,
        content.commentSection!,
        content.newArivalsItemsSection!,
        content.randomItemsSection!,
      ].filter((element) => element));
    }
  }

  attach(): void {
    const mainE = this.element!;

    // share buttons
    const shareEs = mainE.getElementsByClassName("c34e3a");

    // for copy
    (shareEs[0] as HTMLAnchorElement).addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      console.log("??", this.content);

      navigator.clipboard.writeText("https://" + location.hostname + location.pathname)
        .then(() => {
          if (this.S) {
            return this.window!.js.load(25);
          }
        })
        .then((constructors: [typeof TopMessage]) => {
          if (this.S) {
            new constructors[0]({
              P: this,
              content: "URLをコピーしました。",
              expires: 3000,
              type: "infomation",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        })
    }, {
      passive: false,
    });

    // for twitter
    (shareEs[1] as HTMLAnchorElement).addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      open("https://twitter.com/share?url=" + encodeURIComponent("https://" + location.hostname + location.pathname) + "&text=" + encodeURIComponent((document.head.querySelector("meta[property='description']") as HTMLMetaElement)!.content) + "&related=lostpetjp%3A%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E6%9B%B4%E6%96%B0%E6%83%85%E5%A0%B1%E3%82%84%E5%85%A8%E5%9B%BD%E3%81%AE%E8%BF%B7%E5%AD%90%E6%83%85%E5%A0%B1%E3%82%92%E7%99%BA%E4%BF%A1%E3%81%97%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%80%82,arayutw%3A%E3%80%8C%E8%BF%B7%E5%AD%90%E3%83%9A%E3%83%83%E3%83%88%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%80%8D%E3%81%AE%E7%AE%A1%E7%90%86%E8%80%85%E3%81%A7%E3%81%99%E3%80%82", "_blank");
    }, {
      passive: false,
    });

    // for facebook
    (shareEs[2] as HTMLAnchorElement).addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://" + location.hostname + location.pathname), "_blank");
    }, {
      passive: false,
    });

    // for webshare
    const customShareE = shareEs[3] as HTMLAnchorElement;

    if (customShareE) {
      const shareRootE = customShareE.parentNode! as HTMLElement;
      let addToken, removeToken;

      if (!navigator.share) {
        customShareE.remove();
        addToken = "c34e3c3";
        removeToken = "c34e3c4";

      } else {
        customShareE.addEventListener("click", (event) => {
          event.preventDefault();

          navigator.share({
            title: this.heading!.textContent!,
            text: (document.head.querySelector("meta[property='description']") as HTMLMetaElement)!.content,
            url: "https://" + location.hostname + location.pathname,
          });
        }, {
          passive: false,
        });

        addToken = "c34e3c4";
        removeToken = "c34e3c3";
      }

      shareRootE.classList.add(addToken);
      shareRootE.classList.remove(removeToken);
    }

    this.window!.document.on!(this, "load", () => {
      const mainE = this.element!;

      // media viewer
      for (let i = 0, a = Array.from(mainE?.getElementsByClassName("c35")) as Array<HTMLElement>; a.length > i; i++) {
        a[i].addEventListener("click", this.mediaViewerListener, {
          passive: false,
        });
      }
    });
  }
}