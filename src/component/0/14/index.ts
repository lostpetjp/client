import { SearchTemplate } from "./class"
import { SearchClear } from "./clear"
import { SearchCount } from "./count"
import { SearchFilter } from "./filter"
import { SearchSort } from "./sort"
import { SearchTab } from "./tab"

export default {
  js: [16, 17, 18, 24,],
  scope: "lostpetjp",
  type: "class",
  component: [
    SearchTemplate,
    SearchFilter,
    SearchClear,
    SearchSort,
    SearchTab,
    SearchCount,
  ],
}