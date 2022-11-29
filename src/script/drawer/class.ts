import { Component, InitOptions } from "../../component";
import { DrawerItemFullpage, DrawerItemFullpageOptions } from "../../component/0/7/class";
import { DrawerItemLeft, DrawerItemLeftOptions } from "../../component/0/8/class";

type DrawerOptions = InitOptions & {

}

export type DrawerCloseOptions = {
  annotation: number
}

export type DrawerItemOptions = (DrawerItemFullpageOptions | DrawerItemLeftOptions) & {
  type?: 1 | 2
}

export class Drawer extends Component {
  private readonly items: Array<DrawerItemFullpage | DrawerItemLeft> = []

  constructor(options: DrawerOptions) {
    super({
      P: options.P,
    });
  }

  close(options?: DrawerCloseOptions): void {
    for (let i = 0, a = this.items; a.length > i; i++) {
      const item = a[i];

      if (item && item.S) {
        item.close(options);
      }
    }
  }

  update(): void {
    const items = this.items;

    if (items.length) {
      for (let i = 0, a = this.items; a.length > i; i++) {
        const item = a[i];

        if (!(item && item.S)) items.splice(i--, 1);
      }
    }
  }

  create(options: DrawerItemOptions): Promise<DrawerItemFullpage | DrawerItemLeft> {
    return new Promise((resolve, reject) => {
      const win = this.window!;

      win.popup.close({
        layer: options.P as Component,
      });

      const isLeft = 2 === options.type;
      if (isLeft) this.close();

      win.js.load(isLeft ? 8 : 7)
        .then((constructor: typeof DrawerItemFullpage | typeof DrawerItemLeft) => {
          const newItem = new constructor(options);

          this.items.push(newItem);

          resolve(newItem);
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }
        })
        .finally(reject);
    });
  }
}



