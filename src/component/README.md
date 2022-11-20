# Component

## 一覧
| ID | 説明 |
| -- | -- |
| 1 | Docカテゴリのテンプレート |
| 2 | 利用規約のコンテンツ |
| 3 | プライバシーポリシーのコンテンツ |

## 定型class
### テンプレート
```typescript
class A {
  id: number  // template id
  element: HTMLElement | DocumentFragment

  // 準備 (任意)
  ready(): Promise<void> {}

  /**
   * DOMを作成する (for SPA)
   **/
  create(): Promise<void> {
    this.element = ...
  }

  /**
   * DOMを解析する (for SSR)
   **/
  parse(): Promise<void> {
    this.element = ...
  }

  /**
   * contentを取り込む
   **/
  build(content: Content) {

  }
}
```

### コンテンツ
```typescript
class A {
  id: number  // template id
  element: HTMLElement | DocumentFragment

  // 準備 (任意)
  ready(): Promise<void> {}

  /**
   * DOMを作成する (for SPA)
   **/
  create(): Promise<void> {
    this.element = ...
  }

  /**
   * DOMを解析する (for SSR)
   **/
  parse(): Promise<void> {
    this.element = ...
  }

  /**
   * DOMにイベントを設定する
   **/
  attach() {

  }
}
```