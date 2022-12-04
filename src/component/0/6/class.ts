import { CallbackEventData, Component, EventData, InitOptions } from "../..";
import { StyleIdList } from "../../../script/css";
import { PopupLayer } from "../../../script/popup";
import { SVGCheckElementJSON } from "../../../utils/svg/check";
import { SVGCloseElementJSON } from "../../../utils/svg/close";

export const PopupItemStyleIdList = [11]

export type PopupItemCloseOptions = {
  annotation?: number
}

/**
 * features
 * 1: 
 * 2: 
 * 4: 
 * 8: disabled reposition
 */
type FeatureType = number
type PositionType = 0 | 1 | 2 | 3 | 4
type AlignType = 0 | 1 | 2 | 3 | 4

type Type = "menu" | "modal" | "toast"

type ToastColor = 1 | 2

type PopupItemCoreOptions = InitOptions & {
  align?: AlignType
  animation?: boolean
  css?: StyleIdList
  feature?: FeatureType
  id?: string | number
  layer?: Component
  position?: PositionType
  target: HTMLElement
  type?: Type
  width?: HTMLElement
}

export type PopupItemToastOptions = PopupItemCoreOptions & {
  color?: ToastColor
  expires: number
  text: any
}

export type PopupItemModalOptions = PopupItemCoreOptions & {
  title: string
  large?: boolean
}

export type PopupItemOptions = PopupItemToastOptions | PopupItemModalOptions | PopupItemCoreOptions

export class PopupItem extends Component {
  align: AlignType = 0
  confirm?: (event: CallbackEventData) => void
  element: HTMLDivElement
  feature: FeatureType
  layer?: PopupLayer
  id: string | number = ""
  position: PositionType = 3
  target: HTMLElement
  style: HTMLStyleElement = document.createElement("style")
  width?: HTMLElement

  constructor(options: PopupItemOptions) {
    super({
      P: options.P,
      on: options.on,
    });

    const win = this.window!;
    const css = win.css;
    const element = win.element;

    const addStyleIdList = [];

    if (options.id) this.id = options.id;
    if ("number" === typeof options.align) this.align = options.align;
    if ("number" === typeof options.position) this.position = options.position;
    this.target = options.target;

    const optionStyleIdList = options.css || [];

    const featureOptions = options.feature;
    this.feature = "number" === typeof featureOptions ? featureOptions : (1 | 2 | 4);

    const type = options.type;
    const isToast = "toast" === type;
    const isModal = "modal" === type;
    const isMenu = "menu" === type;

    const clickCloseListener = (event: Event) => {
      event.stopPropagation();

      this.closeChildren({
        annotation: 1,
      });
    }

    // resize用のclass token
    const uniqueToken = "u" + Math.random().toString(32).substring(2) + Date.now();

    let nodeJSON = options.element;

    const closeButtonAE = isToast || isModal ? element.create({
      attribute: {
        class: "a2 " + (isToast ? "c12b" : "c11a2") + " hb3",
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
              annotation: 4,
            });
          },
          {
            passive: false,
          },
        ],
      },
      tagName: "a",
    }) : null;

    if (isToast) {
      const toastOptions = options as PopupItemToastOptions;

      this.feature |= 8;

      const textOptions = toastOptions.text;
      let children: Array<any> = [];
      const isDanger = 2 === toastOptions.color;

      addStyleIdList.push(12, (isDanger ? 14 : 13));

      if (textOptions) {
        for (let a = Array.isArray(textOptions) ? textOptions : [textOptions,], i = 0; a.length > i; i++) {
          children.push({
            children: a[i],
            tagName: "div",
          });
        }
      }

      nodeJSON = [
        {
          attribute: {
            class: "c12a c12a" + (isDanger ? "n" : "p"),
          },
          children: element.create(SVGCheckElementJSON, {
            attribute: {
              height: "16",
              width: "16",
            },
            children: {
              attribute: {
                class: "c12a" + (isDanger ? "n" : "p") + "1",
              },
            },
          }),
          tagName: "div",
        },
        {
          children: children,
          tagName: "div",
        },
      ];
    } else if (isModal) {
      const modalOptions = options as PopupItemModalOptions;

      addStyleIdList.push(17);

      nodeJSON = {
        attribute: {
          class: "c17" + (options.large ? " c17l" : ""),
        },
        children: [
          {
            attribute: {
              class: "c17z",
            },
            children: [
              {
                attribute: {
                  class: "c17z1",
                },
                children: modalOptions.title,
                tagName: "div",
              },
              closeButtonAE,
            ],
            tagName: "div",
          },
          {
            attribute: {
              class: "c17y",
            },
            children: nodeJSON,
            tagName: "div",
          },
        ],
        tagName: "div",
      };
    } else if (isMenu) {
      addStyleIdList.push(18);

    }

    const rootE = this.element = element.create({
      attribute: {
        class: "c11 " + uniqueToken + (isToast ? " c12 c12p" : ""),
      },
      children: nodeJSON,
      on: {
        mousedown: [clickCloseListener, { passive: true, },],
        touchstart: [clickCloseListener, { passive: true, },],
      },
      tagName: "div",
    }) as HTMLDivElement;

    const contentE = rootE.firstChild as HTMLElement;
    const disabledAnimate = false === options.animation;

    if (isMenu) {
      if (this.width) {
        contentE.classList.add("c18w");
      }

      if (!disabledAnimate) {
        contentE.classList.add("c18p");
      }
    } else if (isModal) {
      if (!disabledAnimate) {
        contentE.classList.add("c17p");
      }
    }

    css.load([
      ...addStyleIdList,
      ...optionStyleIdList,
    ])
      .then((addStyleIdList) => {
        css.attach(this, [
          ...PopupItemStyleIdList,
          ...addStyleIdList,
        ], {
          build: true,
        });

        const rootE = this.element!;

        const styleE = this.style;
        styleE.innerHTML = "." + uniqueToken + "{}";
        document.head.appendChild(styleE);

        document.body.appendChild(rootE);

        this.reposition();

        const disabledAnimate = false === options.animation;

        if (isToast) {
          setTimeout(() => {
            if (this.S) this.close();
          }, options.expires || 3000);

          setTimeout(() => {
            rootE.classList.remove("c12p");
          }, 8);
        } else if (isMenu || isModal) {
          if (!disabledAnimate) {
            setTimeout(() => {
              (rootE.firstChild as HTMLDivElement).classList.remove(isMenu ? "c18p" : "c17p");
            }, 8);
          }
        }

        // setTimeout(() => this.emit!("open"), 158); // 未使用

        this.window!.document.attach(rootE);
      })
      .catch((err) => {
        if (this.S) {
          console.error(err);
          this.window!.throw();
        }
      });

    this.on!(this, "destroy", () => {
      const win = this.window!;

      this.closeChildren();
      this.element.remove();
      this.style.remove();
      win.css.build(true);

      win.popup.update();
    });
  }

  reposition(): void {
    if (!(8 & this.feature)) {
      const win = this.window!;

      const styleE = this.style;
      const sheet = styleE.sheet;
      const cssRules = sheet?.cssRules;
      const style = (cssRules![0] as CSSStyleRule).style;

      const widthTarget = this.width;
      const containerWidth = widthTarget ? widthTarget.offsetWidth : null;

      const element = this.element;
      const target = this.target;
      const align = this.align;
      const position = this.position;

      const _innerWidth = win.innerWidth;
      const _innerHeight = win.innerHeight;

      let elWidth = element.offsetWidth;
      const elHeight = element.offsetHeight;

      if (containerWidth && containerWidth > elWidth) elWidth = containerWidth;

      let top, left;

      if (0 === position) {
        left = (_innerWidth / 2) - (elWidth / 2);
        top = (_innerHeight / 2) - (elHeight / 2);

      } else {
        const rect = target.getBoundingClientRect();

        const targetLeft = rect.left - 8;
        const targetTop = rect.top - 8;
        const targetRight = rect.right + 8;
        const targetBottom = rect.bottom + 8;
        const targetWidth = rect.right - rect.left;
        const targetHeight = rect.bottom - rect.top;

        const rightEdge = _innerWidth - 8;
        const leftEdge = 8;
        const topEdge = 8;
        const bottomEdge = _innerHeight - 8;

        const rightSpace = rightEdge - targetRight;
        const bottomSpace = bottomEdge - targetBottom;

        if ((4 === position) ? 4 : ((2 === position) ? 2 : 0)) {
          left = (4 === position && (rightSpace >= elWidth)) ? targetRight : (targetLeft - elWidth);
          top = targetTop + 8 + (targetHeight / 2) - (elHeight / 2);

        } else {
          top = (3 === position && (bottomSpace >= elHeight)) ? targetBottom : (targetTop - elHeight);
          left = targetLeft + 8 + (4 === align ? 0 : ((targetWidth / 2) - (elWidth / 2)));

        }

        left = Math.min(Math.max(left, leftEdge), rightEdge - elWidth);
        top = Math.min(Math.max(top, topEdge), bottomEdge - elHeight);
      }

      style.cssText = "top:" + (scrollY + top) + "px;left:" + (scrollX + left) + "px;" + (containerWidth ? ("width:" + elWidth + "px") : "");
    }
  }

  closeChildren(options?: PopupItemCloseOptions): void {
    if (this.S) {
      const win = this.window!;
      const popup = win.popup;

      let isChild = false;

      for (let i = 0, a = popup.items; a.length > i; i++) {
        let item = a[i];

        if (item && item.S) {
          if (isChild) item.close(options);
          if (this === item) isChild = true;
        }
      }
    }
  }

  close(options?: PopupItemCloseOptions): void {
    if (this.S) {
      const annotation = options ? (options.annotation || 0) : 0;
      /**
       * 0: force close
       * 1: touch close
       * 2: keyboard (ESC)
       * 4: button close
       */
      const feature = this.feature;

      const isTouchClose = 1 & annotation;
      const isKeyboardClose = 2 & annotation;
      const isButtonClose = 4 & annotation;
      const isManualClose = isTouchClose || isKeyboardClose || isButtonClose;

      if (!((isTouchClose && !(1 & feature)) || (isKeyboardClose && !(2 & feature)) || (isButtonClose && !(4 & feature)))) {
        if (isManualClose && "function" === typeof this.confirm) {
          this.confirm({
            source: this.P!,
            target: this,
          });
        } else {
          this.emit!("close", {
            "annotation": annotation,
          });

          this.destroy!();
        }
      }
    }
  }

}
