import { Component } from "../..";
import { AnimalItem, AnimalMap, SearchAnimalId } from "../../../types/animal";
import { MatterItem, MatterMap, SearchMatterId } from "../../../types/matter";
import { PrefectureItem, PrefectureMap, SearchPrefectureId } from "../../../types/prefecture";
import { SearchSortId } from "../../../types/sort";
import { SearchLocationObject } from "../14/class";

export class SearchUrl extends Component {
  parse(pathname: string): SearchLocationObject {
    const win = this.window!;

    const object = {
      matter: 0 as SearchMatterId,
      animal: 0 as SearchAnimalId,
      prefecture: 0 as SearchPrefectureId,
      sort: 0 as SearchSortId,
      page: 1,
    };

    const matterMap = win.matter!;
    const animalMap = win.animal!;
    const prefectureMap = win.prefecture!;

    const find = (pathname: string, map: MatterMap | AnimalMap | PrefectureMap): void | MatterItem | AnimalItem | PrefectureItem => {
      for (let id in map) {
        const item = map[id];

        if (-1 !== pathname.indexOf(item.name) && item.search) {
          return item;
        }
      }
    };

    const matter = find(pathname, matterMap);
    if (matter) object.matter = matter.id as SearchMatterId;

    const animal = find(pathname, animalMap);
    if (animal) object.animal = animal.id as SearchAnimalId;

    const prefecture = find(pathname, prefectureMap);
    if (prefecture) object.prefecture = prefecture.id as SearchPrefectureId;

    if (-1 !== pathname.indexOf("new")) {
      object.sort = 1 as SearchSortId;
    }

    const matches = pathname.match(/\/([0-9]+)/);

    if (matches) {
      object.page = parseInt(matches[1], 10);
    }

    if (2 > object.page) object.page = 1;

    return object;
  }

  create(options: SearchLocationObject): string {
    const win = this.window!;

    const matterId = options.matter;
    const animalId = options.animal;
    const prefectureId = options.prefecture;
    const sortId = options.sort;
    const pageId = options.page;

    const matterMap = win.matter!;
    const animalMap = win.animal!;
    const prefectureMap = win.prefecture!;

    const find = (id: number, map: MatterMap | AnimalMap | PrefectureMap): void | MatterItem | AnimalItem | PrefectureItem => {
      for (let key in map) {
        const item = map[key];

        if (item.id === id && item.search) {
          return item;
        }
      }
    };

    const matter = find(matterId, matterMap);
    const animal = find(animalId, animalMap);
    const prefecture = find(prefectureId, prefectureMap);

    return "/search/" + [
      matter ? matter.name : null,
      animal ? animal.name : null,
      prefecture ? prefecture.name : null,
      sortId ? "new" : null,
      pageId > 1 ? pageId : null,
    ].filter((token: string | number | null) => token).join("/");
  }
}