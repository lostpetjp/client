import { On, Off, Emit, Component, InitOptions } from "../../component"

type RelationItem = {
  type: 1 | 2
  content: number
  updated_at: number
}

type RelationItemList = Array<RelationItem>

/**
 * ユーザー登録システムを作成した場合のクラス
 */
export class Me extends Component {
  id: null | number = null
  relation: RelationItemList = []
  readyState: 0 | 1 = 0

  constructor(options: InitOptions) {
    super({
      P: options.P,
    });
  }

  update(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.window!.fetch({
        credentials: true,
        method: "GET",
        path: "session",
      })
        .then((res: {
          id: null | number
          relation: RelationItemList
        }) => {
          if (this.S) {
            this.id = res.id;
            this.relation = res.relation;
            this.readyState = 1;

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
}