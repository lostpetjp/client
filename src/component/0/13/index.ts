import { FromValidityManager, InputValidityManager, RecaptchaValidityManager } from "./class"

export default {
  js: [3,],
  type: "lostpetjp",
  component: FromValidityManager,
  plugins: [RecaptchaValidityManager, InputValidityManager,],
}