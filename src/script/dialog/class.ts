import { Component, InitOptions } from "../../component";
import { DialogItem, DialogItemOptions } from "../../component/0/5/class";

type DialogOptions = InitOptions & {
};

export class Dialog extends Component {
  private readonly items: Array<DialogItem> = []

  constructor(options: DialogOptions) {
    super({
      P: options.P,
    });
  }

  /**
   * Create dialog.
   */
  create(options: DialogItemOptions): Promise<DialogItem> {
    this.close();

    return new Promise((resolve, reject) => {
      const win = this.window!;
      const js = win.js!;

      js.load(5)
        .then(([constructor]: [typeof DialogItem]) => {
          var newItem = new constructor(options);

          this.items.push(newItem);

          resolve(newItem);
        })
        .finally(reject);
    });
  }

  close() {
    for (var i = 0, a = this.items; a.length > i; i++) {
      a[i].close();
      this.items.splice(i--, 1);
    }
  }
}