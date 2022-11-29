import { Factory } from "../factory"
import { Component } from "../../component"
import { CSS } from "../css"
import { JS } from "../js"
import { DocumentM, DocumentItem } from "../document"
import { Me } from "../me"
import { Json2Node } from "../element"
import { ServerOptions } from "../script"
import { Dialog } from "../dialog"
import { Popup, PopupLayer } from "../popup"
import { Drawer } from "../drawer"

export type FetchOptions = {
  credentials: boolean
  body?: { [key: string]: any } | FormData
  method: "GET" | "POST" | "PATCH" | "PUT"
  path: string
  priority?: "high" | "low" | "auto"
};

export class Win extends Component {
  constructor(options: ServerOptions) {
    super({
      P: null,
    });

    Object.setPrototypeOf(Factory.prototype, {
      window: this,
    });

    [
      CSS,
      Me,
      JS,
      Json2Node,
      DocumentM,
      DocumentItem,
      Dialog,
      Drawer,
      Popup,
      PopupLayer,
    ].forEach((constructor) => {
      this.factory.create(constructor);
    });

    this.css = new CSS({ P: this, default: options.css });
    this.me = new Me({ P: this, });
    this.js = new JS({ P: this, });
    this.drawer = new Drawer({ P: this });
    this.dialog = new Dialog({ P: this });
    this.popup = new Popup({ P: this });
    this.element = new Json2Node;
    this.document = new DocumentM({ P: this });

    // for popstate
    addEventListener("popstate", (event) => {
      event.preventDefault();

      this.document!.load({
        type: 2,
      });
    }, {
      passive: false,
    })

    this.css.attach(this, 3);

    // for reduce-motion
    matchMedia("(prefers-reduced-motion)").addEventListener("change", (event: MediaQueryListEvent) => {
      const reduceMode = localStorage.getItem("r");
      var isReduce = "2" === reduceMode || ("1" !== reduceMode && event.matches);
      document.documentElement.classList[isReduce ? "add" : "remove"]("r1");
      this.css.build();
    }, {
      passive: true,
    });

    // for color-scheme
    matchMedia("(prefers-color-scheme:dark)").addEventListener("change", (event: MediaQueryListEvent) => {
      const colorMode = localStorage.getItem("t");
      var isDark = "2" === colorMode || ("1" !== colorMode && event.matches);
      document.documentElement.classList.replace(isDark ? "t1" : "t2", isDark ? "t2" : "t1");
      this.css.build();
    }, {
      passive: true,
    });

    // for resize
    const resizeListener = () => {
      this.innerHeight = innerHeight;
      this.innerWidth = innerWidth;

      // this.emit!("resize"); // 未使用
    };

    addEventListener("resize", resizeListener, {
      passive: true,
    });

    // for destroy
    this.on!(this, "destroy", () => {
      removeEventListener("resize", resizeListener);
    });

    this.document.load({
      data: options.document,
      type: 3,
    });
  }

  fetch(options: FetchOptions): Promise<{ [key: string]: any }> {
    let reqBody: any = options.body;

    if (reqBody) {
      if (reqBody instanceof FormData) {
        const object = {};
        reqBody.forEach((value, key) => object[key] = value);
        reqBody = object;
      }

      reqBody = JSON.stringify(reqBody);
    }

    const credentials = options.credentials;
    const method = options.method;
    const priority = options.priority;
    let pathname = "/api/p" + (credentials ? "rivate" : "ublic") + "/" + options.path;

    const requestOptions: {
      headers: HeadersInit
      priority: "high" | "low" | "auto"
    } & RequestInit = {
      cache: "default",
      credentials: credentials ? "same-origin" : "omit",
      headers: {
        "x-csrf-token": location.hostname,
      },
      keepalive: false,
      method: method,
      mode: "same-origin",
      priority: priority || "auto",
      redirect: "error",
      referrer: "about:client",
      referrerPolicy: "same-origin",
    };

    // GET
    if ("GET" === method) {
      if (reqBody) pathname += "?v=" + encodeURIComponent(reqBody);
      if (!credentials) pathname += (reqBody ? "&" : "?") + "a=" + this.version;

      // POST, PATCH, PUT
    } else {
      requestOptions.headers["Content-Type"] = "application/json;charset=utf-8";
      if (reqBody) requestOptions.body = reqBody;
    }

    return new Promise((resolve, reject) => {
      fetch(pathname, requestOptions)
        .then((res: Response) => {
          const status = res.ok ? res.status : null;

          if (200 === status) {
            return res.json();
          }

          this.throw();
        })
        .then((res) => {
          if (this.S) {
            resolve("undefined" === typeof res.body ? {} : res.body);
          }
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.throw();
          }
        })
        .finally(reject);
    });
  }

  /**
   * メッセージを残してアプリを強制終了する
   */
  throw(): void {

  }

  innerHeight: number = innerHeight
  innerWidth: number = innerWidth

  factory: Factory = new Factory
  version: number = 0

  css: CSS
  dialog: Dialog
  drawer: Drawer
  document: DocumentM
  element: Json2Node
  me: Me
  js: JS
  popup: Popup
}