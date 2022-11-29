import { Component, InitOptions } from "../../../component"
import { DocumentItem, ContentData } from "../../../script/document"
import { Content } from "../../content"
import { DocTemplateContent } from "../1/class"
import { FromValidityManager } from "../13/class";

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
    const controlsCollection = formE.elements;

    new (this.window!.js.get(13) as typeof FromValidityManager)({
      form: formE,
      button: controlsCollection[3] as HTMLButtonElement,
      P: this,
      items: [
        {
          input: controlsCollection[0] as HTMLInputElement,
          type: "text",
        },
        {
          input: controlsCollection[1] as HTMLInputElement,
          type: "text",
        },
        {
          input: controlsCollection[2] as HTMLTextAreaElement,
          type: "text",
        },
        {
          input: formE.getElementsByClassName("c16")[0] as HTMLDivElement,
          type: "recaptcha",
        },
      ],
      submit: (formData: FormData): Promise<void> => {
        // fetch
        return Promise.resolve();
      }
    });
  }
}