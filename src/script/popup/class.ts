import { Component, InitOptions } from "../../component";
import { PopupItem, PopupItemOptions } from "../../component/0/6/class";

export type CloseOptions = {
  annotation?: number
  layer?: Component
}

export class Popup extends Component {
  readonly items: Array<PopupItem> = []
  private count: number = 0

  private readonly pointerdownListener = () => {
    this.close({
      annotation: 1,
    });
  }

  private readonly keyboardListener = (event: KeyboardEvent) => {
    if ("Escape" === event.key) {
      event.preventDefault();

      this.close({
        annotation: 2,
      });
    }
  }

  private readonly repositionListener = () => this.reposition()

  constructor(options: InitOptions) {
    super({
      P: options.P,
    });

    this.on!(this, "destroy", () => {
      this.detach();
    });
  }

  findLayer(target: Component): PopupLayer | void {
    const items = this.items;
    const layerTargets = [];

    for (let i = items.length; i--;) {
      const item = items[i];
      const layer = item.layer;
      if (layer) layerTargets.push(layer.target);
    }

    while (target && target.S) {
      if (-1 !== layerTargets.indexOf(target)) {
        for (let i = items.length; i--;) {
          const item = items[i];
          const layer = item.layer;

          if (layer && target === layer.target) {
            return layer;
          }
        }
      }

      target = target.P!;
    }
  }

  reposition(): void {
    for (let i = 0, a = this.items; a.length > i; i++) {
      let item = a[i];
      if (item && item.S) item.reposition();
    }
  }

  close(options?: CloseOptions): void {
    const annotation = options ? options.annotation : 0;
    const layerHint = options ? options.layer : null;
    const parentLayer = layerHint ? this.findLayer(layerHint) : null;

    const items = this.items;

    for (let i = items.length; i--;) {
      const item = items[i];

      if (item && item.S) {
        if (parentLayer && parentLayer === item.layer) break;

        item.close({
          annotation: annotation,
        });
      }
    }
  }

  detach(): void {
    const pointerdownListener = this.pointerdownListener;
    const repositionListener = this.repositionListener;

    removeEventListener("mousedown", pointerdownListener);
    removeEventListener("touchstart", pointerdownListener);
    removeEventListener("keydown", this.keyboardListener, { "capture": true, });
    removeEventListener("resize", repositionListener);
    removeEventListener("scroll", repositionListener);
  }

  update(): void {
    const oldCount = this.count;

    if (oldCount) {
      for (let a = this.items, i = 0; a.length > i; i++) {
        let item = a[i];
        if (!(item && item.S)) a.splice(i--, 1);
      }
    }

    const newCount = this.count = this.items.length;

    if (!oldCount && newCount) {
      const pointerdownListener = this.pointerdownListener;
      const keyboardListener = this.keyboardListener;
      const repositionListener = this.repositionListener;

      addEventListener("mousedown", pointerdownListener, { "passive": true, });
      addEventListener("touchstart", pointerdownListener, { "passive": true, });

      addEventListener("keydown", keyboardListener, {
        "capture": true,
        "passive": false,
      });

      addEventListener("resize", repositionListener, { "passive": true, });
      addEventListener("scroll", repositionListener, { "passive": true, });

    } else if (oldCount && !newCount) {
      this.detach();
    }
  }

  create(options: PopupItemOptions): Promise<PopupItem> {
    return new Promise((resolve, reject) => {
      const win = this.window!;
      const js = win.js;

      const items = this.items;
      const newId = options.id;

      if (items.length) {
        const parentLayer = this.findLayer(options.P!);

        for (let i = items.length; i--;) {
          const oldItem = items[i];

          if (oldItem && oldItem.S) {
            const oldId = oldItem.id;
            const isSameId = newId && oldId === newId;
            if (parentLayer && parentLayer === oldItem.layer) break;
            oldItem.close();
            if (isSameId) return resolve(oldItem);
          }
        }
      }

      js.load(6)
        .then((constructor: typeof PopupItem) => {
          if (this.S) {
            const isLayer = options.layer;
            const newItem = new constructor(options);
            console.log("isLayer:", options, isLayer);
            if (isLayer) {
              newItem.layer = new PopupLayer({
                P: newItem,
                target: isLayer,
              });
            }

            this.items.push(newItem);

            this.update();

            resolve(newItem);
          }
        })
        .finally(reject);
    });
  }
}

type PopupLayerOptions = {
  P: PopupItem
  target: Component
}

export class PopupLayer extends Component {
  target: Component

  constructor(options: PopupLayerOptions) {
    super({
      P: options.P,
    });

    this.target = options.target;
  }
}

