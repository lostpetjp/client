import { Win } from "./window"
import { Factory, features } from "./factory"
import { DocumentData } from "./document"
import { DefaultCSSEntryList } from "./css"

export type ServerOptions = {
  css: DefaultCSSEntryList
  document: DocumentData
  version: number
}

(function () {
  /**
     * サーバーから受け取る情報
     */
  Object.setPrototypeOf(Win.prototype, features);

  const win = new Win(self.a! as unknown as ServerOptions);

  self["a"] = undefined;

  if ("dev.lostpet.jp" === location.hostname) {
    self["win"] = win;
  }

  /**
   * localStorageに無駄なデータを残さない (Recaptchaなど)
   */
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    var keyName = localStorage.key(i);
    if (keyName && keyName.length > 1) localStorage.removeItem(keyName);
  }

  /**
   * preload用のlink要素を削除する
   */
  for (var i = 0, a = document.querySelectorAll("[rel='preload']"); a.length > i; i++) {
    a[i].remove();
  }

  /**
   * script要素を削除する
   */
  (document.currentScript as HTMLOrSVGScriptElement).remove();
}());

