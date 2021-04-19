# tailwind 

PostCSS compatibility issues refer [here](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build).

```sh
# install compatible postcss, autoprefixer
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9

# init tailwind
npx tailwindcss init -p
```

Recommended vscode settings for this

```json
{
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.validate": false,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "plaintext": "html"
  },
  "tailwindCSS.emmetCompletions": true,
  "prettier.trailingComma": "all"
}
```

For intellisense for tailwind use this pluging - [Tailwind CSS IntelliSensePreview](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).
