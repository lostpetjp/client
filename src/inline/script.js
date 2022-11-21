// カラーテーマの反映
var t = localStorage.getItem("t");

if ("2" === t || ("1" !== t && matchMedia("(prefers-color-scheme:dark)").matches)) {
  document.documentElement.classList.replace("t1", "t2");
}

document.currentScript.remove();