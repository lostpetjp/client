import { Component, InitOptions } from "../..";
import { DrawerCloseOptions } from "../../../script/drawer";
import { SVGCloseElementJSON } from "../../../utils/svg/close";

export type DrawerItemLeftOptions = InitOptions & {
  element: any
  feature?: number
  title: string
}

export const DrawerItemLeftStyleIdList = [19, 21,]

export class DrawerItemLeft extends Component {
  element: HTMLDivElement
  content: HTMLDivElement
  header: HTMLDivElement
  body: HTMLDivElement
  feature: number
  scroll: ScrollToOptions | null

  constructor(options: DrawerItemLeftOptions) {
    super({
      P: options.P,
      on: options.on,
    });

    const win = this.window!;
    const css = win.css;
    const doc = win.document;
    const element = win.element;

    css.attach(this, DrawerItemLeftStyleIdList, {
      build: true,
    });

    const featureOptions = options.feature;
    const feature = this.feature = "number" === typeof featureOptions ? featureOptions : (1 | 2 | 4);

    this.scroll = {
      left: scrollX,
      top: scrollY,
    }

    const touchEvent = (1 & feature) ? (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      this.close({
        annotation: 1,
      });
    } : null;

    if (2 & feature) {
      var keydownEv = (event: KeyboardEvent) => {
        if ("Escape" === event.key) {
          event.preventDefault();

          this.close({
            annotation: 2,
          });
        }
      };

      addEventListener("keydown", keydownEv, {
        capture: true,
        passive: false,
      });

      this.on!(this, "destroy", () => removeEventListener("keydown", keydownEv, {
        capture: true,
      }));
    }

    const popupEventListener = () => this.window!.popup.close({
      annotation: 1,
    });

    let rootE, contentE, headerE, bodyE;

    document.body.appendChild(rootE = this.element = element.create({
      attribute: {
        class: "c19o c21",
      },
      children: contentE = this.content = element.create({
        attribute: {
          class: "c19 c19p",
        },
        children: [
          headerE = this.header = element.create({
            attribute: {
              class: "c19a",
            },
            children: [
              {
                attribute: {
                  class: "a2 c19a1 hb2",
                },
                children: element.create(SVGCloseElementJSON, {
                  attribute: {
                    height: "12",
                    width: "12",
                  },
                }),
                on: {
                  click: [
                    (event: MouseEvent | TouchEvent) => {
                      event.preventDefault();

                      this.close({
                        annotation: 1,
                      });
                    },
                    {
                      passive: false,
                    },
                  ],
                  mousedown: [(event: MouseEvent | TouchEvent) => event.stopPropagation(), { passive: true, }],
                  touchstart: [(event: MouseEvent | TouchEvent) => event.stopPropagation(), { passive: true, }],
                },
                tagName: "a",
              },
              {
                attribute: {
                  class: "c19a2",
                },
                children: options.title,
                tagName: "div",
              },
            ],
            tagName: "div",
          }) as HTMLDivElement,
          bodyE = this.body = element.create({
            attribute: {
              class: "c19b",
            },
            children: options.element,
            tagName: "div",
          }) as HTMLDivElement,
        ],
        on: {
          mousedown: [(event: Event) => event.stopPropagation(), { passive: true, }],
          touchstart: [(event: Event) => event.stopPropagation(), { passive: true, }],
        },
        tagName: "div",
      }) as HTMLDivElement,
      on: touchEvent ? {
        mousedown: [touchEvent, { passive: false, },],
        touchstart: [touchEvent, { passive: false, },],
      } : null,
      tagName: "div",
    }) as HTMLDivElement);

    contentE.addEventListener("mousedown", popupEventListener, { passive: true, });
    contentE.addEventListener("touchstart", popupEventListener, { passive: true, });

    doc.attach(rootE);

    if (document.documentElement.classList.contains("r1")) {
      scrollTo(0, 0);
      // this.emit!("open");  // 未使用
    } else {
      setTimeout(() => {
        if (this.S) {
          this.content.classList.remove("c19p");

          // setTimeout(() => {
          // if (this.S) {
          // this.emit!("open");  // 未使用
          // }
          // }, 308);
        }
      }, 8);
    }

    this.on!(this, "destroy", () => this.restore());
  }

  restore(): void {
    const savedScroll = this.scroll;

    this.element.remove();

    if (savedScroll) scrollTo(savedScroll);

    this.scroll = null;
  }

  close(options?: DrawerCloseOptions): void {
    const annotation = options ? options.annotation : 0;
    const isTouchClose = 1 & annotation;
    const isKeyboardClose = 2 & annotation;
    const isButtonClose = 4 & annotation;

    const feature = this.feature;

    if (!((isTouchClose && !(1 & feature)) || (isKeyboardClose && !(2 & feature)) || (isButtonClose && !(4 & feature)))) {
      this.restore();

      this.emit!("close");

      this.destroy!();
    }
  }
}