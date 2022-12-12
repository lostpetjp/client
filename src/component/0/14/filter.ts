import { Component, InitOptions } from "../..";
import { AnimalItem, SearchAnimalId } from "../../../types/animal";
import { MatterItem, SearchMatterId } from "../../../types/matter";
import { PrefectureItem, SearchPrefectureId } from "../../../types/prefecture";
import { SVGChevronDownElementJSON } from "../../../utils/svg/chevron-down";
import { SearchLocationObject, SearchTemplate } from "./class";

type Options = InitOptions & {
  element?: HTMLUListElement
}

export class SearchFilter extends Component {
  element: HTMLUListElement

  matter: HTMLAnchorElement
  animal: HTMLAnchorElement
  prefecture: HTMLAnchorElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    let rootE;

    if (options.element) {
      rootE = this.element = options.element;

    } else {
      rootE = this.element = element.create({
        attribute: {
          class: "c25a",
        },
        children: [null, null, null,].map(() => {
          return {
            children: {
              attribute: {
                class: "a2 c25a1a hb3",
                role: "button",
              },
              children: [
                {
                  attribute: {
                    class: "c25a1a1",
                  },
                  children: "",
                  tagName: "span",
                },
                this.window!.element.create(SVGChevronDownElementJSON, {
                  attribute: {
                    height: "12",
                    width: "12",
                  },
                }),
              ],
              tagName: "a",
            },
            tagName: "li",
          };
        }),
        tagName: "ul",
      }) as HTMLUListElement;
    }

    win.document.attach(rootE);

    const childNodes = rootE.getElementsByClassName("c25a1a");
    const matterAE = this.matter = childNodes[0] as HTMLAnchorElement;
    const animalAE = this.animal = childNodes[1] as HTMLAnchorElement;
    const prefectureAE = this.prefecture = childNodes[2] as HTMLAnchorElement;

    [
      matterAE,
      animalAE,
      prefectureAE,
    ].forEach((aE) => {
      aE.addEventListener("mousedown", (event) => event.stopPropagation(), { passive: true, });
      aE.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true, });

      aE.addEventListener("click", (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        const aE = event.currentTarget as HTMLAnchorElement;

        this.window!.fetch({
          credentials: false,
          path: "count",
          method: "GET",
        })
          .then((countInfo) => {
            if (this.S) {
              const win = this.window!;
              const element = win.element;

              const type = this.matter === aE ? 1 : (this.animal === aE ? 2 : 3);
              const map = 1 === type ? win.matter! : (2 === type ? win.animal! : win.prefecture!);

              win.popup.create({
                css: [30,],
                element: element.create({
                  attribute: {
                    class: "c30",
                  },
                  children: {
                    attribute: {
                      class: 3 === type ? "c30b" : "c30a",
                    },
                    children: [
                      {
                        id: 0,
                        title: "すべて",
                      },
                    ].concat(Object.values(map).filter((item: MatterItem | AnimalItem | PrefectureItem) => item.search)).map((item: MatterItem | AnimalItem | PrefectureItem | {
                      id: number
                      title: string
                    }, index: number) => {
                      const win = this.window!;

                      const id = item.id;
                      const root = this.P! as SearchTemplate;
                      const loc = root.location;

                      const matterMap = win.matter!;
                      const animalMap = win.animal!;

                      const locMatterId = loc.matter;
                      const locAnimalId = loc.animal;
                      const locPrefectureId = loc.prefecture;

                      const matterId = 1 === type ? id : locMatterId;
                      const animalId = 2 === type ? id : locAnimalId;
                      const prefectureId = 3 === type ? id : locPrefectureId;

                      let count = 0;

                      const mTarget = matterId ? (2 === matterId ? Object.keys(matterMap).filter((idStr) => {
                        const item = win.matter![idStr] as MatterItem;
                        return 2 === item.id || !item.search;
                      }) : [matterId.toString(),]) : [];

                      const aTarget = animalId ? (99 === animalId ? Object.keys(animalMap).filter((idStr) => {
                        var item = win.animal![idStr] as AnimalItem;
                        return 99 === item.id || !item.search;
                      }) : [animalId.toString(),]) : [];

                      for (let mIdStr in countInfo) {
                        if (!matterId || -1 !== mTarget.indexOf(mIdStr)) {
                          const d1 = countInfo[mIdStr];

                          for (let aIdStr in d1) {
                            if (!animalId || -1 !== aTarget.indexOf(aIdStr)) {
                              const d2 = d1[aIdStr];

                              for (let pIdStr in d2) {
                                if (!prefectureId || pIdStr === prefectureId.toString()) {
                                  count += d2[pIdStr];
                                }
                              }
                            }
                          }
                        }
                      }

                      return {
                        children: {
                          attribute: {
                            class: "a2 c30a1a hb2" + (id === (1 === type ? locMatterId : (2 === type ? locAnimalId : locPrefectureId)) ? " c25a1a1s" : "") + (!count ? " c25e1d" : ""),
                            href: root.url.create({
                              matter: matterId as SearchMatterId,
                              animal: animalId as SearchAnimalId,
                              prefecture: prefectureId as SearchPrefectureId,
                              page: 1,
                              sort: loc.sort,
                            }),
                          },
                          children: [
                            item.title,
                            {
                              attribute: {
                                class: "c30a1a1",
                              },
                              children: ("" + count).replace(/(\d)(?=(\d{3})+\b)/g, "$1,"),
                              tagName: "span",
                            },
                          ],
                          tagName: "a",
                        },
                        tagName: "li",
                      };
                    }),
                    tagName: "ul",
                  },
                  tagName: "div",
                }),
                id: "c25f" + type,
                P: this,
                target: aE,
                type: "modal",
                title: "選択",
                large: 3 === type,
              });
            }
          })
          .catch((err) => {
            if (this.S) {
              console.error(err);
              this.window!.throw();
            }
          });
      }, {
        passive: false,
      });
    });
  }

  update(object: SearchLocationObject): void {
    const win = this.window!;

    const matterMap = win.matter!;
    const animalMap = win.animal!;
    const prefectureMap = win.prefecture!;

    const matterId = object.matter;
    const animalId = object.animal;
    const prefectureId = object.prefecture;

    const matterItem = matterId ? matterMap[matterId] : null;
    const animalItem = animalId ? animalMap[animalId] : null;
    const prefectureItem = prefectureId ? prefectureMap[prefectureId] : null;

    const matterAE = this.matter;
    const animalAE = this.animal;
    const prefectureAE = this.prefecture;

    const matterSpanE = matterAE.firstChild! as HTMLSpanElement;
    const animalSpanE = animalAE.firstChild! as HTMLSpanElement;
    const prefectureSpanE = prefectureAE.firstChild! as HTMLSpanElement;

    (matterSpanE.firstChild as Text).data = matterItem ? matterItem.title : "全状況";
    (animalSpanE.firstChild as Text).data = animalItem ? animalItem.title : "全動物";
    (prefectureSpanE.firstChild as Text).data = prefectureItem ? prefectureItem.title : "全国";

    matterSpanE.classList[matterId ? "add" : "remove"]("c25a1a1s");
    animalSpanE.classList[animalId ? "add" : "remove"]("c25a1a1s");
    prefectureSpanE.classList[prefectureId ? "add" : "remove"]("c25a1a1s");
  }
}
