import { Component, InitOptions } from "../..";

export type Grecaptcha = {
  ready: (callback: () => void) => void
  render: (element: HTMLDivElement, options: {
    callback: (code: string) => void,
    "error-callback": () => void,
    "expired-callback": () => void,
    sitekey: string
    size: "compact" | "normal"
    theme: "dark" | "light"
  }) => number
  reset: (id: number) => void
}

declare var grecaptcha: Grecaptcha;

export type RecaptchaOptions = InitOptions & {
  element: HTMLDivElement
}

type RecaptchaValue = null | string
type RecaptchaId = null | number

/**
 * 指定した要素にRecaptchaを配置する
 */
export class Recaptcha extends Component {
  private id: RecaptchaId = null
  private readonly siteKey: string = "${{SITE_KEY}}"

  // value
  private $value: RecaptchaValue = null

  set value(value: RecaptchaValue) {
    this.$value = value;
  }

  get value(): RecaptchaValue {
    return this.$value;
  }

  reset(): void {
    this.value = null;
    if (null !== this.id) grecaptcha.reset(this.id);
  }

  constructor(options: RecaptchaOptions) {
    super({
      P: options.P,
    });

    const element = options.element;

    var scriptE = document.createElement("script");

    this.window!.fetch({
      credentials: true,
      method: "GET",
      path: "recaptcha",
    })
      .then((res) => {
        console.log("res", res);

        return (new Promise<void>((resolve) => {
          scriptE.src = "//www.google.com/recaptcha/api.js";
          document.body.appendChild(scriptE);

          var timeouts = this.T;

          timeouts[0] = setInterval(() => {
            if (this.S) {
              if ("grecaptcha" in self) {
                clearInterval(this.T[0]);
                resolve();
              }
            }
          }, 8);
        }));
      })
      .then(() => {
        if (this.S) {
          grecaptcha.ready(() => {
            if (this.S) {
              var win = this.window!;
              var errorEv = () => (this.value = null);
              console.log({
                callback: (code: string) => (this.value = code),
                "error-callback": errorEv,
                "expired-callback": errorEv,
                sitekey: this.siteKey,
                size: 360 > win.innerWidth ? "compact" : "normal",
                theme: (document.documentElement.classList.contains("t2")) ? "dark" : "light",
              });
              this.id = grecaptcha.render(element, {
                callback: (code) => (this.value = code),
                "error-callback": errorEv,
                "expired-callback": errorEv,
                sitekey: this.siteKey,
                size: 360 > win.innerWidth ? "compact" : "normal",
                theme: (document.documentElement.classList.contains("t2")) ? "dark" : "light",
              });
            }
          });
        }
      })
      .catch((err) => {
        if (this.S) {
          console.error(err);
          this.window!.throw();
        }
      });

    this.on!(this, "destroy", () => {
      this.reset();

      scriptE.remove();
    });
  }
}