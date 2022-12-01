import { AnimalItem, AnimalMap } from "../../../types/animal";
import { MatterItem, MatterMap } from "../../../types/matter";
import { PrefectureItem, PrefectureMap } from "../../../types/prefecture";
import { SearchLocationObject } from "../14/class";

export interface SearchUrlObject {
  create(options: SearchLocationObject, data: {
    matter?: MatterMap
    animal?: AnimalMap
    prefecture?: PrefectureMap
  }): string
}

export const SearchUrl = {
  parse: (pathname: string) => {
    //
  },

  create: (options: SearchLocationObject, data: {
    matter?: MatterMap
    animal?: AnimalMap
    prefecture?: PrefectureMap
  }): string => {
    const matterId = options.matter;
    const animalId = options.animal;
    const prefectureId = options.prefecture;
    const sortId = options.sort;
    const pageId = options.page;

    const matterMap = data.matter!;
    const animalMap = data.animal!;
    const prefectureMap = data.prefecture!;

    let matter, animal, prefecture;

    for (let key in matterMap) {
      const item = (matterMap[key] as MatterItem);

      if (item.id === matterId && item.search) {
        matter = item;
        break;
      }
    }

    for (let key in animalMap) {
      const item = (animalMap[key] as AnimalItem);

      if (item.id === animalId && item.search) {
        animal = item;
        break;
      }
    }

    for (let key in prefectureMap) {
      const item = (prefectureMap[key] as PrefectureItem);

      if (item.id === prefectureId && item.search) {
        prefecture = item;
        break;
      }
    }

    return "/search/" + [
      matter ? matter.name : null,
      animal ? animal.name : null,
      prefecture ? prefecture.name : null,
      sortId ? "new" : null,
      pageId > 1 ? pageId : null,
    ].filter((token: string | number | null) => token).join("/");
  }
}

/*
// "/search/lost/dog/tokyo/new/"
    $matter_id = $object["matter"];
    $animal_id = $object["animal"];
    $prefecture_id = $object["prefecture"];
    $sort_id = $object["sort"];
    $page_id = $object["page"];

    $matter = $matter_id ? array_filter(Matter::$data, fn (array $entry) => $entry["search"])[$matter_id] ?? Matter::$data[99] : null;
    $animal = $animal_id ? array_filter(Animal::$data, fn (array $entry) => $entry["search"])[$animal_id] ?? Animal::$data[99] : null;
    $prefecture = $prefecture_id ? array_filter(Prefecture::$data, fn (array $entry) => $entry["search"])[$prefecture_id] ?? Prefecture::$data[99] : null;

    return "/search/" . implode("/", array_filter([
      $matter ? $matter["name"] : null,
      $animal ? $animal["name"] : null,
      $prefecture ? $prefecture["name"] : null,
      $sort_id ? "new" : null,
      $page_id > 1 ? $page_id : null,
    ], fn (string|int|null $token) => $token));
*/