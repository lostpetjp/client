import { Component, InitOptions } from "../..";
import { AnimalMap } from "../../../types/animal";
import { CaseListItem, CaseListItemList } from "../../../types/case";
import { MatterMap } from "../../../types/matter";
import { PrefectureMap } from "../../../types/prefecture";

type Options = InitOptions & {
  data: {
    matter: MatterMap
    animal: AnimalMap
    prefecture: PrefectureMap
  }
  element?: HTMLUListElement
}

export class SearchItemList extends Component {
  element: HTMLUListElement

  data: {
    matter: MatterMap
    animal: AnimalMap
    prefecture: PrefectureMap
  }

  constructor(options: Options) {
    super({
      P: options.P,
    });

    this.data = options.data;

    const win = this.window!;
    const element = win.element;

    if (options.element) {
      this.element = options.element;

    } else {
      this.element = element.create({
        attribute: {
          class: "c26",
        },
        tagName: "ul",
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

    const data = this.data;
    const matterMap = data.matter;
    const animalMap = data.animal;
    const prefectureMap = data.prefecture;

    const matterId = item.matter;
    const matter = matterMap[matterId];

    const animalId = item.animal;
    const animal = animalMap[animalId];

    const prefectureId = item.prefecture;
    const prefecture = prefectureMap[prefectureId];
    const head = item.head;

    const photos = head.photos;
    const coverSrc = (photos && photos.length) ? photos[0][0] : null;
    const matches = coverSrc ? coverSrc.match(/^(m([0-9]+)s([0-9]+)x([0-9]+)z)(\.(jpg|png))$/)! : null;
    const src = matches ? "/media/" + matches[1] + "-w600a43" + matches[5] : null;

    const startsAt = new Date(item.starts_at * 1000);

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
              class: "o26a2",
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





/*
<a class="c26i" href="/16909">
  <article class="c26a">
    <header class="o26a1">
     <h2 class="o26a1a">探しています‼︎家猫ですが窓の閉め忘れの際に外に出てしまいました</h2>
     <span class="o26a1d">しーちゃん</span>
     <div class="o26a1b l1">迷子</div>
    <picture class="o26a1c">
      <source srcset="/media/m135275s1600x1200z-w600a43.jpg.avif" type="image/avif">
      <source srcset="/media/m135275s1600x1200z-w600a43.jpg.webp" type="image/webp">
      <img class="c26g" decoding="async" height="450" loading="lazy" src="/media/m135275s1600x1200z-w600a43.jpg" width="600">
    </picture>
  </header>
    <section class="o26a2">
      <div>神奈川県 逗子市沼間3丁目</div>
      <time class="o26a2b" datetime="2022-09-14T00:00:00+0900">2022/09/14</time>
    </section>
  </article>
</a>
*/