import { Component, InitOptions } from "../.."
import { Dragger, DraggerEvent, PointerPosition } from "../19/class"

type Options = InitOptions & {
  value: number
}

export type SliderEvent = {
  value: number
}

export class Slider extends Component {
  element: HTMLDivElement
  body: HTMLDivElement
  pointer: HTMLAnchorElement
  disabled: boolean = false
  readyState: number = 0
  marginLeft: number = 0

  $value: number = 0

  set value(value: number) {
    const oldValue = this.$value;
    const newValue = Math.min(1, Math.max(0, ((value))));

    if (oldValue !== newValue) {
      this.$value = newValue;

      this.emit!("change", {
        value: newValue,
      } as SliderEvent);
    }

    this.update();
  }

  get value() {
    return this.$value;
  }

  update(): void {
    var oldValue = this.marginLeft;
    var newValue = (this.value * 100);

    if (oldValue !== newValue) {
      this.marginLeft = newValue;
      this.pointer.style.marginLeft = newValue + "%";
    }
  }

  dragStart: (event: DraggerEvent) => void = (event: DraggerEvent): void => {
    if (this.S) {
      if (this.disabled) {
        this.dragEnd();
      } else {
        this.pointer.classList.add("c28c");
        this.readyState |= 1;
        this.drag(event);
      }
    }
  }

  drag: (event: DraggerEvent) => void = (event: DraggerEvent): void => {
    if (this.S) {
      if (this.disabled || !(1 & this.readyState)) {
        return this.dragEnd();

      } else {
        const rect = this.body.getBoundingClientRect();
        const rectLeft = rect.left;
        const width = rect.right - rectLeft;
        const pointer = this.getPosition(event.originalEvent)!;
        this.value = ((pointer.clientX - 20 - rectLeft) / width);
      }
    }
  }

  dragEnd: () => void = (): void => {
    if (this.S) {
      this.readyState &= ~1;
      this.pointer.classList.remove("c28c");
    }
  }

  getPosition(event: MouseEvent | TouchEvent): void | PointerPosition {
    if (event) {
      const changedTouches = !(event instanceof MouseEvent) ? event.changedTouches : null;
      const position = changedTouches ? (changedTouches[0] as Touch) : (event as MouseEvent);

      return {
        type: changedTouches ? "touch" : "mouse",
        clientX: position.clientX,
        clientY: position.clientY,
        pageX: position.pageX,
        pageY: position.pageY,
      };
    }
  }

  constructor(options: Options) {
    super({
      on: options.on,
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;
    const css = win.css;
    const js = win.js;

    css.attach(this, [28,], {
      build: true,
    });

    this.element = element.create({
      children: this.body = element.create({
        attribute: {
          class: "c28b",
        },
        children: this.pointer = element.create({
          attribute: {
            class: "c28a",
            role: "button",
          },
          tagName: "a",
        }) as HTMLAnchorElement,
        tagName: "div",
      }) as HTMLDivElement,
      tagName: "div",
    }) as HTMLDivElement;

    new (js.get(19) as typeof Dragger)({
      handle: this.element,
      threshold: 0,
      on: {
        dragstart: this.dragStart,
        drag: this.drag,
        dragend: this.dragEnd,
      },
      P: this,
    });

    this.value = options.value;
  }

  static convert(options: {
    value: number
    min: number
    max: number
    op: number
  }) {
    const rawValue = options.value;
    const min = options.min;
    const max = options.max;
    const op = options.op; // 1=to, 2=from

    const count = max - min + 1;
    const unit = 1 / count;

    if (1 !== op) {
      let value;

      if (unit > rawValue) {
        value = 0;
      } else {
        for (let i = 0; (count - 1) > i; i++) {
          const min = unit * i;
          const max = min + unit;

          if (max > rawValue && rawValue >= min) {
            value = i;
            break;
          }
        }
      }

      if ("number" !== typeof value) {
        return options.max;
      }

      return value + options.min;
    } else {
      if (rawValue >= max) {
        return 1;
      } else if (min >= rawValue) {
        return 0;
      } else {
        return (unit * (rawValue - min)) + (unit / 2);
      }
    }
  }
}