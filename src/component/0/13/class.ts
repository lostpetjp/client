import { Component, InitOptions } from "../..";
import { Recaptcha } from "../3/class";

export type FromValidityManagerOptions = InitOptions & {
  form: HTMLFormElement
  button: HTMLButtonElement
  submit: (formData: FormData) => Promise<void>
  items: Array<{
    type: "text" | "recaptcha"
    input: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
  }>
};

export class FromValidityManager extends Component {
  form: HTMLFormElement
  button: HTMLButtonElement
  readonly items: Array<ValidityManager> = []
  submit: (formData: FormData) => Promise<void>

  constructor(options: FromValidityManagerOptions) {
    super({
      on: options.on,
      P: options.P,
    });

    const formE = this.form = options.form;
    this.submit = options.submit;
    this.button = options.button;

    formE.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("check:", this.check());
      if (this.check()) {
        const formData = new FormData;

        for (let a = this.items, i = 0; a.length > i; i++) {
          const entry = a[i];
          const type = entry.type;
          let input = entry.input;

          if ("recaptcha" === type) {
            input = input as Recaptcha;

            if (!input.confirmed) {
              formData.set("recaptcha", input.value as string);
            }
          } else if ("text" === type) {
            input = input as HTMLInputElement;

            const value = input.value;

            if (input.defaultValue !== value) {
              formData.set(input.name, value);
            }
          }
        }

        Promise.all([
          this.submit(new FormData),
          new Promise((resolve) => {
            const win = this.window!;

            win.css.load(23)
              .then((styleIds) => {
                this.window!.css.attach(this, styleIds, {
                  build: true,
                });

                this.button.classList.add("c23");

                setTimeout(resolve, 750);
              })
              .catch(resolve);
          }),
        ])
          .then(() => {
            if (this.S) {
              this.reset();
            }
          });
      } else {
        this.window!.dialog.create({
          P: this,
          title: "エラー",
          content: "全ての項目を正しく入力して下さい。",
        });
      }
    }, {
      passive: false,
    });

    for (let a = options.items, i = 0; a.length > i; i++) {
      const entry = a[i];
      let input = entry.input;
      const type = entry.type;

      this.items.push(
        new ("text" === type ? InputValidityManager : RecaptchaValidityManager)({
          on: {
            input: () => {
              this.button.disabled = this.items.some((item) => item.error)
            },
          },
          P: this,
          input: input,
        })
      );
    }
  }

  check(): boolean {
    return !(this.button.disabled = this.items.some((item) => !item.check()));
  }

  reset(): void {
    this.button.classList.remove("c23");
    this.items.forEach(item => item.reset());
    this.button.disabled = false;
    this.check();
  }
}

interface ValidityManager {
  readonly type: string
  error: string | null
  input: HTMLInputElement | HTMLTextAreaElement | Recaptcha
  check(): boolean
  reset(): void
}

export class RecaptchaValidityManager extends Component implements ValidityManager {
  readonly type: string = "recaptcha"
  error: string | null = null
  input: Recaptcha

  constructor(options: InitOptions) {
    super({
      on: options.on,
      P: options.P,
    });

    this.input = new (this.window!.js.get(3))({
      element: options.input as HTMLDivElement,
      on: {
        ready: () => this.check(),
        input: () => {
          this.check();
          this.emit!("input");
        },
      },
      P: this,
    });
  }

  check(): boolean {
    const input = this.input;
    return !(this.error = input.confirmed || "string" === typeof input.value ? null : "「ロボットではありません」にチェックして下さい。");
  }

  reset(): void {
    this.input.reset();
  }
}

export class InputValidityManager extends Component implements ValidityManager {
  readonly type: string = "text"
  error: string | null = null
  element: HTMLDivElement = document.createElement("div")
  validator: Array<(instance: InputValidityManager) => boolean> = []
  input: HTMLInputElement | HTMLTextAreaElement

  constructor(options: InitOptions) {
    super({
      on: options.on,
      P: options.P,
    });

    const inputE = this.input = options.input as HTMLInputElement | HTMLTextAreaElement;

    inputE.addEventListener("input", () => {
      this.check();
      this.emit!("input");
    }, {
      passive: true,
    });

    const element = this.element;
    element.className = "c24";
    element.appendChild(document.createTextNode(""));

    this.check(!inputE.value.length);
  }

  reset(): void {
    this.error = null;
    this.element.remove();
  }

  update() {
    const containerE = this.input.parentNode!;
    const error = this.error;
    const element = this.element;
    const isContains = element.parentNode;

    (element.firstChild as Text).data = error ? error : "";

    if (error && !isContains) {
      containerE.appendChild(element);

    } else if (!error && isContains) {
      element.remove();

    }
  }

  check(skipUpdate: boolean = false): boolean {
    const inputE = this.input;
    const value = inputE.value;
    const length = value.length;

    let error: string | null = "";

    if (!inputE.required && !length) {

    } else {
      let hasError = false;

      for (let a = this.validator, i = 0; a.length > i; i++) {
        if (!a[i](this)) {
          hasError = true;
          error = this.error;
          break;
        }
      }

      if (!hasError) {
        if (inputE.required && !length) {
          error = "入力必須の項目です。";
        } else if (inputE.minLength > length) {
          error = inputE.minLength + "文字以上で入力して下さい。(現在" + length + "文字)";
        } else if (length > inputE.maxLength) {
          error = inputE.maxLength + "文字以内で入力して下さい。(現在" + length + "文字)";
        } else if (!inputE.validity.valid) {
          error = "正しい形式で入力して下さい。";
        }
      }
    }

    this.error = error;

    if (!skipUpdate) this.update();

    return !error;
  }
}