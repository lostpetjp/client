import { InitOptions, Component } from "../.."
import { DocumentM } from "../../../script/document"
import { Content } from "../../content"
import { Template, TemplateReadyState } from "../../template"
import { TermsContent } from "../2/class"

type Options = InitOptions & {
}

export interface DocTemplateContent {
  title?: string
  description?: string
  element?: Node
}

/**
 * Docカテゴリのテンプレート
 */
export class DocTemplate extends Component implements Template {
  P?: DocumentM
  readonly id: number = 1
  element?: HTMLElement
  content?: Content

  readyState: TemplateReadyState = 0
  private article?: HTMLElement
  private header?: HTMLElement
  private heading?: HTMLElement
  private description?: HTMLElement

  constructor(options: Options) {
    super({
      P: options.P,
    });
  }

  create(): void {
    const articleE = this.article = document.createElement("article");

    const headerE = this.header = document.createElement("header");
    articleE.appendChild(headerE);

    const headingE = this.heading = document.createElement("h1");
    headingE.className = "c1";
    headerE.appendChild(headingE);

    const descriptionE = this.description = headingE.nextSibling as HTMLElement;
  }

  parse(): void {
    const doc = this.P!;
    const mainE = this.element = doc.main!;

    const articleE = this.article = mainE.getElementsByTagName("article")[0] as HTMLElement;
    const headerE = this.header = articleE.firstChild as HTMLElement;
    const headingE = this.heading = headerE.firstChild as HTMLElement;
    const descriptionE = this.description = headingE.nextSibling as HTMLElement;
  }

  build(): void {
    const doc = this.P!;

    if (2 !== doc.mode) {
      const win = this.window!;

      const content = this.content! as TermsContent;
      const articleE = this.article!;
      const headingE = this.heading!;
      const descriptionE = this.description!;

      // for heading
      headingE.textContent = content.title!;

      // for description
      while (descriptionE.firstChild) {
        descriptionE.firstChild.remove();
      }

      descriptionE.appendChild(win.element!.create(content.description!));

      // for body
      while (articleE.childNodes[1]) {
        articleE.childNodes[1].remove();
      }

      articleE.appendChild(content.element!);
    }
  }
}


