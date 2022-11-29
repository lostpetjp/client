import { Component, InitOptions } from "../..";

type Options = InitOptions & {
  element: HTMLAnchorElement
}

export class ReduceMotionChange extends Component {
  constructor(options: Options) {
    super({
      P: options.P,
    });

    const aE = options.element;

    const win = this.window!;

    const clickEvent = {
      click: [
        (event: MouseEvent | TouchEvent) => {
          event.preventDefault();

          const itemE = (event.currentTarget as HTMLAnchorElement).parentNode! as HTMLDivElement;
          const nodeList = itemE.parentNode!.childNodes;

          localStorage[(nodeList[2] as HTMLDivElement === itemE ? "remove" : "set") + "Item"]("r", nodeList[1] === itemE ? "2" : "1");

          const win = this.window!;

          const reduceMode = localStorage.getItem("r");
          var isReduce = "2" === reduceMode || ("1" !== reduceMode && matchMedia("(prefers-reduced-motion)").matches);
          document.documentElement.classList[isReduce ? "add" : "remove"]("r1");

          win.css.build();

          win.popup.close();
        }, {
          passive: false,
        }],
    };

    const currentValue = localStorage.getItem("r");

    win.popup.create({
      element: {
        attribute: {
          class: "c18",
        },
        children: [
          {
            attribute: {
              class: "c18i",
            },
            children: {
              attribute: {
                class: "a2 c18a" + ("1" === currentValue ? " c18as" : "") + " hb2",
              },
              children: "有効",
              on: clickEvent,
              tagName: "a",
            },
            tagName: "div",
          },
          {
            attribute: {
              class: "c18i",
            },
            children: {
              attribute: {
                class: "a2 c18a" + ("2" === currentValue ? " c18as" : "") + " hb2",
              },
              children: "無効",
              on: clickEvent,
              tagName: "a",
            },
            tagName: "div",
          },
          {
            attribute: {
              class: "c18i",
            },
            children: {
              attribute: {
                class: "a2 c18a" + (!currentValue ? " c18as" : "") + " hb2",
              },
              children: "自動判定",
              on: clickEvent,
              tagName: "a",
            },
            tagName: "div",
          },
        ],
        tagName: "div",
      },
      id: "reduce-motion",
      layer: this,
      target: aE,
      type: "menu",
      on: {
        destroy: () => this.destroy!(),
      },
      P: this,
    });
  }
}