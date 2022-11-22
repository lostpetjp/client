# Document

## SPAとSSRの処理
- SPAとSSRで同一のDOMを作成する。
- SEOとOpengraphの問題がなくなれば、SSRは必要ない。

| 項目 | 説明 | SPA | SSR |
| -- | -- | -- | -- |
| URLの解析 | `location.pathname`に基づき、作成する文書を決定する。 | y | n |
| 文書の説明書を取得 | サーバーに問い合わせ、作成する文書の説明書(オブジェクト)を取得する。 | y | n |
| DOMの作成 | 説明書に従いDOMを作成する。 | y | n |
| イベントの作成 | 説明書に従い、DOMにイベントを設定する。 | y | y |

## URLの解析
- `location.pathname`、`location.search`が同じ場合は同一ページと判定する。

## DOMの作成
### 共通データ
- サーバー(PHP)とクライアント(JavaScript)で共通のデータを扱う。
- コンテンツの内容は今後の拡張性を考慮してJSONで表現する。

### 「テンプレート」と「コンテンツ」
- 「テンプレート」と「コンテンツ」という概念を扱う。
- 「テンプレート」とは、カテゴリごとのデザインである。
- 「コンテンツ」とは、ページごとのコンテンツ内容である。
- 「利用規約」と「プライバシーポリシー」のページは、共通の「テンプレート」を利用して、異なる「コンテンツ」を当てはめる。
- クライアント側でDOMを構築するには先に「テンプレートの作成」、次に「コンテンツの作成」という手順を経る。

### 手順
1. 文書の説明書を取得する。

```typescript
const docInfo = {
  css: Array<StyleId> // 使用するCSSのID
  template: TemplateId  // テンプレートID
  content: ContentId  // コンテンツID
  head: JSON  // document.headを表すJSON
  body: JSON  // document.bodyを表すJSON
}
```

2. 判明したテンプレートIDに従い、テンプレートのコントローラを用意する。

```typescript
const templateId = docInfo.template;

await import(templateId + ".js");

```

3. テンプレートのDOMを作成する。

```typescript
const template = new Template;

await template.ready();

const templateE = template.create();
```

4. コンテンツのDOMを作成する。

```typescript
// 文書の説明書に従い、DOMを作成する
const headerJSON = docInfo.header;
const bodyJSON = docInfo.body;
contentE = ...;
```

5. コンテンツにイベントを設定するコントローラを用意する。

```typescript
const contentId = docInfo.content;

await import(contentId + ".js");

const content = new Content;

await content.ready();
```

6. コンテンツをテンプレートに反映する

```typescript
templateE.appendChild(contentE);
```

7. テンプレートをdocumentに反映する

```typescript
document.body.appendChild(templateE);
```

8. イベントを設定する
```typescript
content.attach();
```

|手順|SPA|SSR|
|--|--|--|
|1|y|n|
|2|y|y|
|3|y|n|
|4|y|n|
|5|y|y|
|6|y|n|
|7|y|n|
|8|y|y|

