export type PrefectureId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47
export type PrefectureName = "hokkaido" | "aomori" | "iwate" | "miyagi" | "akita" | "yamagata" | "fukushima" | "ibaraki" | "tochigi" | "gunma" | "saitama" | "chiba" | "tokyo" | "kanagawa" | "niigata" | "toyama" | "ishikawa" | "fukui" | "yamanashi" | "nagano" | "gifu" | "shizuoka" | "aichi" | "mie" | "shiga" | "kyoto" | "osaka" | "hyogo" | "nara" | "wakayama" | "tottori" | "shimane" | "okayama" | "hiroshima" | "yamaguchi" | "tokushima" | "kagawa" | "ehime" | "kochi" | "fukuoka" | "saga" | "nagasaki" | "kumamoto" | "oita" | "miyazaki" | "kagoshima" | "okinawa"
export type PrefectureTitle = "北海道" | "青森県" | "岩手県" | "宮城県" | "秋田県" | "山形県" | "福島県" | "茨城県" | "栃木県" | "群馬県" | "埼玉県" | "千葉県" | "東京都" | "神奈川県" | "新潟県" | "富山県" | "石川県" | "福井県" | "山梨県" | "長野県" | "岐阜県" | "静岡県" | "愛知県" | "三重県" | "滋賀県" | "京都府" | "大阪府" | "兵庫県" | "奈良県" | "和歌山県" | "鳥取県" | "島根県" | "岡山県" | "広島県" | "山口県" | "徳島県" | "香川県" | "愛媛県" | "高知県" | "福岡県" | "佐賀県" | "長崎県" | "熊本県" | "大分県" | "宮崎県" | "鹿児島県" | "沖縄県"

export type SearchPrefectureId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47

export type PrefectureItem =
  {
    id: 1,
    name: "hokkaido",
    neighbor: [],
    search: true,
    title: "北海道",
  } | {
    id: 2,
    name: "aomori",
    neighbor: [3, 5,],
    search: true,
    title: "青森県",
  } | {
    id: 3,
    name: "iwate",
    neighbor: [2, 4, 5,],
    search: true,
    title: "岩手県",
  } | {
    id: 4,
    name: "miyagi",
    neighbor: [3, 5, 6, 7,],
    search: true,
    title: "宮城県",
  } | {
    id: 5,
    name: "akita",
    neighbor: [2, 3, 4, 6],
    search: true,
    title: "秋田県",
  } | {
    id: 6,
    name: "yamagata",
    neighbor: [4, 5, 7, 15,],
    search: true,
    title: "山形県",
  } | {
    id: 7,
    name: "fukushima",
    neighbor: [4, 6, 8, 9, 10, 15,],
    search: true,
    title: "福島県",
  } | {
    id: 8,
    name: "ibaraki",
    neighbor: [7, 9, 11, 12,],
    search: true,
    title: "茨城県",
  } | {
    id: 9,
    name: "tochigi",
    neighbor: [7, 8, 10, 11,],
    search: true,
    title: "栃木県",
  } | {
    id: 10,
    name: "gunma",
    neighbor: [7, 9, 11, 15, 20,],
    search: true,
    title: "群馬県",
  } | {
    id: 11,
    name: "saitama",
    neighbor: [8, 9, 10, 12, 13, 19, 20,],
    search: true,
    title: "埼玉県",
  } | {
    id: 12,
    name: "chiba",
    neighbor: [8, 11, 13,],
    search: true,
    title: "千葉県",
  } | {
    id: 13,
    name: "tokyo",
    neighbor: [11, 12, 14, 19,],
    search: true,
    title: "東京都",
  } | {
    id: 14,
    name: "kanagawa",
    neighbor: [13, 19, 22,],
    search: true,
    title: "神奈川県",
  } | {
    id: 15,
    name: "niigata",
    neighbor: [6, 7, 10, 16, 20,],
    search: true,
    title: "新潟県",
  } | {
    id: 16,
    name: "toyama",
    neighbor: [15, 17, 20, 21,],
    search: true,
    title: "富山県",
  } | {
    id: 17,
    name: "ishikawa",
    neighbor: [16, 18, 21,],
    search: true,
    title: "石川県",
  } | {
    id: 18,
    name: "fukui",
    neighbor: [17, 21, 25, 26,],
    search: true,
    title: "福井県",
  } | {
    id: 19,
    name: "yamanashi",
    neighbor: [11, 13, 14, 20, 22,],
    search: true,
    title: "山梨県",
  } | {
    id: 20,
    name: "nagano",
    neighbor: [10, 11, 15, 16, 19, 21, 22, 23,],
    search: true,
    title: "長野県",
  } | {
    id: 21,
    name: "gifu",
    neighbor: [16, 17, 18, 20, 23, 24, 25,],
    search: true,
    title: "岐阜県",
  } | {
    id: 22,
    name: "shizuoka",
    neighbor: [14, 19, 20, 23,],
    search: true,
    title: "静岡県",
  } | {
    id: 23,
    name: "aichi",
    neighbor: [20, 22, 21, 24,],
    search: true,
    title: "愛知県",
  } | {
    id: 24,
    name: "mie",
    neighbor: [21, 23, 25, 26, 29, 30,],
    search: true,
    title: "三重県",
  } | {
    id: 25,
    name: "shiga",
    neighbor: [18, 21, 24, 26,],
    search: true,
    title: "滋賀県",
  } | {
    id: 26,
    name: "kyoto",
    neighbor: [18, 24, 25, 27, 28, 29,],
    search: true,
    title: "京都府",
  } | {
    id: 27,
    name: "osaka",
    neighbor: [26, 28, 29, 30,],
    search: true,
    title: "大阪府",
  } | {
    id: 28,
    name: "hyogo",
    neighbor: [26, 27, 31, 33,],
    search: true,
    title: "兵庫県",
  } | {
    id: 29,
    name: "nara",
    neighbor: [24, 26, 27, 30,],
    search: true,
    title: "奈良県",
  } | {
    id: 30,
    name: "wakayama",
    neighbor: [24, 27, 29,],
    search: true,
    title: "和歌山県",
  } | {
    id: 31,
    name: "tottori",
    neighbor: [28, 32, 33, 34,],
    search: true,
    title: "鳥取県",
  } | {
    id: 32,
    name: "shimane",
    neighbor: [31, 34, 35,],
    search: true,
    title: "島根県",
  } | {
    id: 33,
    name: "okayama",
    neighbor: [28, 31, 34,],
    search: true,
    title: "岡山県",
  } | {
    id: 34,
    name: "hiroshima",
    neighbor: [31, 32, 33, 35,],
    search: true,
    title: "広島県",
  } | {
    id: 35,
    name: "yamaguchi",
    neighbor: [32, 34,],
    search: true,
    title: "山口県",
  } | {
    id: 36,
    name: "tokushima",
    neighbor: [37, 38, 39,],
    search: true,
    title: "徳島県",
  } | {
    id: 37,
    name: "kagawa",
    neighbor: [36, 38,],
    search: true,
    title: "香川県",
  } | {
    id: 38,
    name: "ehime",
    neighbor: [36, 37, 39,],
    search: true,
    title: "愛媛県",
  } | {
    id: 39,
    name: "kochi",
    neighbor: [36, 38,],
    search: true,
    title: "高知県",
  } | {
    id: 40,
    name: "fukuoka",
    neighbor: [41, 43, 44,],
    search: true,
    title: "福岡県",
  } | {
    id: 41,
    name: "saga",
    neighbor: [40, 42,],
    search: true,
    title: "佐賀県",
  } | {
    id: 42,
    name: "nagasaki",
    neighbor: [41,],
    search: true,
    title: "長崎県",
  } | {
    id: 43,
    name: "kumamoto",
    neighbor: [40, 44, 45, 46,],
    search: true,
    title: "熊本県",
  } | {
    id: 44,
    name: "oita",
    neighbor: [40, 43, 45,],
    search: true,
    title: "大分県",
  } | {
    id: 45,
    name: "miyazaki",
    neighbor: [43, 44, 46,],
    search: true,
    title: "宮崎県",
  } | {
    id: 46,
    name: "kagoshima",
    neighbor: [43, 45,],
    search: true,
    title: "鹿児島県",
  } | {
    id: 47,
    name: "okinawa",
    neighbor: [],
    search: true,
    title: "沖縄県",
  }

export type PrefectureMap = {
  1: {
    id: 1,
    name: "hokkaido",
    neighbor: [],
    search: true,
    title: "北海道",
  },
  2: {
    id: 2,
    name: "aomori",
    neighbor: [3, 5,],
    search: true,
    title: "青森県",
  },
  3: {
    id: 3,
    name: "iwate",
    neighbor: [2, 4, 5,],
    search: true,
    title: "岩手県",
  },
  4: {
    id: 4,
    name: "miyagi",
    neighbor: [3, 5, 6, 7,],
    search: true,
    title: "宮城県",
  },
  5: {
    id: 5,
    name: "akita",
    neighbor: [2, 3, 4, 6],
    search: true,
    title: "秋田県",
  },
  6: {
    id: 6,
    name: "yamagata",
    neighbor: [4, 5, 7, 15,],
    search: true,
    title: "山形県",
  },
  7: {
    id: 7,
    name: "fukushima",
    neighbor: [4, 6, 8, 9, 10, 15,],
    search: true,
    title: "福島県",
  },
  8: {
    id: 8,
    name: "ibaraki",
    neighbor: [7, 9, 11, 12,],
    search: true,
    title: "茨城県",
  },
  9: {
    id: 9,
    name: "tochigi",
    neighbor: [7, 8, 10, 11,],
    search: true,
    title: "栃木県",
  },
  10: {
    id: 10,
    name: "gunma",
    neighbor: [7, 9, 11, 15, 20,],
    search: true,
    title: "群馬県",
  },
  11: {
    id: 11,
    name: "saitama",
    neighbor: [8, 9, 10, 12, 13, 19, 20,],
    search: true,
    title: "埼玉県",
  },
  12: {
    id: 12,
    name: "chiba",
    neighbor: [8, 11, 13,],
    search: true,
    title: "千葉県",
  },
  13: {
    id: 13,
    name: "tokyo",
    neighbor: [11, 12, 14, 19,],
    search: true,
    title: "東京都",
  },
  14: {
    id: 14,
    name: "kanagawa",
    neighbor: [13, 19, 22,],
    search: true,
    title: "神奈川県",
  },
  15: {
    id: 15,
    name: "niigata",
    neighbor: [6, 7, 10, 16, 20,],
    search: true,
    title: "新潟県",
  },
  16: {
    id: 16,
    name: "toyama",
    neighbor: [15, 17, 20, 21,],
    search: true,
    title: "富山県",
  },
  17: {
    id: 17,
    name: "ishikawa",
    neighbor: [16, 18, 21,],
    search: true,
    title: "石川県",
  },
  18: {
    id: 18,
    name: "fukui",
    neighbor: [17, 21, 25, 26,],
    search: true,
    title: "福井県",
  },
  19: {
    id: 19,
    name: "yamanashi",
    neighbor: [11, 13, 14, 20, 22,],
    search: true,
    title: "山梨県",
  },
  20: {
    id: 20,
    name: "nagano",
    neighbor: [10, 11, 15, 16, 19, 21, 22, 23,],
    search: true,
    title: "長野県",
  },
  21: {
    id: 21,
    name: "gifu",
    neighbor: [16, 17, 18, 20, 23, 24, 25,],
    search: true,
    title: "岐阜県",
  },
  22: {
    id: 22,
    name: "shizuoka",
    neighbor: [14, 19, 20, 23,],
    search: true,
    title: "静岡県",
  },
  23: {
    id: 23,
    name: "aichi",
    neighbor: [20, 22, 21, 24,],
    search: true,
    title: "愛知県",
  },
  24: {
    id: 24,
    name: "mie",
    neighbor: [21, 23, 25, 26, 29, 30,],
    search: true,
    title: "三重県",
  },
  25: {
    id: 25,
    name: "shiga",
    neighbor: [18, 21, 24, 26,],
    search: true,
    title: "滋賀県",
  },
  26: {
    id: 26,
    name: "kyoto",
    neighbor: [18, 24, 25, 27, 28, 29,],
    search: true,
    title: "京都府",
  },
  27: {
    id: 27,
    name: "osaka",
    neighbor: [26, 28, 29, 30,],
    search: true,
    title: "大阪府",
  },
  28: {
    id: 28,
    name: "hyogo",
    neighbor: [26, 27, 31, 33,],
    search: true,
    title: "兵庫県",
  },
  29: {
    id: 29,
    name: "nara",
    neighbor: [24, 26, 27, 30,],
    search: true,
    title: "奈良県",
  },
  30: {
    id: 30,
    name: "wakayama",
    neighbor: [24, 27, 29,],
    search: true,
    title: "和歌山県",
  },
  31: {
    id: 31,
    name: "tottori",
    neighbor: [28, 32, 33, 34,],
    search: true,
    title: "鳥取県",
  },
  32: {
    id: 32,
    name: "shimane",
    neighbor: [31, 34, 35,],
    search: true,
    title: "島根県",
  },
  33: {
    id: 33,
    name: "okayama",
    neighbor: [28, 31, 34,],
    search: true,
    title: "岡山県",
  },
  34: {
    id: 34,
    name: "hiroshima",
    neighbor: [31, 32, 33, 35,],
    search: true,
    title: "広島県",
  },
  35: {
    id: 35,
    name: "yamaguchi",
    neighbor: [32, 34,],
    search: true,
    title: "山口県",
  },
  36: {
    id: 36,
    name: "tokushima",
    neighbor: [37, 38, 39,],
    search: true,
    title: "徳島県",
  },
  37: {
    id: 37,
    name: "kagawa",
    neighbor: [36, 38,],
    search: true,
    title: "香川県",
  },
  38: {
    id: 38,
    name: "ehime",
    neighbor: [36, 37, 39,],
    search: true,
    title: "愛媛県",
  },
  39: {
    id: 39,
    name: "kochi",
    neighbor: [36, 38,],
    search: true,
    title: "高知県",
  },
  40: {
    id: 40,
    name: "fukuoka",
    neighbor: [41, 43, 44,],
    search: true,
    title: "福岡県",
  },
  41: {
    id: 41,
    name: "saga",
    neighbor: [40, 42,],
    search: true,
    title: "佐賀県",
  },
  42: {
    id: 42,
    name: "nagasaki",
    neighbor: [41,],
    search: true,
    title: "長崎県",
  },
  43: {
    id: 43,
    name: "kumamoto",
    neighbor: [40, 44, 45, 46,],
    search: true,
    title: "熊本県",
  },
  44: {
    id: 44,
    name: "oita",
    neighbor: [40, 43, 45,],
    search: true,
    title: "大分県",
  },
  45: {
    id: 45,
    name: "miyazaki",
    neighbor: [43, 44, 46,],
    search: true,
    title: "宮崎県",
  },
  46: {
    id: 46,
    name: "kagoshima",
    neighbor: [43, 45,],
    search: true,
    title: "鹿児島県",
  },
  47: {
    id: 47,
    name: "okinawa",
    neighbor: [],
    search: true,
    title: "沖縄県",
  },
}