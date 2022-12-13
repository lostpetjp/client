import { InitOptions, On, Off, Emit, Component } from "../../component"
import { Win } from "../window";
import { CSS, StyleIdList } from "../css";
import { Template } from "../../component/template";
import { Content } from "../../component/content";
import { DocTemplate } from "../../component/0/1/class";
import { ElementJSON } from "../element";
import { ScriptId, ScriptIdList } from "../js";
import { ColorSchemeChange } from "../../component/0/9/class";
import { ReduceMotionChange } from "../../component/0/10/class";
import { SVGDrawerElementJSON } from "../../utils/svg/drawer";
import { OpenDrawer } from "../../component/0/11/class";

export type DocumentOptions = InitOptions & {
  data?: DocumentData
  type: LoadType
}

export type TemplateId = number
export type ContentId = number

/**
 * rendering mode
 * 1=spa
 * 2=ssr
 */
export type Mode = 1 | 2;

type Caches = {
  [key: string]: {
    data: DocumentData
    created_at: number
  }
}

export type ContentData = {
  [key: string]: any
}

export type ComponentData = {
  component: TemplateId | ContentId
  css: StyleIdList
  js: ScriptIdList
}

export type DocumentData = {
  template: ComponentData
  content: ComponentData
  pathname: string
  search: string
  head?: Array<ElementJSON>
  body?: ContentData
}

type DocumentInitOptions = InitOptions & {
}

/**
 * 1: a要素をclick
 * 2: popstate
 * 3: SSR
 * 4: reload
 */
export type LoadType = 1 | 2 | 3 | 4;

export type DocumentLoadOptions = {
  data?: DocumentData
  pathname?: string
  search?: string
  type: LoadType
  scroll?: ScrollToOptions
}

type DocumentPreloadOptions = {
  cache: boolean
  pathname?: string
  search?: string
  data?: DocumentData
}


/**
 * Document Manager
 */
export class DocumentM extends Component {
  mode: Mode = 2
  template?: Template
  private item?: DocumentItem
  flag: number = 0

  static caches: Caches = {}

  header?: HTMLElement
  body?: HTMLDivElement
  main?: HTMLElement
  nav?: HTMLElement
  footer?: HTMLElement

  drawer?: HTMLAnchorElement

  private readonly clickEventListener: EventListener = (event: Event) => {
    const aE = event.currentTarget as HTMLAnchorElement;

    const isSamePage = location.pathname === aE.pathname && location.search === aE.search;
    const isHashChangeOnly = isSamePage && location.hash !== aE.hash;

    if (!isHashChangeOnly) {
      event.preventDefault();

      if (!isSamePage || scrollY) {
        history.pushState(history.state, document.title, aE.pathname + aE.search + aE.hash);

        const scrollOptions = {
          left: 0,
          top: 0,
        };

        if (!isSamePage) {
          this.load({
            scroll: scrollOptions,
            type: 1,
          });
        } else {
          scrollTo(scrollOptions);
        }
      }
    }
  }

  private readonly mouseoverEventListener: EventListener = (event: Event) => {
    const aE = event.currentTarget as HTMLAnchorElement;
    const pathname = aE.pathname;
    const search = aE.search;

    const cacheItem = DocumentM.caches[pathname + search];

    if (!cacheItem || (Date.now() > ((1000 * 60) + cacheItem.created_at))) {
      this.preload({
        cache: true,
        pathname: pathname,
        search: search,
      });
    }
  }

  constructor(options: DocumentInitOptions) {
    const children = document.body.childNodes;
    const headerE = children[0] as HTMLElement;
    const bodyE = children[1] as HTMLElement;
    const bodyChildren = bodyE.childNodes;
    const navE = bodyChildren[1] as HTMLElement;
    const footerE = children[2] as HTMLElement;

    super({
      P: options.P,
      header: children[0],
      body: bodyE,
      main: bodyChildren[0],
      nav: bodyChildren[1],
      footer: children[2],
    });

    [
      headerE,
      navE,
      footerE,
    ].forEach((rootE) => this.attach(rootE as HTMLElement));

    const win = this.P! as Win;

    const resizeEventListener = () => {
      const hasDrawer = !matchMedia("screen and (min-width:1024px)").matches;
      let drawerAE = this.drawer;

      if (hasDrawer) {
        if (!drawerAE) {
          const element = this.window!.element;

          drawerAE = this.drawer = element.create({
            attribute: {
              class: "a2 d1c hb2",
              role: "button",
            },
            children: element.create(SVGDrawerElementJSON, {
              attribute: {
                height: "24",
                width: "24",
              },
            }),
            on: {
              click: [
                (event: MouseEvent | TouchEvent) => {
                  event.preventDefault();

                  this.window!.js.load(11)
                    .then(([constructor]: [typeof OpenDrawer]) => {
                      if (this.S) {
                        new constructor({
                          P: this,
                        });
                      }
                    });
                },
                {
                  passive: false,
                },
              ],
            },
            tagName: "a",
          }) as HTMLAnchorElement;
        }
      }

      const parentNode = drawerAE ? drawerAE.parentNode : null;

      if (hasDrawer && !parentNode) {
        const headerE = this.header!;
        headerE.insertBefore(drawerAE!, headerE.firstChild);

      } else if (!hasDrawer && parentNode) {
        drawerAE!.remove();
      }
    }

    win.css.on!(this, "resize", resizeEventListener);

    resizeEventListener();

    const aEs = navE.getElementsByTagName("a");

    const colorSchemeAE = aEs[aEs.length - 2]!;
    const reduceMotionAE = aEs[aEs.length - 1]!;

    colorSchemeAE.addEventListener("click", (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const aE = event.currentTarget as HTMLAnchorElement;

      this.window!.js.load(9)
        .then(([constructor]: [typeof ColorSchemeChange]) => {
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
        .then(([constructor]: [typeof ReduceMotionChange]) => {
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
  }

  preload(options: DocumentPreloadOptions): Promise<DocumentData> {
    return new Promise((resolve, reject) => {
      (options.data ? Promise.resolve(options.data) : this.getInfo(options.pathname!, /*options.search!,*/ options.cache))
        .then((data) => {
          const win = this.window!;

          if (this.S) {
            const templateData = data.template;
            const contentData = data.content;

            return Promise.all([
              data,
              win.css!.load(Array.from(new Set([...templateData.css, ...contentData.css]))),
              win.js!.load([templateData.component, contentData.component, ...templateData.js, ...contentData.js]),
            ]);
          }
        })
        .then((res) => {
          if (this.S) {
            resolve(res![0]);
          }
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

  reload(options: {
    scroll?: ScrollToOptions
  }): void {
    this.load({
      pathname: location.pathname,
      scroll: options?.scroll || {
        left: scrollX,
        top: scrollY,
      },
      type: 4,
    });
  }

  load(options: DocumentLoadOptions): void {
    const hasUpdate = 1 & this.flag;

    if (options.pathname || options.search) {
      history[(hasUpdate ? "replace" : "push") + "State"](null, document.title, "https://" + location.hostname + (options.pathname || "") + (options.search + ""));
    }

    if (hasUpdate) {
      location.reload();

    } else {
      const oldDocument = this.item;

      let oldSearch = null;
      let oldPathname = null;

      if (oldDocument) {
        if (2 === this.mode) return;

        oldSearch = oldDocument.search;
        oldPathname = oldDocument.pathname;
      }

      const newSearch = location.search;
      const newPathname = location.pathname;

      if (!(oldSearch === newSearch && oldPathname === newPathname)) {
        if (oldDocument && oldDocument.S) oldDocument.destroy!();

        this.item = new DocumentItem({
          P: this,
          ...options,
        }, newPathname, newSearch);
      }
    }
  }

  getInfo(pathname: string, /*search: string,*/ cache: boolean): Promise<DocumentData> {
    const newPathname = pathname;
    // const newSearch = search;
    const cacheKey = newPathname /*+ newSearch*/;
    const cacheItem = DocumentM.caches[cacheKey];
    const data = (cacheItem && (true === cache || ((cacheItem.created_at + (1000 * 10)) > Date.now())) ? cacheItem.data : null);
    if (data) return Promise.resolve(data);

    return new Promise((resolve, reject) => {
      this.window!.fetch({
        body: {
          pathname: newPathname,
          // search: newSearch,
        },
        credentials: false,
        method: "GET",
        path: "document",
      })
        .then((res) => {
          if (res.status) {
            const data = res.body;
            DocumentM.caches[cacheKey] = {
              created_at: Date.now(),
              data: data,
            };

            resolve(data);
          }

          this.window!.throw();
        })
        .finally(reject);
    });
  }

  attach(rootE: HTMLElement = document.body) {
    const canHover = matchMedia("(hover:hover)").matches;
    const hostname = location.hostname;

    // a要素にイベントを設定
    for (let i = 0, a = rootE.getElementsByTagName("a"); a.length > i; i++) {
      let aE = a[i];

      if (aE.hasAttribute("href") && hostname === aE.hostname) {
        aE.addEventListener("click", this.clickEventListener, {
          passive: false,
        });

        if (canHover && !DocumentM.caches[aE.pathname + aE.search]) {
          aE.addEventListener("mouseover", this.mouseoverEventListener, {
            once: true,
            passive: true,
          });
        }
      }
    }
  }
}


export class DocumentItem extends Component {
  content?: Content
  pathname: string = ""
  search: string = ""
  scroll?: ScrollOptions

  P?: DocumentM

  constructor(options: DocumentOptions, newPathname: string, newSearch: string) {
    const documentM = options.P! as DocumentM;

    super({
      P: documentM,
      pathname: newPathname,
      scroll: options.scroll,
      search: newSearch,
    });

    const win = this.window!;
    win.popup.close();
    win.dialog.close();
    win.drawer.close();

    documentM.preload(2 === documentM.mode ? {
      cache: false,
      data: options.data,
    } : {
      cache: 2 === options.type ? true : false,
      pathname: newPathname,
      search: newSearch,
    })
      .then((data) => {
        const win = this.window!;
        const documentM = this.P!;

        if (this.S) {
          const js = win.js!;
          const promises: Array<Promise<void> | DocumentData | void> = [
            data,
          ];

          const templateId = data.template.component;
          let newTemplate: undefined | Template = documentM.template;

          if (newTemplate && newTemplate.S && templateId !== newTemplate.id) {
            newTemplate.destroy!();
          }

          if (!newTemplate || !newTemplate.S) {
            newTemplate = documentM.template = new (js.get(templateId))({
              P: documentM,
            });

            newTemplate = newTemplate!
            newTemplate.id = templateId;
          }

          if (1 > newTemplate.readyState) {
            if ("function" === typeof newTemplate.ready) {
              promises.push(newTemplate.ready());
            }

            newTemplate.readyState = 1;
          }

          const contentId = data.content.component;

          const newContent: Content = this.content = new (js.get(contentId))({
            P: this,
            pathname: data.pathname,
            search: data.search,
          });

          newTemplate!.content = newContent;
          newContent.id = contentId;

          if ("function" === typeof newContent!.ready) {
            promises.push(newContent.ready());
          }

          const me = win.me;
          if (!me.readyState) promises.push(me.update())

          return Promise.all(promises);
        }
      })
      .then((res) => {
        const documentM = this.P!;

        if (this.S) {
          const data = res![0] as DocumentData;

          const isSSR = 2 === documentM.mode;
          const template = documentM.template!;
          const content = this.content!;

          const promises: Array<Promise<void> | DocumentData | void> = [data,];

          if (isSSR) {
            if (2 > template.readyState) {
              promises.push(template.parse());

              template.readyState = 2;
            }

            if ("function" === typeof content.parse) {
              content.parse();
            }

          } else {
            if (2 > template.readyState) {
              promises.push(template.create());

              template.readyState = 2;
            }

            promises.push(content.create(data.body!));
          }

          return Promise.all(promises);
        }
      })
      .then((res) => {
        const doc = this.P!;

        if (this.S) {
          const win = this.window!;
          const css = win.css!;
          const data = res![0] as DocumentData;
          const template = doc.template!;
          const templateE = template.element!;
          const content = this.content!;

          // create template style
          if (3 > template.readyState) {
            if (data.template.css.length) {
              css.attach(template, data.template.css);
            }

            template.readyState = 3;
          }

          // create content style
          if (data.content.css.length) {
            css.attach(content, data.content.css);
          }

          // update style
          css.update();

          css.build();

          // connect content to template
          template.build();

          // connect DOM
          if (4 > template.readyState) {
            if (1 === doc.mode) {
              const mainE = doc.main!;
              templateE.setAttribute("role", "main");
              doc.body!.replaceChild(doc.main = templateE, mainE);
            }

            if ("function" === typeof template.attach) {
              template.attach();
            }

            template.readyState = 4;
          }

          // scroll position
          if (this.scroll) {
            scrollTo(this.scroll);
          }

          // update location
          if (location.pathname !== data.pathname || location.search !== data.search) {
            history.replaceState(history.state, document.title, "https://" + location.hostname + data.pathname + data.search);
          }

          if ("function" === typeof content.attach) {
            content.attach();
          }

          // update document.head
          const head = data.head;

          if (head) {
            head.forEach((entry) => {
              const tagName = entry.tagName;

              if ("title" === tagName) {
                document.title = entry.children;

              } else {
                const attribute = entry.attribute!;

                if ("link" === tagName) {
                  (document.head.querySelector("link[rel='" + attribute.rel + "']") as HTMLLinkElement).href = attribute.href;
                } else if ("meta" === tagName) {
                  (document.head.querySelector("meta[property='" + attribute.property + "']") as HTMLMetaElement).content = attribute.content;
                }
              }
            });
          }

          // clean up
          document.body.replaceChildren(doc.header!, doc.body!, doc.footer!);

          this.P!.emit!("load");

          if (2 === doc.mode) {
            document.head.querySelector("link[href^='/styles/bundle/']")!.remove();
            doc.mode = 1;
          }
        }
      })
      .catch((err) => {
        if (this.S) {
          console.error(err);
          this.window!.throw();
        }
      });
  }
}

/*
Navigation API

declare var navigation: {
  addEventListener: (name: string, callback: CallableFunction, options?: EventListenerOptions) => void
};

    navigation.addEventListener("navigate", (event: {
      destination: {
        url: string
      }
      intercept: CallableFunction
      navigationType: string
    }) => {
      if ("traverse" === event.navigationType) {
        const url = new URL(event.destination.url);

        event.intercept({
          handler: async () => {
            console.log("hello", event, this);
            await this.preload({
              pathname: url.pathname,
              search: url.search,
            })
          }
        });
      }
    });
*/