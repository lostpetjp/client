export type MatterId = 1 | 2 | 3 | 4
export type MatterName = "lost" | "find" | "witness" | "rainbow"

export type SearchMatterId = 0 | 1 | 2

export type MatterItem = {
  id: 1,
  name: "lost",
  search: true,
  title: "迷子",
} | {
  id: 2,
  name: "find",
  search: true,
  title: "保護",
} | {
  id: 3,
  name: "witness",
  search: false,
  title: "目撃",
} | {
  id: 4,
  name: "rainbow",
  search: false,
  title: "虹の橋",
}

export type MatterMap = {
  1: {
    id: 1,
    name: "lost",
    search: true,
    title: "迷子",
  },
  2: {
    id: 2,
    name: "find",
    search: true,
    title: "保護",
  },
  3: {
    id: 3,
    name: "witness",
    search: false,
    title: "目撃",
  },
  4: {
    id: 4,
    name: "rainbow",
    search: false,
    title: "虹の橋",
  },
}