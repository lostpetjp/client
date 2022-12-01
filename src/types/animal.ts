export type AnimalId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 99
export type AnimalName = "dog" | "cat" | "bird" | "turtle" | "rabbit" | "ferret" | "hamster" | "flying-squirrel" | "others"

export type SearchAnimalId = 0 | 1 | 2 | 3 | 4 | 99

export type AnimalItem = {
  id: 1,
  name: "dog",
  title: "犬",
  search: true,
} | {
  id: 2,
  name: "cat",
  title: "猫",
  search: true,
} | {
  id: 3,
  name: "bird",
  title: "鳥",
  search: true,
} | {
  id: 4,
  name: "turtle",
  title: "亀",
  search: true,
} | {
  id: 5,
  name: "rabbit",
  title: "ウサギ",
  search: false,
} | {
  id: 6,
  name: "ferret",
  title: "フェレット",
  search: false,
} | {
  id: 7,
  name: "hamster",
  title: "ハムスター",
  search: false,
} | {
  id: 8,
  name: "flying-squirrel",
  title: "モモンガ",
  search: false,
} | {
  id: 99,
  name: "others",
  title: "その他",
  search: true,
}

export type AnimalMap = {
  1: {
    id: 1,
    name: "dog",
    title: "犬",
    search: true,
  },
  2: {
    id: 2,
    name: "cat",
    title: "猫",
    search: true,
  },
  3: {
    id: 3,
    name: "bird",
    title: "鳥",
    search: true,
  },
  4: {
    id: 4,
    name: "turtle",
    title: "亀",
    search: true,
  },
  5: {
    id: 5,
    name: "rabbit",
    title: "ウサギ",
    search: false,
  },
  6: {
    id: 6,
    name: "ferret",
    title: "フェレット",
    search: false,
  },
  7: {
    id: 7,
    name: "hamster",
    title: "ハムスター",
    search: false,
  },
  8: {
    id: 8,
    name: "flying-squirrel",
    title: "モモンガ",
    search: false,
  },
  99: {
    id: 99,
    name: "others",
    title: "その他",
    search: true,
  },
}
