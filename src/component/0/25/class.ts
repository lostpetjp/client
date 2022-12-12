import { Component, InitOptions } from "../..";
import { SVGCloseElementJSON } from "../../../utils/svg/close";

type Options = InitOptions & {
  content: any
  expires?: number
  type: "infomation" | "warning" | "positive" | "negative"
}

export class TopMessage extends Component {
  element: HTMLDivElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    const type = options.type;
    const styleId = "warning" === type ? 32 : ("infomation" === type ? 39 : ("positive" === type ? 40 : 41));

    win.css.attach(this, [styleId, 33,], {
      build: true,
    });

    const rootE = this.element = element.create({
      attribute: {
        class: "c" + styleId + " c33 c33p",
      },
      children: [
        {
          children: options.content,
          tagName: "div",
        },
        {
          attribute: {
            class: "a2 c33a",
            role: "button",
          },
          children: element.create(SVGCloseElementJSON, {
            attribute: {
              height: "12",
              width: "12",
            },
            children: {
              attribute: {
                fill: "#111",
              },
            },
          }),
          on: {
            click: [
              (event: Event) => {
                event.preventDefault();
                this.destroy!();
              },
              {
                passive: false,
              },
            ],
            mousedown: [(event: Event) => event.stopPropagation(), { passive: true, },],
            touchstart: [(event: Event) => event.stopPropagation(), { passive: true, },],
          },
          tagName: "a",
        },
      ],
      tagName: "div",
    }) as HTMLDivElement;

    document.body.insertBefore(rootE, document.body.firstChild);

    setTimeout(() => this.element.classList.remove("c33p"), 8);

    if (options.expires) {
      setTimeout(() => this.destroy!(), options.expires);
    }

    this.on!(this, "destroy", () => {
      this.element.remove();
    });
  }
}