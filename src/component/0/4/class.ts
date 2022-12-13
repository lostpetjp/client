import { Component } from "../../../component"
import { DocumentItem, ContentData } from "../../../script/document"
import { Content, ContentOptions } from "../../content"
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

  pathname: string
  search: string

  constructor(options: ContentOptions) {
    super({
      P: options.P,
    });

    this.pathname = options.pathname;
    this.search = options.search;
  }

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
      submit: (controller: FromValidityManager, formData: FormData): Promise<void> => {
        return new Promise((resolve, reject) => {
          this.window!.fetch({
            credentials: true,
            body: formData,
            method: "POST",
            path: "contact",
          })
            .then((res) => {
              if (this.S) {
                res = res as {
                  error?: string | Array<string>
                  status?: boolean
                };

                const error = res.error;

                this.window!.dialog.create({
                  P: this,
                  title: error ? "エラー" : "送信完了",
                  content: error ? error : [
                    "ありがとうございます。",
                    "問い合わせを送信しました。",
                  ],
                });

                if (res.status) {
                  console.log("reset");
                  controller.reset();
                }

                resolve();
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
    });
  }
}