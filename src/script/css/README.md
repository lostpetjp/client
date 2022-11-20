# CSS
`window.css`

## `load(id)`
- 指定したIDの`/styles/{id}.css`を読み込み、CSSをキャッシュする。
- この時点では、スタイルは有効にならない。

## `attach(component, ids)`
- 指定した全てのIDのCSSをマージして、1つのstyle要素を作成し、`document.head`に配置する。
- 既に指定した全てのIDのスタイルがDOMに反映されている場合は、処理を中止する。

