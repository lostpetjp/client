import { Component, InitOptions } from "../..";
import { SearchSortId } from "../../../types/sort";

type Options = InitOptions & {
  element?: HTMLUListElement
}

type LocationObject = {
  sort: SearchSortId
  [key: string]: any
}

export class SearchSort extends Component {
  element: HTMLUListElement

  dom: [HTMLAnchorElement, HTMLAnchorElement]

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    let rootE;

    if (options.element) {
      rootE = this.element = options.element;

    } else {
      rootE = this.element = element.create({
        attribute: {
          class: "c25b",
        },
        children: [["b", "発生",], ["c", "新着",],].map(([tokenSuffix, title]) => {
          return {
            attribute: {
              class: "c25b1",
            },
            children: {
              attribute: {
                class: "a2 c25b1a c25b1" + tokenSuffix + " hb3",
                href: "",
              },
              children: title,
              tagName: "a",
            },
            tagName: "li",
          };
        }),
        tagName: "ul",
      }) as HTMLUListElement;

    }

    (this.dom = [
      rootE.getElementsByClassName("c25b1b")[0] as HTMLAnchorElement,
      rootE.getElementsByClassName("c25b1c")[0] as HTMLAnchorElement,
    ]).forEach((aE) => {
      aE.addEventListener("click", (event) => {
        event.preventDefault();

        this.window!.document.load({
          pathname: (event.currentTarget as HTMLAnchorElement).pathname,
          search: "",
          type: 1,
          scroll: {},
        })
      }, {
        passive: false,
      })
    });
  }

  update(object: LocationObject) {
    const isNew = 1 === object.sort;

    const doms = this.dom;
    doms[0].classList[!isNew ? "add" : "remove"]("c25b1s");
    doms[1].classList[isNew ? "add" : "remove"]("c25b1s");
  }
}