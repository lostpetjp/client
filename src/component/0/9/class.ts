import { Component, InitOptions } from "../..";

type Options = InitOptions & {
  element: HTMLAnchorElement
}

export class ColorSchemeChange extends Component {
  constructor(options: Options) {
    super({
      P: options.P,
    });

    const aE = options.element as HTMLAnchorElement;

    const win = this.window!;

    const clickEvent = {
      click: [
        (event: MouseEvent | TouchEvent) => {
          event.preventDefault();

          const itemE = (event.currentTarget as HTMLAnchorElement).parentNode! as HTMLDivElement;
          const nodeList = itemE.parentNode!.childNodes;

          localStorage[(nodeList[2] as HTMLDivElement === itemE ? "remove" : "set") + "Item"]("t", nodeList[1] === itemE ? "2" : "1");

          const win = this.window!;

          const colorMode = localStorage.getItem("t");
          var isDark = "2" === colorMode || ("1" !== colorMode && matchMedia("(prefers-color-scheme:dark)").matches);
          document.documentElement.classList.replace(isDark ? "t1" : "t2", isDark ? "t2" : "t1");
          win.css.build();

          win.popup.close();
        }, {
          passive: false,
        }],
    };

    const currentValue = localStorage.getItem("t");

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
              children: "ライト",
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
              children: "ダーク",
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
      id: "color-scheme",
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