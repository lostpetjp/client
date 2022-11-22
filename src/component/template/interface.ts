import { Component } from ".."
import { DocumentData, DocumentM } from "../../script/document";
import { Content } from "../content";

/**
 * ready state
 * 0: 何もしていない。
 * 1: `ready()`が完了した。
 * 2: `create()` or `parse()`が完了した。
 * 3: `css.attach()`が完了した。
 * 4: DOMに接続された。
 */
export type TemplateReadyState = 0 | 1 | 2 | 3 | 4;

export interface Template extends Component {
  P?: DocumentM

  id: number
  element?: HTMLElement
  content?: Content

  readyState: TemplateReadyState

  ready?(): Promise<void> | void
  create(): Promise<void> | void
  parse(): Promise<void> | void
  build(): Promise<void> | void
}
