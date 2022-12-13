import { Component, InitOptions } from "../..";
import { DrawerCloseOptions } from "../../../script/drawer";
import { SVGCloseElementJSON } from "../../../utils/svg/close";

export type DrawerItemFullpageStyleIdList = [20,]

type ConfirmEvent = {
  source: Component,
  target: DrawerItemFullpage
};

export type DrawerItemFullpageOptions = InitOptions & {
  confirm?: (event: ConfirmEvent) => void
  content: any
  title: string
}

export const DrawerItemFullpageStyleIdList = []

export class DrawerItemFullpage extends Component {
  scroll: null | ScrollToOptions = {
    left: scrollX,
    top: scrollY,
  }
  nodes: null | Array<Node> = Array.from(document.body.childNodes)

  confirm: null | ((event: ConfirmEvent) => void) = null
  element: HTMLDivElement
  header: HTMLDivElement
  body: HTMLDivElement

  constructor(options: DrawerItemFullpageOptions) {
    super({
      P: options.P,
      on: options.on,
    });

    const win = this.window!;
    const doc = win.document;
    const element = win.element;

    win.css.attach(this, DrawerItemFullpageStyleIdList, {
      build: true,
    });

    document.body.classList.add("c20m");

    const rootE = this.element = element.create({
      attribute: {
        class: "c20",
      },
      children: [
        this.header = element.create({
          attribute: {
            class: "c20a c20ap",
          },
          children: [
            {
              attribute: {
                class: "a2 c20a1 hb2",
              },
              children: element.create(SVGCloseElementJSON, {
                attribute: {
                  height: "16",
                  width: "16",
                },
              }),
              on: {
                click: [
                  (event: Event) => {
                    event.preventDefault();

                    this.close({
                      annotation: 4,
                    });
                  },
                  {
                    passive: false,
                  },
                ],
                mousedown: [(event: Event) => event.stopPropagation(), { passive: true, }],
                touchstart: [(event: Event) => event.stopPropagation(), { passive: true, }],
              },
              tagName: "a",
            },
            {
              attribute: {
                class: "c20a2",
              },
              children: options.title,
              tagName: "div",
            },
          ],
          tagName: "div",
        }) as HTMLDivElement,
        this.body = element.create({
          attribute: {
            class: "c20b c20bp",
          },
          children: options.content,
          tagName: "div",
        }) as HTMLDivElement,
      ],
      on: {
        mousedown: [(event: Event) => event.stopPropagation(), { passive: true, }],
        touchstart: [(event: Event) => event.stopPropagation(), { passive: true, }],
      },
      tagName: "div",
    }) as HTMLDivElement;

    const touchCallback = () => win.popup.close({
      annotation: 1,
      layer: this,
    });
    rootE.addEventListener("mousedown", touchCallback, { passive: true, });
    rootE.addEventListener("touchstart", touchCallback, { passive: true, });

    doc.attach(rootE);

    setTimeout(() => {
      if (this.S) {
        scrollTo(0, 0);

        this.header.classList.remove("c20ap");

        setTimeout(() => {
          if (this.S) {
            scrollTo(0, 0);


            this.body.classList.remove("c20bp");

            this.emit!("open");
          }

          document.body.classList.remove("c20m");
        }, 208);
      }
    }, 8);

    this.on!(this, "destroy", () => {
      this.restore();
      this.window!.css.update();
    });
  }

  restore(): void {
    const win = this.window!;

    const savedNodes = this.nodes;
    const savedScroll = this.scroll;

    if (win.S && savedNodes) {
      document.body.replaceChildren(...savedNodes);
      this.nodes = null;
    }

    if (savedScroll) {
      scrollTo(savedScroll);
      this.scroll = null;
    }

    win.popup.reposition();
  }

  close(options?: DrawerCloseOptions): void {
    const annotation = options?.annotation!;

    const isTouchClose = 1 & annotation;  // 機能なし
    const isKeyboardClose = 2 & annotation; // 機能なし
    const isButtonClose = 4 & annotation;
    const isManualClose = isTouchClose || isKeyboardClose || isButtonClose;

    if (isManualClose && "function" === typeof this.confirm) {
      this.confirm({
        source: this.P!,
        target: this,
      });

    } else {
      this.restore();

      this.emit!("close");

      this.destroy!();
    }
  }
}