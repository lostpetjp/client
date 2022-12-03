// 検索条件の削除UI
// x 絞り込みをしない

import { Component, InitOptions } from "../..";
import { SVGCloseElementJSON } from "../../../utils/svg/close";
import { SearchUrlObject } from "../16/class";
import { SearchLocationObject, SearchTemplate } from "./class";

type Options = InitOptions & {
  element?: HTMLDivElement | null
  container?: HTMLDivElement
}

export class SearchClear extends Component {
  element: HTMLDivElement | null
  container?: HTMLDivElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    this.element = options.element!;

    if (options.container) {
      this.container = options.container;
    }

    if (!this.element) {
      this.element = element.create({
        attribute: {
          class: "c25c",
        },
        children: {
          attribute: {
            class: "a2 c25c1 hb2",
            href: "",
          },
          children: [
            element.create(SVGCloseElementJSON, {
              attribute: {
                height: "12",
                width: "12",
              },
            }),
            "絞り込みをしない",
          ],
          tagName: "a",
        },
        tagName: "div",
      }) as HTMLDivElement;
    }

    this.element.firstChild!.addEventListener("click", (event) => {
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
  }

  update(object: SearchLocationObject): void {
    const element = this.element;
    const hasSearch = object.matter || object.animal || object.prefecture;

    if (hasSearch) {
      (this.window!.js.get(16) as SearchUrlObject).create({
        ...object,
        matter: 0,
        animal: 0,
        prefecture: 0,
        page: 1,
      }, this.P! as SearchTemplate);
    }

    if (hasSearch && !element!.parentNode) {
      this.container!.appendChild(this.element!);
    } else if (!hasSearch && element!.parentNode) {
      this.element!.remove();
    }
  }
}