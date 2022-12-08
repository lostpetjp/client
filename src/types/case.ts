import { AnimalId } from "./animal"
import { MatterId } from "./matter"
import { PrefectureId } from "./prefecture"

export type CasePhotoEntryList = Array<CasePhotoEntry>
export type CasePhotoEntry = [CasePhotoThumbnail, CasePhotoOriginal];
export type CasePhotoThumbnail = string
export type CasePhotoOriginal = string

export type CaseItemHead = {
  cover?: string
  location: string
  title?: string
  photos?: CasePhotoEntryList
  pet?: string
}

export type CaseListItem = {
  id: number
  animal: AnimalId
  matter: MatterId
  prefecture: PrefectureId
  created_at: number
  updated_at: number
  modified_at: number
  starts_at: number
  expires_at: null | number
  head: CaseItemHead
}

export type CaseListItemList = Array<CaseListItem>

/*
{
  "head": {
      "location": "尾張旭市 森林公園",
      "title": "スコティッシュフォールドを探しています",
      "photos": [
          [
              136935,
              136936
          ]
      ],
      "pet": "トーマス"
  },
  "id": 17108,
  "matter": 1,
  "animal": 2,
  "prefecture": 23,
  "created_at": 1664197198,
  "updated_at": 1664197218,
  "starts_at": 1662217200,
  "expires_at": null
}
*/