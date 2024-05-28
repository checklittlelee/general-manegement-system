import globals from "globals"
import pluginJs from "@eslint/js"
import pluginVue from "eslint-plugin-vue"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // 添加 Node.js 全局变量支持
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
]
