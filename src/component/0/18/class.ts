import { Component, InitOptions } from "../..";
import { AnimalMap } from "../../../types/animal";
import { CaseListItem, CaseListItemList } from "../../../types/case";
import { MatterMap } from "../../../types/matter";
import { PrefectureMap } from "../../../types/prefecture";

type Options = InitOptions & {
  element?: HTMLUListElement
}

export class SearchItemList extends Component {
  element: HTMLUListElement

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const win = this.window!;
    const element = win.element;

    if (options.element) {
      this.element = options.element;

    } else {
      this.element = element.create({
        attribute: {
          class: "c26",
        },
        tagName: "div",
      }) as HTMLUListElement;
    }
  }

  update(items: CaseListItemList): void {
    this.element.replaceChildren(...items.map((item) => this.create(item)));
    this.window!.document.attach(this.element);
  }

  create(item: CaseListItem): HTMLAnchorElement {
    const win = this.window!;
    const element = win.element;

    const matterMap = win.matter!;
    const animalMap = win.animal!;
    const prefectureMap = win.prefecture!;

    const matterId = item.matter;
    const matter = matterMap[matterId];

    const animalId = item.animal;
    const animal = animalMap[animalId];

    const prefectureId = item.prefecture;
    const prefecture = prefectureMap[prefectureId];
    const head = item.head;

    const coverSrc = head.cover || null;
    const matches = coverSrc ? coverSrc.match(/^(m([0-9]+)s([0-9]+)x([0-9]+)z)(\.(jpg|png|mp4|mov))$/)! : null;
    const src = matches ? "/media/" + matches[1] + "-w600a43" + "." + ("png" === matches[6] ? "png" : "jpg") : null;

    const startsAt = new Date(item.starts_at * 1000);
    const isNew = ((Date.now() / 1000) - item.modified_at) < 172800;

    return element.create({
      attribute: {
        class: "c26i",
        href: "/" + item.id,
      },
      children: {
        attribute: {
          class: "c26a",
        },
        children: [
          {
            attribute: {
              class: "o26a1",
            },
            children: [
              {
                attribute: {
                  class: "o26a1a",
                },
                children: head.title!,
                tagName: "h2",
              },
              {
                attribute: {
                  class: "o26a1d",
                },
                children: 1 === matterId ? (head.pet! || "名無し") : animal.title,
                tagName: "div",
              },
              {
                attribute: {
                  class: "o26a1b l" + matterId,
                },
                children: matter.title,
                tagName: "div",
              },
              {
                attribute: {
                  class: "o26a1c",
                },
                children: [
                  ...(src ? [
                    {
                      attribute: {
                        srcset: src + ".avif",
                        type: "image/avif",
                      },
                      tagName: "source",
                    },
                    {
                      attribute: {
                        srcset: src + ".webp",
                        type: "image/webp",
                      },
                      tagName: "source",
                    },
                  ] : []),
                  {
                    attribute: {
                      class: "c26g",
                      decoding: "async",
                      height: "450",
                      loading: "lazy",
                      src: src ? src : "/noimage.svg",
                      width: "600",
                    },
                    tagName: "img",
                  },
                ],
                tagName: "picture",
              },
            ],
            tagName: "header",
          },
          {
            attribute: {
              class: "o26a2" + (isNew ? " o26a2n" : ""),
            },
            children: [
              {
                children: prefecture.title + " " + head.location!,
                tagName: "div",
              },
              {
                attribute: {
                  class: "o26a2b",
                  datetime: startsAt.toString(),
                },
                children: [
                  startsAt.getFullYear(),
                  ("0" + (startsAt.getMonth() + 1)).slice(-2),
                  ("0" + startsAt.getDate()).slice(-2),
                ].join("/"),
                tagName: "time",
              },
            ],
            tagName: "section",
          },
        ],
        tagName: "article",
      },
      tagName: "a",
    }) as HTMLAnchorElement;
  }
}