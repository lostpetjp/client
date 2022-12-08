import { Component, InitOptions } from "../.."
import { SearchAnimalId } from "../../../types/animal"
import { SearchMatterId } from "../../../types/matter"
import { SearchPrefectureId } from "../../../types/prefecture"
import { SearchUrlObject } from "../16/class"
import { SearchLocationObject, SearchTemplate } from "./class"

type Options = InitOptions & {
  element?: HTMLDivElement | null
}

export class SearchCount extends Component {
  element: HTMLDivElement

  dom: Array<HTMLSpanElement | HTMLAnchorElement> = []

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;
    let rootE, backE;

    if (options.element) {
      rootE = this.element = options.element as HTMLDivElement;
      const spanEs = rootE.getElementsByTagName("span");

      this.dom = [
        spanEs[0] as HTMLSpanElement,
      ];

      backE = spanEs[1];

    } else {
      rootE = this.element = element.create({
        attribute: {
          class: "c25d",
        },
        children: [
          this.dom[0] = element.create({
            attribute: {
              class: "c25d1",
            },
            children: "",
            tagName: "span",
          }) as HTMLSpanElement,
          "件ヒットしました。",
        ],
        tagName: "div",
      }) as HTMLDivElement;
    }

    this.dom[1] = (backE as HTMLSpanElement | null) || element.create({
      children: [
        "(",
        {
          attribute: {
            class: "a1",
            href: "",
          },
          children: "全部見る",
          tagName: "a",
        },
        ")",
      ],
      tagName: "span",
    }) as HTMLSpanElement;

    (this.dom[2] = this.dom[1].getElementsByTagName("a")[0]).addEventListener("click", (event) => {
      event.preventDefault();

      this.window!.document.load({
        pathname: (event.currentTarget as HTMLAnchorElement).pathname,
        search: "",
        type: 1,
        scroll: {},
      });
    }, {
      passive: false,
    })
  }

  update(object: SearchLocationObject, counts: Array<number>): void {
    const win = this.window!;
    const element = win.element;

    const rootE = this.element;
    const doms = this.dom;
    const matterId = object.matter;
    const hasSearch = matterId || object.animal || object.prefecture;

    const root = this.P! as SearchTemplate;

    const prefix = [
      object.matter ? root.matter![object.matter].title : null,
      object.animal ? root.animal![object.animal].title : null,
      object.prefecture ? root.prefecture![object.prefecture].title : null,
    ].filter((value) => value).map((value) => {
      return [
        "「",
        {
          children: value,
          tagName: "b",
        },
        "」",
      ];
    });

    const prefixNode = prefix.length ? element.create([
      prefix,
      "で絞り込み、"
    ]) : null;

    const children = [];

    if (prefixNode) {
      children.push(prefixNode);
    }

    for (let start = false, i = 0, a = rootE.childNodes; a.length > i; i++) {
      if (a[i] === doms[0]) start = true;
      if (start) children.push(a[i]);
    }

    rootE.replaceChildren(...children);

    doms[0].textContent = ("" + counts[matterId]).replace(/(\d)(?=(\d{3})+\b)/g, "$1,");

    const backE = doms[1];
    const isContains = backE.parentNode;

    if (hasSearch && !isContains) {
      (doms[2] as HTMLAnchorElement).href = (this.window!.js.get(16) as SearchUrlObject).create({
        ...object,
        matter: 0 as SearchMatterId,
        animal: 0 as SearchAnimalId,
        prefecture: 0 as SearchPrefectureId,
        page: 1,
      }, this.P! as SearchTemplate);

      this.element.appendChild(backE);

    } else if (!hasSearch && isContains) {
      backE.remove();

    }
  }
}