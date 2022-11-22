# Template
- Contentから受け取ったデータに従い、　DOMを作成する。

## 種類

## 状態
- Templateは繰り返し使用されるため、重複処理を防ぐために状態管理が必要となる。

| ID | 説明 |
| -- | -- |
| 0 | 未処理。 |
| 1 | `ready()`を実行した。 |
| 2 | `create()/parse()`を実行した。 |
| 3 | `window.css.attach()`を実行した。 |
| 4 | DOMに接続された。 |


