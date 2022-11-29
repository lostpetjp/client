import { Component, InitOptions } from "../..";
import { ReduceMotionChange } from "../10/class";
import { DrawerItemLeft } from "../8/class";
import { ColorSchemeChange } from "../9/class";

type Options = InitOptions & {
}

export class OpenDrawer extends Component {
  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const doc = win.document;
    const element = win.element;

    const navE = doc.nav!;
    const children = [];

    for (let a = navE.firstChild!.childNodes, i = 1; a.length > i; i++) {
      const itemE = a[i];
      children.push(itemE.cloneNode(true));
    }

    const rootE = element.create({
      attribute: {
        class: "",
      },
      children: children,
      tagName: "div",
    }) as HTMLDivElement;

    const aEs = rootE.getElementsByTagName("a");
    const colorSchemeAE = aEs[aEs.length - 2]! as HTMLAnchorElement;
    const reduceMotionAE = aEs[aEs.length - 1]! as HTMLAnchorElement;

    colorSchemeAE.addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const aE = event.currentTarget as HTMLAnchorElement;

      this.window!.js.load(9)
        .then((constructor: typeof ColorSchemeChange) => {
          if (this.S) {
            new constructor({
              P: this,
              element: aE,
            });
          }
        });
    }, {
      passive: false,
    });

    reduceMotionAE.addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const aE = event.currentTarget as HTMLAnchorElement;

      this.window!.js.load(10)
        .then((constructor: typeof ReduceMotionChange) => {
          if (this.S) {
            new constructor({
              P: this,
              element: aE,
            });
          }
        });
    }, {
      passive: false,
    });

    for (let a = [
      colorSchemeAE,
      reduceMotionAE,
    ], i = 0; a.length > i; i++) {
      for (let aa = [
        "mousedown",
        "touchstart",
      ], ii = 0; aa.length > ii; ii++) {
        const name = aa[ii] as "mousedown" | "touchstart";

        a[i].addEventListener(name, (event: MouseEvent | TouchEvent) => event.stopPropagation(), { passive: true });
      }
    }

    win.js.load(8)
      .then((constructor: typeof DrawerItemLeft) => {
        new constructor({
          on: {
            destroy: () => this.destroy!(),
          },
          P: this,
          element: rootE,
          title: "メニュー",
        })
      })
  }
}