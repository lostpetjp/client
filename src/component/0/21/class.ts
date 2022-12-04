import { Component, InitOptions } from "../..";
import { Slider, SliderEvent } from "../20/class";
import { PopupItem } from "../6/class";

type Options = InitOptions & {
  element: HTMLDivElement
  defaultValue: number
  value: number
  max: number
  min: number
  target: HTMLElement
  title: string
  id: string
}

export class SliderModal extends Component {
  element: HTMLDivElement
  max: number
  min: number
  value: number = 0
  popup?: PopupItem

  constructor(options: Options) {
    const value = options.value;

    super({
      on: options.on,
      P: options.P,
    });

    this.value = value;
    this.max = options.max;
    this.min = options.min;

    const win = this.window!;
    const js = win.js;
    const css = win.css;
    const element = win.element;
    const SliderC = js.get(20) as typeof Slider;

    this.element = element.create({
      attribute: {
        class: "c29",
      },
      children: [
        options.element,
        (new SliderC({
          on: {
            change: (event: SliderEvent) => {
              const win = this.window!;
              const js = win.js;
              const SliderC = js.get(20) as typeof Slider;

              this.emit!("change", {
                value: this.value = SliderC.convert({
                  max: this.max,
                  min: this.min,
                  op: 2,
                  value: event.value,
                }),
              } as SliderEvent);
            },
          },
          P: this,
          value: SliderC.convert({
            max: this.max,
            min: this.min,
            op: 1,
            value: value,
          }),
        })).element,
        {
          attribute: {
            class: "c4w",
          },
          children: [
            {
              attribute: {
                class: "a3 c4 hb2",
              },
              children: "閉じる",
              on: {
                click: [
                  (event: Event) => {
                    event.preventDefault();

                    this.popup!.close({
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
                class: "a3 c4 ht1",
              },
              children: "決定",
              on: {
                click: [
                  (event: Event) => {
                    event.preventDefault();

                    this.emit!("update", {
                      value: this.value,
                    } as SliderEvent);
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
          ],
          tagName: "div",
        },
      ],
      on: {
        mousedown: [(event: Event) => event.stopPropagation(), { passive: true, }],
        touchstart: [(event: Event) => event.stopPropagation(), { passive: true, }],
      },
      tagName: "div",
    }) as HTMLDivElement;

    css.attach(this, [4, 29,], {
      build: true,
    });

    win.popup.create({
      element: this.element,
      id: "c21-" + options.id,
      type: "modal",
      on: {
        destroy: () => this.destroy!(),
      },
      P: this,
      target: options.target,
      position: 3,
      title: options.title,
    })
      .then((popupItem: PopupItem) => {
        if (this.S) {
          this.popup = popupItem;
        }
      })
      .catch((err) => {
        if (this.S) {
          console.error(err);
          this.window!.throw();
        }
      });
  }
}
