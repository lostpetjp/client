import { Component, InitOptions } from "../..";
import { SVGCloseElementJSON } from "../../../utils/svg/close";

type Options = InitOptions & {
  content: any
}

export class TopMessage extends Component {
  element: HTMLDivElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    win.css.attach(this, [32, 33,], {
      build: true,
    });

    const rootE = this.element = element.create({
      attribute: {
        class: "c32w c33",
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

    this.on!(this, "destroy", () => {
      this.element.remove();
    });
  }
}