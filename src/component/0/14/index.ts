import { SearchTemplate } from "./class"
import { SearchClear } from "./clear"
import { SearchFilter } from "./filter"
import { SearchSort } from "./sort"

export default {
  js: [16,],
  scope: "lostpetjp",
  type: "class",
  component: [
    SearchTemplate,
    SearchFilter,
    SearchClear,
    SearchSort,
  ],
}