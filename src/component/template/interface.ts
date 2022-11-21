import { Component } from ".."
import { StyleIdList } from "../../script/css";
import { DocumentData, DocumentM } from "../../script/document";
import { Content } from "../content";

/**
 * ready state
 * 0: 何もしていない
 * 1: `ready()`が完了
 * 2: `create()` or `parse()`が完了
 * 3: `build()`が完了
 * 4: `css.attach()`が完了
 */
export type TemplateReadyState = 0 | 1 | 2 | 3 | 4;

export interface Template extends Component {
  P?: DocumentM

  id: number
  element?: HTMLElement
  content?: Content

  css: StyleIdList

  readyState: TemplateReadyState

  ready?(): Promise<void> | void
  create(): Promise<void> | void
  parse(): Promise<void> | void
  build(): Promise<void> | void
}
