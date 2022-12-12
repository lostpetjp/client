import { Component, InitOptions } from "../..";
import { SearchLocationObject, SearchTemplate } from "./class";

type Options = InitOptions & {
  element?: HTMLUListElement | null
}

export class SearchTab extends Component {
  element: HTMLUListElement

  dom: Array<HTMLAnchorElement> = []

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    if (options.element) {
      this.element = options.element;
      this.dom = Array.from(this.element.getElementsByClassName("c25e1a")) as Array<HTMLAnchorElement>;

    } else {
      this.element = element.create({
        attribute: {
          class: "c25e",
        },
        children: [
          "すべて",
          "迷子",
          "保護、目撃",
        ].map((title: string, index: number) => {
          return {
            children: this.dom[index] = this.window!.element.create({
              attribute: {
                class: "a2 c25e1a hb2",
                href: "",
              },
              children: [
                title,
                {
                  attribute: {
                    class: "c25e1a1",
                  },
                  children: "",
                  tagName: "span",
                },
              ],
              tagName: "a",
            }) as HTMLAnchorElement,
            tagName: "li",
          };
        }),
        tagName: "ul",
      }) as HTMLUListElement
    }

    this.dom.forEach((aE) => {
      aE.addEventListener("click", (event) => {
        event.preventDefault();

        this.window!.document.load({
          pathname: (event.currentTarget as HTMLAnchorElement).pathname,
          search: "",
          type: 1,
          scroll: {},
        });
      }, {
        passive: false,
      });
    });

  }

  update(object: SearchLocationObject, counts: Array<number>): void {
    const root = this.P! as SearchTemplate;
    const doms = this.dom;
    const searchUrl = root.url;

    doms[0].href = searchUrl.create({ ...object, page: 1, matter: 0, });
    doms[1].href = searchUrl.create({ ...object, page: 1, matter: 1, });
    doms[2].href = searchUrl.create({ ...object, page: 1, matter: 2, });

    doms.forEach((aE: HTMLAnchorElement, index: number) => {
      aE.classList[index === (this.P as SearchTemplate)!.location.matter ? "add" : "remove"]("c25e1s");

      const countStr = ("" + counts[index]).replace(/(\d)(?=(\d{3})+\b)/g, "$1,");
      const spanE = aE.childNodes[1] as HTMLSpanElement;

      (spanE.firstChild as Text)!.data = countStr;
      spanE.title = countStr + "件";
    });
  }
}