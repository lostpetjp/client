import { InitOptions, On, Off, Emit, Component } from "../../component"
import { Win } from "../window";
import { CSS, StyleIdList } from "../css";
import { Template } from "../../component/template";
import { Content } from "../../component/content";
import { DocTemplate } from "../../component/0/1/class";
import { ElementJSON } from "../element";
import { ScriptId, ScriptIdList } from "../js";

export type DocumentOptions = InitOptions & {
  data?: DocumentData
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
  [key: string]: DocumentData
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
 */
export type LoadType = 1 | 2 | 3;

export type DocumentLoadOptions = {
  data?: DocumentData
  type: number
  scroll?: ScrollToOptions
}

type DocumentPreloadOptions = {
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

  static caches: Caches = {}

  header?: HTMLElement
  body?: HTMLDivElement
  main?: HTMLElement
  nav?: HTMLElement
  footer?: HTMLElement

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

    if (!DocumentM.caches[pathname + search]) {
      this.preload({
        pathname: pathname,
        search: search,
      });
    }
  }

  constructor(options: DocumentInitOptions) {
    const children = document.body.childNodes;
    const headerE = children[0];
    const bodyE = children[1];
    const bodyChildren = bodyE.childNodes;
    const navE = bodyChildren[1];
    const footerE = children[2];

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
  }

  preload(options: DocumentPreloadOptions): Promise<DocumentData> {
    return new Promise((resolve, reject) => {
      (options.data ? Promise.resolve(options.data) : this.getInfo(options.pathname!, options.search!))
        .then((data) => {
          const win = this.window!;

          if (this.S) {
            const templateData = data.template;
            const contentData = data.content;

            return Promise.all([
              data,
              ...Array.from(new Set([...templateData.css, ...contentData.css])).map((id) => win.css!.load(id)),
              ...[templateData.component, contentData.component, ...templateData.js, ...contentData.js].map((id) => win.js!.load(id)),
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

  load(options: DocumentLoadOptions): void {
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

  getInfo(pathname: string, search: string): Promise<DocumentData> {
    const newPathname = pathname;
    const newSearch = search;
    const cacheKey = newPathname + newSearch;

    const data = DocumentM.caches[cacheKey];
    if (data) return Promise.resolve(data);

    return new Promise((resolve, reject) => {
      this.window!.fetch({
        body: {
          pathname: newPathname,
          search: newSearch,
        },
        credentials: false,
        method: "GET",
        path: "document",
      })
        .then((res) => {
          if (res.status) {
            const data = res.body;
            DocumentM.caches[cacheKey] = data;

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

      if (aE.href && hostname === aE.hostname) {
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

    //(2 === documentM.mode ? Promise.resolve(options.data!) : documentM.getInfo(newPathname, newSearch))
    documentM.preload(2 === documentM.mode ? {
      data: options.data,
    } : {
      pathname: newPathname,
      search: newSearch,
    })
      .then((data) => {
        const win = this.window!;

        if (this.S) {
          const templateData = data.template;
          const contentData = data.content;

          return Promise.all([
            data,
            ...Array.from(new Set([...templateData.css, ...contentData.css])).map((id) => win.css!.load(id)),
            ...[templateData.component, contentData.component, ...templateData.js, ...contentData.js].map((id) => win.js!.load(id)),
          ]);
        }
      })
      .then((res) => {
        const win = this.window!;
        const documentM = this.P!;

        if (this.S) {
          const data = res![0];
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
          }

          if (1 > newTemplate.readyState) {
            if ("function" === typeof newTemplate.ready) {
              promises.push(newTemplate.ready());
            }

            newTemplate.readyState = 1;
          }

          const newContent: Content = this.content = new (js.get(data.content.component))({
            P: this,
          });

          newTemplate!.content = newContent;

          if ("function" === typeof newContent!.ready) {
            promises.push(newContent.ready());
          }

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
          const templateE = doc.main = template.element!;
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

          // SSR => SPA
          if (2 === doc.mode) {
            document.head.querySelectorAll("link[href^='/styles/']").forEach(element => element.remove());
          }

          // connect content to template
          template.build();

          // connect DOM
          if (4 > template.readyState) {
            const mainE = doc.main!;

            if (mainE !== templateE) doc.body!.replaceChild(templateE, mainE);

            template.readyState = 4;
          }

          // scroll position
          if (this.scroll) {
            scrollTo(this.scroll);
          }

          // update location
          history.replaceState(history.state, document.title, "https://" + location.hostname + data.pathname + data.search);

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

          if (2 === doc.mode) {
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