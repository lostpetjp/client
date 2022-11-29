import { Win } from "../window"
import {
  Component, Init, InitOptions, On, Off, Emit, Destroy, TimeoutIdMap, ToEventEntryMap, ToEventEntryList, FromEventEntryList,
  ComponentList, ExtendsTarget, EventName, EventCallback, EventOptions, EventData, EmitEventData,
} from "../../component"

type features = {
  init: Init
  on: On
  off: Off
  emit: Emit
  destroy: Destroy
};

export const features: features = {
  // init()
  init: function (this: Component, options: InitOptions): void {
    const _options: {
      C: ComponentList
      T: TimeoutIdMap
      D: ToEventEntryMap
      E: FromEventEntryList
    } = {
      C: [],
      D: {}, // event (自分に設定されたイベント)
      E: [], // event (相手に設定したイベント)
      T: {},
    };

    const initOptions: InitOptions = Object.assign(options, _options);

    for (let key in initOptions) {
      let val = initOptions[key];

      if ("on" !== key && "undefined" !== typeof val) {
        this[key] = val;
      }
    }

    const parent = initOptions.P;

    if (parent) {
      (parent as { C: ComponentList }).C.push(this);

      const events = initOptions.on;

      if (events) {
        for (let name in events) {
          this.on!(parent, name, events[name]);
        }
      }
    }
  },
  // on()
  on: function (this: Component, source: Component, name: EventName, callback: EventCallback, options?: EventOptions): void {
    if (!this.S) return;

    const listeners = this.D;

    const determinedSource = source && source !== this ? source : null;
    if (determinedSource && !determinedSource.S) return;

    this.off!(determinedSource, name, callback);

    let entries = listeners[name];
    if (!entries) entries = listeners[name] = [];

    entries.push([callback, options, determinedSource,]);
    if (determinedSource) determinedSource.E.push([this, name, callback,]);

  },
  // off()
  off: function (this: Component, source: Component | null, name: EventName, callback: EventCallback): void {
    const listeners = this.D;

    const entries = listeners ? listeners[name] : null;
    if (!entries) return;

    const newEntries: ToEventEntryList = [];

    for (let key in entries) {
      let entry = entries[key];
      let _source = entry[2];

      if (_source && source === _source) {
        if (!_source.S) continue;

        let newEntries2: FromEventEntryList = [];
        let oldEntries2 = _source.E;

        for (let _i = 0; oldEntries2.length > _i; _i++) {
          let _entry = oldEntries2[_i];

          if (_entry[0] !== this || _entry[1] !== name || _entry[2] !== callback) {
            newEntries2.push(_entry);
          }
        }

        _source.E = newEntries2;
      }

      if ((_source || this) !== source || callback !== entry[0]) {
        newEntries.push(entry);
      }
    }

    listeners[name] = newEntries;
  },
  // emit()
  emit: function (this: Component, name: EventName, object?: EmitEventData): any {
    const listeners = this.D;
    const isDestroy = "destroy" === name;

    if (!listeners || (!this.S && !isDestroy)) return;

    const entries = listeners[name];
    if (!entries) return;

    let event = object || {};

    for (let i = entries.length; i--;) {
      let entry = entries[i];
      let source = entry[2] || this;
      let callback = entry[0];
      let options = entry[1];

      if (source && !source.S && !isDestroy) {

      } else {
        callback({
          ...event,
          ...{
            source: source,
            target: this,
            type: name,
          }
        });

        if ((!options || !options.once) && !isDestroy) {
          continue;
        }
      }

      this.off!(source, name, callback);
    }

    return event;
  },
  // destroy()
  destroy: function (this: Component) {
    if (!this.S) return;

    const timeouts = this.T;

    for (let key in timeouts) {
      let id = timeouts[key];
      clearTimeout(id);
      clearInterval(id);
      cancelAnimationFrame(id as number);
    }

    this.S = false;

    this.emit!("destroy");

    for (let i = 0, a = this.E; a.length > i; i++) {
      let entry = a[i];
      let target = entry[0];

      if (target && target.S) {
        let type = entry[1];
        target.off!(this, type, entry[2]);

        let targetFromEvents = target.D;
        let oldEntries = targetFromEvents[type];

        if (oldEntries) {
          let newEntries: ToEventEntryList = [];

          for (let _i = 0; oldEntries.length > _i; _i++) {
            let _entry = oldEntries[_i];
            let instance = _entry[2];

            if (!instance || (instance.S)) {
              newEntries.push(_entry);
            }
          }

          targetFromEvents[type] = newEntries;

          if (!targetFromEvents[type].length) {
            targetFromEvents[type] = [];

            let newTargetFromEvents = target.D = {};

            for (let _key in targetFromEvents) {
              let _entry = targetFromEvents[_key];
              if (_entry.length) newTargetFromEvents[_key] = _entry;
            }
          }
        }
      }
    }

    for (let i = 0, a = this.C; a.length > i; i++) {
      a[i].destroy!();
    }

    let parent = this.P;

    if (parent && parent.S) {
      let newEntries: ComponentList = [];
      let oldEntries = parent.C;

      for (let _i = 0; oldEntries.length > _i; _i++) {
        let instance = oldEntries[_i];

        if (instance && instance.S) {  // terminateされたinstance(S=2)も保持しておかないといけない
          newEntries.push(instance);
        }
      }

      parent.C = newEntries;
    }
  },
};

export class Factory {
  create(constructor: ExtendsTarget) {
    Object.setPrototypeOf(constructor.prototype, {
      ...this.features,
      window: this.window,
    });
  }

  features: features = features

  window?: Win
}

/*
 const plugins = constructor.plugins;

    if (plugins) {
      for (let i = 0; plugins.length > i; i++) {
        this.create(plugins[i]);
      }
    }
*/