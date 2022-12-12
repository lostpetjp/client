import { Win } from "../../../script/window";
import { AnimalMap } from "../../../types/animal";
import { MatterMap } from "../../../types/matter";
import { PrefectureMap } from "../../../types/prefecture";

export default {
  scope: "lostpetjp",
  run: (win: Win): Promise<void> => {
    return new Promise((resolve, reject) => {
      win.fetch({
        credentials: false,
        method: "GET",
        path: "data",
      })
        .then((res) => {
          if (win.S) {
            win.matter = res.matter as MatterMap;
            win.animal = res.animal as AnimalMap;
            win.prefecture = res.prefecture as PrefectureMap;

            resolve();
          }
        })
        .catch((err) => {
          if (win.S) {
            console.error(err);
            win.throw();
          }
        })
        .finally(reject);
    });
  },
}