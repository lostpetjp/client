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
  }

  load(id: StyleId): Promise<void> {
    if (this.caches[id]) return Promise.resolve();

    const promises = this.promises;
    const promise = promises[id];
    if (promise) return promise;

    return promises[id] = new Promise((resolve, reject) => {
      fetch("/styles/" + id + ".css?v=" + this.window!.version)
        .then((res) => res.text())
        .then((cssText) => {
          if (this.S) {
            let type: StyleType = "global";

            if ("@" === cssText[0]) {
              const char35 = cssText.slice(0, 35);

              let position;

              // hover
              if (char35[8]) { // "h"
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

              cssText.slice(...position);
            }

            this.caches[id] = {
              id: id,
              text: cssText,
              type: type,
            };
          }

          resolve();
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }

          reject();
        })
        .finally(() => {
          if (this.S) {
            this.promises[id] = undefined;
          }
        });
    });
  }

  attach(source: Component, ids: StyleIdList): void {
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

    if (hasChange) this.build();
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

    if (styleE.textContent !== allCSSText) styleE.innerHTML = allCSSText;
  }

  update(): void {
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

    if (requireBuild) this.build();
  }
}

// @media screen and (min-width:360px)
// @media screen and (min-width:480px)
// @media screen and (min-width:768px)
// @media screen and (min-width:1024px
// @media (h