import { CommentManager } from "./class"
import { CommentSingle } from "./comment"
import { CommentThread } from "./thread"

export default {
  scope: "lostpetjp",
  type: "class",
  component: [
    CommentManager,
    CommentThread,
    CommentSingle,
  ],
}