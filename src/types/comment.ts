export type CommentItemHead = {
  author?: string
  owner?: 0 | 1
  trip?: string
}

export type CommentItemBody = {
  description: string
}

export type CommentItem = {
  body: CommentItemBody
  case: number
  head: CommentItemHead
  id: number
  parent: number
  private: 0 | 1
  status: 0 | 1
  created_at: number
  updated_at: number
  verified: 0 | 1
}

export type CommentItemList = Array<CommentItem>

