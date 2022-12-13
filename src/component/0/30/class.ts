import { Component, InitOptions } from "../.."

type Options = InitOptions & {
  case?: number
}

export class CommentForm extends Component {
  case: null | number = null

  constructor(options: Options) {
    super({
      on: options.on,
      P: options.P,
    });

    if (options.case) this.case = options.case;
  }
}