import { Component, EventData, InitOptions } from "../..";
import { SVGChevronDownElementJSON } from "../../../utils/svg/chevron-down";
import { SVGChevronLeftElementJSON } from "../../../utils/svg/chevron-left";
import { SVGChevronRightElementJSON } from "../../../utils/svg/chevron-right";
import { SliderEvent } from "../20/class";
import { SliderModal } from "../21/class";

export type PagerCreateUrlResponse = {
  pathname: string, search: string
}

type Options = InitOptions & {
  createUrl?: (page: number) => PagerCreateUrlResponse
  max: number
  min: number
  element?: HTMLUListElement
  id: string
  content: HTMLDivElement
}

export class Pager extends Component {
  createUrl?: (page: number) => PagerCreateUrlResponse
  id: string
  max: number
  min: number = 1
  element: HTMLUListElement
  prev: HTMLAnchorElement
  next: HTMLAnchorElement
  navi: HTMLAnchorElement
  content: HTMLDivElement
  $value: number

  set value(value: number) {
    this.$value = Math.max(Math.min(value, this.max), this.min);
    this.update();
  }

  get value(): number {
    return this.$value;
  }

  dispatch(value: number): void {
    const oldValue = this.$value;
    const newValue = Math.max(this.min, Math.min(value, this.max));

    if (oldValue !== newValue) {
      this.value = newValue;

      this.emit!("select", {
        "value": newValue,
      });
    }

    this.update();
  }

  update(options?: {
    min: number
    max: number
    value: number
  }): void {
    if (options) {
      this.min = options.min;
      this.max = options.max;
      this.$value = options.value;
    }

    const min = this.min;
    const max = this.max;
    const page = Math.min(Math.max(this.value, min), max);

    // prev
    const prevE = this.prev;
    const prevIsDisabled = !(page > min);
    prevE.classList[prevIsDisabled ? "add" : "remove"]("c27d");

    if (this.createUrl && !prevIsDisabled) {
      const { pathname, search } = this.createUrl(page - 1);
      prevE.href = pathname + search;
    }

    // navi
    const naviE = this.navi;
    naviE.classList[!((max - min) > 0) ? "add" : "remove"]("c27d");
    (naviE.firstChild as Text).data = page + " / " + max;

    // next
    const nextE = this.next;
    const nextIsDisabled = !(max > page);
    nextE.classList[nextIsDisabled ? "add" : "remove"]("c27d");

    if (this.createUrl && !prevIsDisabled) {
      const { pathname, search } = this.createUrl(page + 1);
      nextE.href = pathname + search;
    }
  }

  constructor(options: Options) {
    super({
      on: options.on,
      P: options.P,
    });

    this.$value = options.value;
    this.max = options.max;
    this.min = options.min;
    this.id = options.id;

    const win = this.window!;
    const element = win.element;

    if (options.createUrl) {
      this.createUrl = options.createUrl;
    }

    let rootE, prevAE: HTMLAnchorElement, nextAE: HTMLAnchorElement, naviAE: HTMLAnchorElement;

    this.content = options.content;

    if (options.element) {
      rootE = this.element = options.element;

      const aEs = rootE.getElementsByClassName("c27a");
      prevAE = aEs[0] as HTMLAnchorElement;
      naviAE = aEs[1] as HTMLAnchorElement;
      nextAE = aEs[2] as HTMLAnchorElement;

      const str = (naviAE.firstChild as Text).data;
      const [valueStr, maxStr,] = str.split(" / ");

      this.$value = parseInt(valueStr, 10);
      this.max = parseInt(maxStr, 10);

    } else {
      win.css.attach(this, [27,], {
        build: true,
      });

      rootE = this.element = element.create({
        attribute: {
          class: "c27",
        },
        children: [
          {
            children: prevAE = element.create({
              attribute: {
                class: "a2 hb2 c27a",
                href: "",
              },
              children: [
                element.create(SVGChevronLeftElementJSON, {
                  attribute: {
                    height: "12",
                    width: "12",
                  },
                }),
                "前ページ",
              ],
              tagName: "a",
            }) as HTMLAnchorElement,
            tagName: "li",
          },
          {
            children: naviAE = element.create({
              attribute: {
                class: "a2 hb2 c27a",
                role: "button",
              },
              children: [
                "",
                element.create(SVGChevronDownElementJSON, {
                  attribute: {
                    height: "12",
                    width: "12",
                  },
                }),
              ],
              tagName: "a",
            }) as HTMLAnchorElement,
            tagName: "li",
          },
          {
            children: nextAE = element.create({
              attribute: {
                class: "a2 hb2 c27a",
                href: "",
              },
              children: [
                "次ページ",
                element.create(SVGChevronRightElementJSON, {
                  attribute: {
                    height: "12",
                    width: "12",
                  },
                }),
              ],
              tagName: "a",
            }) as HTMLAnchorElement,
            tagName: "li",
          },
        ],
        tagName: "ul",
      }) as HTMLUListElement;
    }

    this.prev = prevAE;
    this.next = nextAE;
    this.navi = naviAE;

    naviAE.addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const targetE = event.currentTarget as HTMLAnchorElement;

      this.window!.js.load(21)
        .then((constructors: [typeof SliderModal]) => {
          if (this.S) {
            this.emit!("change", {
              value: this.$value,
            } as SliderModal);

            new constructors[0]({
              element: this.content,
              min: 1,
              max: this.max,
              id: this.id,
              defaultValue: this.$value,
              value: this.$value,
              on: {
                change: (event: SliderEvent) => this.emit!("change", {
                  value: event.value,
                } as SliderModal),
                update: (event: EventData & SliderEvent) => {
                  (event.target as SliderModal).destroy!();
                  this.dispatch(event.value);
                },
              },
              P: this,
              target: targetE,
              title: "ページの選択",
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

    [
      prevAE,
      naviAE,
      nextAE,
    ].forEach((aE) => {
      aE.addEventListener("mousedown", (event: Event) => event.stopPropagation(), {
        passive: true,
      });
      aE.addEventListener("touchstart", (event: Event) => event.stopPropagation(), {
        passive: true,
      });
    });

    prevAE.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispatch(this.value - 1);
    }, {
      passive: false,
    });

    nextAE.addEventListener("click", (event) => {
      event.preventDefault();
      this.dispatch(this.value + 1);
    }, {
      passive: false,
    });

  }
}