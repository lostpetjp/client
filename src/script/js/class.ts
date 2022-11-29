import { Component, ExtendsTarget, InitOptions } from "../../component";

type CacheMap = {
  [key: string]: any
}

export type ScriptId = number

export type ScriptIdList = Array<ScriptId>

type Script = any;

export class JS extends Component {
  private caches: CacheMap = {}

  constructor(options: InitOptions) {
    super({
      P: options.P,
    });
  }

  get(id: ScriptId): Script {
    return this.caches[id];
  }

  load(ids: ScriptIdList | ScriptId): Promise<Script> {
    if (!Array.isArray(ids)) ids = [ids,];

    return Promise.all(ids.map((id) => {
      return new Promise((resolve, reject) => {
        if (this.caches[id]) {
          resolve(this.caches[id]);
        } else {
          import("/scripts/" + id + ".js?v=" + this.window!.version)
            .then((module) => {
              const moduleDefault = module.default;
              const promises: Array<any> = [moduleDefault,];

              if (moduleDefault) {
                const scriptIds: Array<number> | undefined = moduleDefault.js;
                const styleIds: Array<number> | undefined = moduleDefault.css;

                scriptIds?.forEach((id) => promises.push(this.load(id)));
                if (styleIds) promises.push(this.window!.css!.load(styleIds));
              }

              return Promise.all(promises);
            })
            .then((res) => {
              const moduleDefault = res[0];

              if (moduleDefault) {
                let component;
                const type = moduleDefault.type;

                if ("lostpetjp" === type) {
                  component = moduleDefault.component;
                  this.caches[id] = component;
                  this.window!.factory.create(component);

                  moduleDefault.plugins?.forEach((component: ExtendsTarget) => {
                    this.window!.factory.create(component);
                  });
                } else if ("function" === type) {
                  component = this.caches[id] = moduleDefault.component;

                } else {
                  throw "error!!!!!!!TODO";
                  const constructor = component = moduleDefault.constructor;
                  component = this.caches[id] = constructor ? constructor : moduleDefault;
                }

                resolve(component);
              }
            })
            .catch((err) => {
              if (this.S) {
                console.error(err);
                this.window!.throw();
              }

              reject();
            })
        }
      });
    }));
  }
}