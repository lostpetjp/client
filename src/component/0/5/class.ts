import { Component, InitOptions } from "../..";
import { Dialog } from "../../../script/dialog";
import { SVGCloseElementJSON } from "../../../utils/svg/close";

export const DialogItemStyleIdList = [4, 5, 21,];

export type DialogItemOptions = InitOptions & {
  confirm?: ConfirmOptions
  root: Dialog
  title?: string | Node
  content?: string | Node | Array<string | Node>
}

type ConfirmOptions = {
  danger?: boolean
  reject?: string
  resolve?: string
}

export class DialogItem extends Component {
  root?: Dialog
  id: string | number = ""
  element: HTMLElement
  confirmed: boolean = false

  constructor(options: DialogItemOptions) {
    super({
      P: options.P,
      on: options.on,
    });

    const win = this.window!;
    const element = win.element;
    const css = win.css;

    const content = options.content;

    const clickCloseListener = (event: Event) => {
      event.preventDefault();

      if (!this.confirmed) {
        this.close();
      }
    };

    let boxE: HTMLDivElement;
    let headerE: HTMLDivElement;
    let headingE: HTMLHeadingElement;
    let bodyE: HTMLDivElement;
    let footerE: HTMLDivElement;

    let headerCloseAE: HTMLAnchorElement = element.create({
      attribute: {
        class: "a3 c5d1 hb2",
        role: "button",
      },
      children: element.create(SVGCloseElementJSON, {
        attribute: {
          height: "1em",
          width: "1em",
        },
      }),
      tagName: "a",
    }) as HTMLAnchorElement;

    const confirmOptions = options.confirm;

    const closeButtonAE: HTMLAnchorElement = element.create({
      attribute: {
        class: "a3 c4 " + (confirmOptions ? "hb2" : "ht2"),
        role: "button",
      },
      children: confirmOptions ? (confirmOptions.reject || "いいえ") : "閉じる",
      tagName: "a",
    }) as HTMLAnchorElement;

    const footerChildren = [
      closeButtonAE,
    ];

    if (confirmOptions) {
      const confirmAE = element.create({
        attribute: {
          class: "a3 c4 " + (confirmOptions.danger ? "ht3" : "ht1"),
          role: "button",
        },
        children: confirmOptions.resolve || "はい",
        tagName: "a",
      }) as HTMLAnchorElement;

      footerChildren.push(confirmAE);

      const confirmCloseListener = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if (!this.confirmed) {
          this.confirmed = true;
          const buttonE = event.currentTarget as HTMLAnchorElement;
          this.emit!(buttonE === buttonE?.parentNode?.lastChild ? "confirm" : "reject");
        }
      };

      confirmAE.addEventListener("click", confirmCloseListener, {
        passive: false,
      });

      closeButtonAE.addEventListener("click", confirmCloseListener, {
        passive: false,
      });

      headerCloseAE.addEventListener("click", confirmCloseListener, {
        passive: false,
      });

    } else {
      closeButtonAE.addEventListener("click", clickCloseListener, {
        passive: false,
      });

      headerCloseAE.addEventListener("click", clickCloseListener, {
        passive: false,
      });
    }

    const overlayE = this.element = element.create({
      attribute: {
        class: "c5o c21",
        "aria-modal": "true",
        role: "dialog",
      },
      children: boxE = element.create({
        attribute: {
          class: "c5a c5c",
        },
        children: [
          headerE = element.create({
            attribute: {
              class: "c5d",
            },
            children: [
              headingE = element.create({
                attribute: {
                  class: "c5h",
                },
                children: options.title,
                tagName: "h1",
              }) as HTMLHeadingElement,
              headerCloseAE,
            ],
            tagName: "header",
          }) as HTMLDivElement,
          bodyE = element.create({
            attribute: {
              class: "c5b",
            },
            children: (Array.isArray(content) ? content : [content]).map((node) => {
              if ("string" === typeof node) {
                return {
                  children: node,
                  tagName: "p",
                }
              }

              return node;
            }),
            tagName: "div",
          }) as HTMLDivElement,
          footerE = element.create({
            attribute: {
              class: "c4w c5f",
            },
            children: footerChildren,
            tagName: "footer",
          }) as HTMLDivElement,
        ],
        tagName: "div",
      }) as HTMLDivElement,
      tagName: "div",
    }) as HTMLDivElement;

    // for esc close
    const escCloseListener = (event: KeyboardEvent) => {
      if ("Escape" === event.key && !this.confirmed) {
        event.preventDefault();
        this.close();
      }
    };

    window.addEventListener("keydown", escCloseListener, {
      passive: false,
    });

    this.on!(this, "destroy", () => {
      window.removeEventListener("keydown", escCloseListener);
    });

    // for overlay
    overlayE.addEventListener("mousedown", clickCloseListener, { passive: false, });
    overlayE.addEventListener("touchstart", clickCloseListener, { passive: false, });

    const listener = (event: MouseEvent | TouchEvent) => event.stopPropagation();
    boxE.addEventListener("mousedown", listener, { passive: true, });
    boxE.addEventListener("touchstart", listener, { passive: true, });

    css.load(confirmOptions ? (confirmOptions.danger ? [10] : []) : [6])
      .then((styleIdList) => {
        if (this.S) {
          const css = this.window!.css;

          css.attach(this, [
            ...DialogItemStyleIdList,
            ...styleIdList,
          ], {
            build: true,
          });

          document.body.appendChild(overlayE);

          // this.emit!("open");  // 未使用

          // for animation
          setTimeout(() => (this.element.firstChild as HTMLDivElement)?.classList.remove("c5a"), 8);

          this.on!(this, "destroy", () => {
            const win = this.window!;
            win.css.build(true);
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

  close(): void {
    if (this.S) {
      this.element.remove();

      // this.emit!("close"); // 未使用

      this.destroy!();
    }
  }
}