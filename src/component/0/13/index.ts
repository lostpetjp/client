import { FromValidityManager, InputValidityManager, RecaptchaValidityManager } from "./class"

export default {
  css: [23,],
  js: [3,],
  type: "lostpetjp",
  component: FromValidityManager,
  plugins: [RecaptchaValidityManager, InputValidityManager,],
}