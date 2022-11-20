# Json2Node
- クライアントとサーバーで同じ結果を出力できるように、HTMLをJSONで表現する
- `innerHTML`を扱わないのは、俗に言う宗教上の理由(`innerHTML`が嫌い)。

## Usage
```typescript
window.element.create({
  attribute: {
    class: "aaa",
  },
  children: "Hello",
  tagName: "div",
});

// <div class="aaa">Hello</div>
```
