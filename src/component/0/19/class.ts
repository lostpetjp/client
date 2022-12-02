import { Component, InitOptions } from "../..";

type Options = InitOptions & {
  handle: HTMLElement
  threshold?: number
}

export type PointerPosition = {
  type: "touch" | "mouse"
  clientX: number,
  clientY: number,
  pageX: number,
  pageY: number,
}

export type DraggerEvent = PointerPosition & {
  originalEvent: MouseEvent | TouchEvent
  metaKey: boolean
  shiftKey: boolean
  origin?: PointerPosition
  moveX?: number
  moveY?: number
}

export class Dragger extends Component {
  disabled: boolean = false
  handle: HTMLElement
  threshold: number = 3
  readyState: 0 | 1 = 0
  origin: PointerPosition | null = null

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

  dispatch(name: string, event: MouseEvent | TouchEvent): void {
    const nowPosition = this.getPosition(event);

    if (nowPosition) {
      const response: DraggerEvent = {
        ...{
          originalEvent: event,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
        },
        ...nowPosition,
      };

      let origin = null;

      if ("dragstart" === name) {
        origin = this.origin = nowPosition;

      } else if ("drag" === name) {
        origin = this.origin;

        if (origin) {
          var moveX = nowPosition.clientX - origin.clientX;
          var moveY = nowPosition.clientY - origin.clientY;

          if (!(2 & this.readyState)) {
            var threshold = this.threshold;

            if ("number" === typeof threshold && threshold > Math.abs(moveX) && threshold >= Math.abs(moveY)) {
              return;
            }

            this.readyState |= 2;
          }

          response.moveX = moveX;
          response.moveY = moveY;
        }
      }

      this.emit!(name, {
        ...response,
        origin: origin,
      });
    }
  }

  dragStart: (event: MouseEvent | TouchEvent) => void = (event: MouseEvent | TouchEvent): void => {
    const isMouse = event instanceof MouseEvent;

    if (this.S && !(isMouse && 2 === event.button) && !this.disabled) {
      // this.emit!("pointerdown");  // 未使用

      if (!(1 & this.readyState)) {
        addEventListener(isMouse ? "mousemove" : "touchmove", this.drag, {
          passive: true,
        });

        event.preventDefault();
        event.stopPropagation();

        this.readyState |= (1 | (this.threshold ? 0 : 2));

        this.dispatch("dragstart", event);
      }

      addEventListener("mouseup", this.dragEnd, {
        passive: true,
        once: true,
      });

      addEventListener("touchend", this.dragEnd, {
        passive: true,
        once: true,
      });
    }
  }

  drag: (event: MouseEvent | TouchEvent) => void = (event: MouseEvent | TouchEvent): void => {
    if (this.S) {
      if (this.disabled || !(1 & this.readyState)) {
        return this.dragEnd(event);
      }

      this.dispatch("drag", event);
    }
  }

  dragEnd: (event: MouseEvent | TouchEvent) => void = (event: MouseEvent | TouchEvent): void => {
    if (this.S) {
      this.dispatch("dragend", event);

      removeEventListener("mousemove", this.drag);
      removeEventListener("touchmove", this.drag);

      removeEventListener("mouseup", this.dragEnd);
      removeEventListener("touchend", this.dragEnd);

      this.readyState = 0;

      this.origin = null;
    }
  }

  constructor(options: Options) {
    super({
      on: options.on,
      P: options.P,
    });

    const handleE = this.handle = options.handle;

    if ("number" === typeof options.threshold) {
      this.threshold = options.threshold;
    }

    handleE.addEventListener("mousedown", this.dragStart, {
      passive: false,
    });
    handleE.addEventListener("touchstart", this.dragStart, {
      passive: false,
    });

    this.on!(this, "destroy", () => {
      const handleE = this.handle;
      handleE.removeEventListener("mousedown", this.dragStart);
      handleE.removeEventListener("touchstart", this.dragStart);

      removeEventListener("mousemove", this.drag);
      removeEventListener("touchmove", this.drag);

      removeEventListener("mouseup", this.dragEnd);
      removeEventListener("touchend", this.dragEnd);
    });
  }
}