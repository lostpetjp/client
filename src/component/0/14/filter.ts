import { Component, InitOptions } from "../..";
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

    const childNodes = rootE.getElementsByClassName("c25a1a");
    this.matter = childNodes[0] as HTMLAnchorElement;
    this.animal = childNodes[1] as HTMLAnchorElement;
    this.prefecture = childNodes[2] as HTMLAnchorElement;
  }

  update(object: SearchLocationObject): void {
    const root = this.P! as SearchTemplate;
    const matterMap = root.matter!;
    const animalMap = root.animal!;
    const prefectureMap = root.prefecture!;

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

/*

        
<li>
  <a class="a2 c25a1a hb3" role="button">
    迷子<svg height="12" viewBox="0 0 24 24" width="12"><path d="M2.484 5.699 12 15.215l9.516-9.516a1.456 1.456 0 0 1 2.058 2.057L13.029 18.301a1.455 1.455 0 0 1-2.058 0L.426 7.756a1.455 1.455 0 0 1 2.058-2.057Z" fill="currentColor"></path></svg>
  </a>
</li>
*/