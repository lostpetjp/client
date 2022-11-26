import { Component, InitOptions } from "../../../component"
import { DocumentItem, ContentData } from "../../../script/document"
import { Content } from "../../content"
import { DocTemplateContent } from "../1/class"
import { Recaptcha } from "../3/class";

export type DocContentData = {
  title: string
  description: string
  body: any
} & ContentData;

export class ContactContent extends Component implements Content, DocTemplateContent {
  P?: DocumentItem

  title?: string
  description?: string
  element?: HTMLFormElement

  create(data: DocContentData): void {
    this.title = data.title;
    this.description = data.description;

    this.element = this.window!.element!.create(data.body) as HTMLFormElement;
  }

  parse(): void | Promise<void> {
    const doc = this.P!.P!;
    const mainE = doc.main!;

    this.element = mainE.getElementsByTagName("form")[0];
  }

  attach(): void | Promise<void> {

    const formE = this.element! as HTMLFormElement;
    const buttonE = formE.getElementsByTagName("button")[0];

    new ContactForm({
      P: this,
      form: formE,
    });
  }
}

type FormOptions = {
  form: HTMLFormElement
} & InitOptions;

type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement

/**
 * FormManager
 */
export class ContactForm extends Component {
  private readonly form: HTMLFormElement
  private readonly recaptcha: Recaptcha
  private readonly button: HTMLButtonElement
  private readonly title: HTMLInputElement
  private readonly email: HTMLInputElement
  private readonly description: HTMLTextAreaElement

  constructor(options: FormOptions) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const js = win.js!;

    const formE = this.form = options.form as HTMLFormElement;

    formE.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submit();
    }, {
      passive: false,
    });

    const controlsCollection = formE.elements;
    const titleE = this.title = controlsCollection[0] as HTMLInputElement;
    const emailE = this.email = controlsCollection[1] as HTMLInputElement;
    const descriptionE = this.description = controlsCollection[2] as HTMLTextAreaElement;
    this.button = controlsCollection[3] as HTMLButtonElement;

    [
      titleE,
      emailE,
      descriptionE,
    ].forEach((element) => {
      element.addEventListener("input", () => this.check(), {
        passive: true,
      })
    });

    this.recaptcha = new (js.get(3))({
      element: formE.getElementsByClassName("c16")[0],
      P: this,
    });
  }

  private check(): boolean {
    const formE = this.form;
    const submitE = this.button;

    const formData = new FormData(formE);

    const titleValid = this.valid(this.title);
    const emailValid = this.valid(this.email);
    const descriptionValid = this.valid(this.description);
    const recaptchaValid = "string" === typeof this.recaptcha.value;


    return true;
  }

  private valid(element: HTMLInputElement | HTMLTextAreaElement): boolean {
    const value = element.value;
    const length = value.length;
    return !(!element.validity.valid || element.minLength > length || length > element.maxLength);
  }

  submit(): void {

  }
}