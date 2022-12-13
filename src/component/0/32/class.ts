import { Component, InitOptions } from "../.."

type Options = InitOptions & {
  element: HTMLDivElement
}

export class CommentList extends Component {
  element: HTMLDivElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    this.element = options.element;
  }

  parse(): void {
    const win = this.window!;
    const element = win.element;

    const rootE = this.element;
  }

  update(): void {
    const win = this.window!;
    const element = win.element;

    const rootE = this.element;
  }
}