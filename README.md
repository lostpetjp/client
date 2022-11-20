# client
LOSTPET.JP (迷子ペットのデータベース)のJavaScriptを管理するリポジトリ。

## 方針
- SPAとSSRを実現する。
- 必要最低限のファイル(css、js)を、適切に読み込む。

## Typescript
### 追記までは過去の話
Typescriptでの開発を下記の理由で断念した。

- 個別の機能(constructor)を、動的に拡張するのが難しい。

例えば、外部ファイルで読み込んだconstructor Aに対して下記のことがしたい。

```typescript
A.prototype.on = function() {}
```

「私にとっては」`this.on`は拡張によって必ず存在することが保証されている。必ず拡張してから`new A`が実行されるように外回りを設計するからだ。

```typescript
class A {
  hoge() {
    this.on();
  }

  on?: () => void
}
```
しかし、型チェックにおいては当然そうではないため、全ての場面で下記が強制される。これは苦痛でならない。

```typescript
class A {
  hoge() {
    if (this.on) this.on();
  }

  on?: () => void
}
```
もちろん、`if (this.on)`で確認するのは全面的に正しいし、そうするべきだ。`this.on`が関数でない可能性はあるから。しかし、私には無理。そもそも関数でない場合を想定するなら厳密にはフォローバックもしなくてはいけない。Typescriptは本当に楽しいし好きだが、このプロジェクトにおいては採用するのは現実的ではないと判断した。

### 追記
やはりTypescriptでの開発に未練があり、試行錯誤したところ、下記のように記述していくことで納得しました。  
動的なプロトタイプ拡張は、次のように実現できました。これで、動的に読み込んだ各classに、同一の機能を与える運用が可能となりました。

```typescript
type On = () => void

class A extends Common {
  hoge() {
    // 運用上、必ずメソッドなのでasでヒントを与える
    (this.on as On)();
  }
}

// 全てのファイルに含まれていてもサイズを圧迫しない
class Common {
  on?: On
}

// this.on()を使用できるようにプロトタイプ拡張をする
Object.setPropertyOf(A.prototype, {
  on: () => {},
});
```

### さらに追記
下記の記法の存在を知り、さらに自然に記述することが可能になった。

```typescript
class A extends Common {
  hoge() {
    // (this.on as On)();
    this.on!();
  }
}
```