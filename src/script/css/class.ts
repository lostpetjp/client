import { Component, ComponentList, InitOptions } from "../../component";

export type StyleId = number | string
export type StyleIdList = Array<StyleId>

type CSSText = string

type CacheMap = {
  [key: string]: CacheEntry
}

type CacheEntry = {
  id: StyleId
  styles: StyleEntryList
}

type StyleEntry = {
  text: CSSText
  type: StyleType
}

type StyleEntryList = Array<StyleEntry>

type MinSize = "360" | "480" | "768" | "1024"
type MinToken = `min${MinSize}`
type StyleType = "global" | "hover" | MinToken | "light" | "dark" | "hover:light" | "hover:dark";

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

type DefaultCSSEntryPosition = [number, number];

type DefaultCSSEntry = {
  id: StyleId
  position: DefaultCSSEntryPosition
  type: StyleType
}

export type DefaultCSSEntryList = Array<DefaultCSSEntry>

export type CSSOptions = InitOptions & {
  default: DefaultCSSEntryList
};

export class CSS extends Component {
  private promises: PromiseMap = {}
  private caches: CacheMap = {}
  private element: HTMLStyleElement = document.head.getElementsByTagName("style")[0]
  private entries: IdEntryList = []

  constructor(options: CSSOptions) {
    super({
      P: options.P,
    });

    const changeListener: EventListener = () => this.build();

    const cssText = this.element!.textContent;

    options.default.forEach((entry) => {
      const start = entry.position[0];
      const end = start + entry.position[1];
      const id = entry.id;
      const type = entry.type;

      if (!this.caches[id]) {
        this.caches[id] = {
          id: id,
          styles: [],
        };
      }

      this.caches[id].styles.push({
        text: cssText!.slice(start, end),
        type: type,
      });
    });

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
          this.caches[id] = {
            id: id,
            styles: [],
          };

          const promises = this.promises;
          const promise = promises[id];

          return promise ? promise : (promises[id] = new Promise((resolve, reject) => {
            fetch("/styles/" + id + ".css?v=" + this.window!.version)
              .then((res) => res.text())
              .then((cssText) => {
                if (this.S) {
                  const blockPositions: Array<number> = [];

                  [
                    "@media screen and (min-width:360px){",
                    "@media screen and (min-width:480px){",
                    "@media screen and (min-width:768px){",
                    "@media screen and (min-width:1024px){",
                    "@media (hover:hover) and (prefers-color-scheme:light){",
                    "@media (hover:hover) and (prefers-color-scheme:dark){",
                    "@media (prefers-color-scheme:light){",
                    "@media (prefers-color-scheme:dark){",
                    "@media (hover:hover){",
                  ].forEach((prefix: string) => {
                    const position = cssText.indexOf(prefix);
                    if (-1 !== position) blockPositions.push(position);
                  });

                  blockPositions.sort();

                  const cssTextList: Array<CSSText> = [];

                  if (blockPositions.length) {
                    if (blockPositions[0]) cssTextList.push(cssText.slice(0, blockPositions[0]));

                    blockPositions.forEach((position, index) => {
                      const sliceOptions = [position];
                      if ((1 + index) !== blockPositions.length) sliceOptions.push(blockPositions[1 + index]);
                      cssTextList.push(cssText.slice(...sliceOptions));
                    });
                  } else {
                    cssTextList.push(cssText);
                  }

                  cssTextList.forEach((cssText) => {
                    let type: StyleType = "global";

                    if ("@" === cssText[0]) {
                      const char35 = cssText.slice(0, 35);

                      let position;

                      if ("h" === char35[8]) {
                        // @media (hover:hover) and (prefers-color-scheme:light)
                        let start = 21;

                        if ("(" === char35[25]) {

                          if ("l" === cssText[47]) {
                            type = "hover:light";
                            start = 54;
                          } else {
                            type = "hover:dark";
                            start = 53;
                          }
                        } else {
                          type = "hover";
                        }

                        position = [start, -1,];
                      } else if ("p" === char35[8]) {
                        if ("l" === char35[29]) {
                          type = "light";
                          position = [36, -1,];

                        } else {
                          type = "dark";
                          position = [35, -1,];

                        }
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

                    this.caches[id].styles.push({
                      text: cssText,
                      type: type,
                    });
                  });
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
        cacheEntry.styles.forEach((entry) => {
          const type = entry.type;
          if ("string" !== typeof textMap[type]) textMap[type] = "";
          textMap[type] += entry.text;
        });
      }
    });

    const isDark = document.documentElement.classList.contains("t2");

    let allCSSText = "";

    for (let a = [
      ["global", ""],
      ["min360", "screen and (min-width:360px)",],
      ["min480", "screen and (min-width:480px)",],
      ["min768", "screen and (min-width:768px)",],
      ["min1024", "screen and (min-width:1024px)",],
      ["hover", "(hover:hover)"],
      ["light", !isDark],
      ["dark", isDark],
      ["hover:light", isDark ? false : "(hover:hover)"],
      ["hover:dark", !isDark ? false : "(hover:hover)"],
    ], i = 0; a.length > i; i++) {
      let entry = a[i];
      let type: StyleType = entry[0] as StyleType;
      let cssTextOrUndefined = textMap[type];

      if ("string" === typeof cssTextOrUndefined) {
        let cssText: CSSText = cssTextOrUndefined;
        let mediaQuery = entry[1];

        if ("boolean" === typeof mediaQuery ? mediaQuery : !(mediaQuery && !matchMedia(mediaQuery).matches)) {
          allCSSText += cssText;
        }
      }
    }

    if (styleE.textContent !== allCSSText) {
      styleE.innerHTML = allCSSText;
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