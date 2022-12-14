import { Win } from "../script/window"

export class Component {
  constructor(options: InitOptions) {
    this.init!(options);
  }

  window?: Win

  C: ComponentList = []
  T: TimeoutIdMap = {}
  D: ToEventEntryMap = {}
  E: FromEventEntryList = []
  P?: Component | null
  S: Status = true

  init?: Init
  on?: On
  off?: Off
  emit?: Emit
  destroy?: Destroy
}

export type Status = boolean

// 拡張用の関数
export type On = (source: Component, name: EventName, callback: EventCallback, options?: EventOptions) => void
export type Off = (source: Component | null, name: EventName, callback: EventCallback) => void
export type Destroy = () => void
export type Init = (options: InitOptions) => void
export type Emit = (name: EventName, event?: EmitEventData) => { [key: string]: any }

export type ComponentList = Array<Component>
export type TimeoutIdMap = { [key: number | string]: any }

export type EventName = string

// 拡張対象のコンストラクタ
export type ExtendsTarget = {
  prototype: {
    [key: string]: any
  }
}
export type InitOptions = {
  on?: InitEventListeners
  P: Component | null
  [key: number | string]: any
}

// 自分が発信するイベント
export type ToEventEntry = [EventCallback, EventOptions | undefined, Component | null];
export type ToEventEntryList = Array<ToEventEntry>
export type ToEventEntryMap = { [key: EventName]: ToEventEntryList }

// 相手が発信するイベント
export type FromEventEntry = [Component, EventName, EventCallback,];
export type FromEventEntryList = Array<FromEventEntry>

export type EventCallback = (event: EventData) => void

export type EmitEventData = {
  [key: string]: any
}

export type CallbackEventData = EmitEventData & {
  source: Component
  target: Component
}

export type EventData = CallbackEventData & {
  type: EventName
}

export type EventOptions = {
  once: boolean
}

export type InitEventListeners = {
  [key: string]: (any?: any) => void
}
