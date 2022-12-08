import { Component, InitOptions } from "../..";
import { SVGChevronRightElementJSON } from "../../../utils/svg/chevron-right";

type Options = InitOptions & {
  element?: HTMLUListElement
}

export type BreadcrumbItem = {
  title: string
  pathname: string
}

export type BreadcrumbItemList = Array<BreadcrumbItem>

export class Breadcrumb extends Component {
  element: HTMLUListElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    if (options.element) {
      this.element = options.element;

    } else {
      this.element = element.create({
        attribute: {
          class: "c31",
        },
        tagName: "ul",
      }) as HTMLUListElement;
    }
  }

  update(items: BreadcrumbItemList): void {
    const win = this.window!;
    const element = win.element;

    const rootE = this.element;
    const elements = rootE.childNodes;
    let hasChanged = items.length !== elements.length;

    if (!hasChanged) {
      for (let i = 0, a = elements; a.length > i; i++) {
        const liE = a[i];
        const aE = liE.firstChild as HTMLAnchorElement;
        const item = items[i];

        if ((item.title !== (aE.firstChild as Text)?.data) || (i !== (elements.length - 1) && aE.pathname !== item.pathname)) {
          hasChanged = true;
          break;
        }
      }
    }

    // 作り直しが必要な場合
    if (hasChanged) {
      rootE.replaceChildren(element.create(items.map((item, index, items) => {
        return {
          attribute: {
            class: "c31a",
          },
          children: index === (items.length - 1) ? item.title : [
            {
              attribute: {
                class: "c31a1",
                href: item.pathname,
              },
              children: item.title,
              tagName: "a",
            },
            element.create(SVGChevronRightElementJSON, {
              attribute: {
                height: "8",
                width: "8",
              },
            }),
          ],
          tagName: "li",
        };
      })));
    }
  }
}