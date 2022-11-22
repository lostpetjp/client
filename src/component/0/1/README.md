# DocTemplate

## 対応するコンテンツ
- 利用規約
- プライバシー
- お問い合わせ

## HTML
```html
<article>
  <header>
    <h1>{title}</h1>
  </header>
  {body}
</article>
```

## Content Object
- 下記のオブジェクトを受け取り、コンテンツを書き換える。

```typescript
{
  title: string // {title}
  body: HTMLElement | DocumentFragment  // {body}
}
```
