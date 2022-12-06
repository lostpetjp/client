import { Component, InitOptions } from "../..";
import { DocumentM } from "../../../script/document";
import { Content } from "../../content";
import { Template, TemplateReadyState } from "../../template";

type Options = InitOptions & {
}

/**
 * Caseカテゴリのテンプレート
 */
export class CaseTemplate extends Component implements Template {
  P?: DocumentM
  readonly id: number = 1
  element?: HTMLElement
  content?: Content

  readyState: TemplateReadyState = 0
  private article?: HTMLElement
  private header?: HTMLElement
  private heading?: HTMLElement

  constructor(options: Options) {
    super({
      P: options.P,
    });
  }

  ready(): Promise<void> {
    return Promise.resolve();
  }

  create(): void {

  }

  parse(): void {

  }

  build(): void {

  }

  attach(): void {

  }
}