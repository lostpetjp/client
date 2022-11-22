import { Component, ComponentList, InitOptions } from "../../component";

export type StyleId = number | string
export type StyleIdList = Array<StyleId>

type CSSText = string

type CacheMap = {
  [key: string]: StyleEntry
}

type StyleEntry = {
  id: StyleId
  text: CSSText
  type: StyleType
}

type MinSize = "360" | "480" | "768" | "1024"
type MinToken = `min${MinSize}`
type StyleType = "global" | "hover" | MinToken;

type PromiseMap = {
  [key: string]: Promise<void> | undefined
}

type IdEntry = {
  expires_at: number
  id: StyleId
  sources: ComponentList
}

type IdEntryList = Array<IdEntry>

type BuildCSSTextMap = {
  [key in StyleType]?: string
}

type AttachOptions = {
  build?: boolean
}

export class CSS extends Component {
  private promises: PromiseMap = {}
  private caches: CacheMap = {}
  private element: HTMLStyleElement = document.createElement("style")
  private entries: IdEntryList = []

  constructor(options: InitOptions) {
    super({
      P: options.P,
    });

    document.head.appendChild(this.element);

    const changeListener: EventListener = () => this.build();

    [
      "360",
      "480",
      "768",
      "1024",
    ].forEach((size) => {
      matchMedia("screen and (min-width:" + size + "px)").addEventListener("change", changeListener, {
        passive: true,
      });
    });
  }

  load(ids: StyleId | StyleIdList): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(ids)) ids = [ids];

      Promise.all(ids.map((id) => {
        if (!this.caches[id]) {
          const promises = this.promises;
          const promise = promises[id];

          return promise ? promise : (promises[id] = new Promise((resolve, reject) => {
            fetch("/styles/" + id + ".css?v=" + this.window!.version)
              .then((res) => res.text())
              .then((cssText) => {
                if (this.S) {
                  let type: StyleType = "global";

                  if ("@" === cssText[0]) {
                    const char35 = cssText.slice(0, 35);

                    let position;

                    // hover
                    if ("h" === char35[8]) { // "h"
                      type = "hover";
                      position = [21, -1,];

                    } else {
                      const size = parseInt(char35.slice(-6), 10);

                      switch (size) {
                        case 360:
                        case 480:
                        case 768:
                          position = [36, -1,];
                          break;

                        default:
                          // case 1024:
                          position = [37, -1,];
                          break;
                      }

                      type = (("i" === char35[20] ? "min" : "max") + size) as StyleType;
                    }

                    cssText = cssText.slice(...position);
                  }

                  this.caches[id] = {
                    id: id,
                    text: cssText,
                    type: type,
                  };
                }

                resolve();
              })
              .catch(reject)
              .finally(() => {
                if (this.S) {
                  this.promises[id] = undefined;
                }
              });
          }));
        }
      }))
        .then(() => resolve())
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }

          reject();
        })
    });
  }

  attach(source: Component, ids: StyleId | StyleIdList, options: AttachOptions | null = null): void {
    if (!Array.isArray(ids)) ids = [ids];

    let hasChange = false;

    ids.forEach((id) => {
      for (let i = 0, a = this.entries; a.length > i; i++) {
        let entry = a[i];

        if (id === entry.id) {
          entry.expires_at = 0;
          entry.sources.push(source);
          return;
        }
      }

      this.entries.push({
        expires_at: 0,
        id: id,
        sources: [source,],
      });

      hasChange = true;
    });

    if (hasChange && (options && true === options.build)) this.build();
  }

  build(): void {
    const styleE = this.element;

    const textMap: BuildCSSTextMap = {};

    this.entries.forEach((entry) => {
      const cacheEntry = this.caches[entry.id];

      if (cacheEntry) {
        const type = cacheEntry.type;
        if ("string" !== typeof textMap[type]) textMap[type] = "";
        textMap[type] += cacheEntry.text;
      }
    });

    let allCSSText = "";

    for (let a = [
      ["global", ""],
      ["min360", "screen and (min-width:360px)",],
      ["min480", "screen and (min-width:480px)",],
      ["min768", "screen and (min-width:768px)",],
      ["min1024", "screen and (min-width:1024px)",],
      ["hover", "(hover:hover)"],
    ], i = 0; a.length > i; i++) {
      let entry = a[i];
      let type: StyleType = entry[0] as StyleType;
      let cssTextOrUndefined = textMap[type];

      if ("string" === typeof cssTextOrUndefined) {
        let cssText: CSSText = cssTextOrUndefined;
        let mediaQuery = entry[1];
        if (mediaQuery && !matchMedia(mediaQuery).matches) continue;
        allCSSText += (mediaQuery ? "@media " + mediaQuery + "{" : "") + cssText + (mediaQuery ? "}" : "");
      }
    }

    if (styleE.textContent !== allCSSText) {
      styleE.innerHTML = allCSSText;
    } else {
      console.log("skip");
    }
  }

  update(options: AttachOptions | null = null): void {
    const now = Date.now();
    let requireBuild = false;

    this.entries = this.entries.filter((entry) => {
      entry.sources = entry.sources.filter((instance) => instance && instance.S);

      if (!entry.sources.length) {
        if (!entry.expires_at) {
          entry.expires_at = now + (10 * 1000);

        } else if (now > entry.expires_at) {
          requireBuild = true;
          return false;
        }
      }

      return true;
    });

    if (requireBuild && (options && true === options.build)) this.build();
  }
}

// @media screen and (min-width:360px)
// @media screen and (min-width:480px)
// @media screen and (min-width:768px)
// @media screen and (min-width:1024px
// @media (h