import { Factory } from "../factory"
import { Component } from "../../component"
import { CSS } from "../css"
import { JS } from "../js"
import { DocumentM, DocumentItem } from "../document"
import { Me } from "../me"
import { Json2Node } from "../element"
import { ServerOptions } from "../script"

export type FetchOptions = {
  credentials: boolean
  body?: any
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
    ].forEach((constructor) => {
      this.factory.create(constructor);
    });

    this.css = new CSS({ P: this, });
    this.me = new Me({ P: this, });
    this.js = new JS({ P: this, });
    this.document = new DocumentM({ P: this, data: options.document });

    this.element = new Json2Node;

    // for color-scheme
    matchMedia("(prefers-color-scheme:dark)").addEventListener("change", (event) => {
      const colorMode = localStorage.getItem("t");
      var isDark = "2" === colorMode || ("1" !== colorMode && event.matches);
      document.documentElement.classList.replace(isDark ? "t1" : "t2", isDark ? "t2" : "t1");
      // this.emit!("colorschemechange");  // 必要があれば
    });

    // for resize
    const resizeListener = () => {
      this.innerHeight = innerHeight;
      this.innerWidth = innerWidth;

      this.emit!("resize");
    };

    addEventListener("resize", resizeListener, {
      passive: true,
    });

    // for destroy
    this.on!(this, "destroy", () => {
      removeEventListener("resize", resizeListener);
    });

    this.document.load();
  }

  fetch(options: FetchOptions): Promise<{ [key: string]: any }> {
    let reqBody = options.body;
    if (reqBody) reqBody = JSON.stringify(reqBody);

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
            resolve("undefined" === typeof res.body ? null : res.body);
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

  innerWidth: number = innerHeight
  innerHeight: number = innerWidth

  factory: Factory = new Factory
  version: number = 0

  css?: CSS
  document?: DocumentM
  element?: Json2Node
  me?: Me
  js?: JS
}