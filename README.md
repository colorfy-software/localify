<h1 align="center">
  <a href="https://github.com/colorfy-software/localify/" target="_blank" rel="noopener noreferrer">
    🌍 Localify
  </a>
</h1>

<h4 align="center">
  <strong>Localization for React Native made simple.</strong>
</h4>

<p align="center">
  <a href="https://github.com/colorfy-software/localify/actions">
    <img src="https://github.com/colorfy-software/localify/workflows/Test%20Suite/badge.svg?branch=main" alt="Current GitHub Actions build status." />
  </a>
  <a href="https://www.npmjs.org/package/@colorfy-software/localify">
    <img src="https://badge.fury.io/js/@colorfy-software%2Flocalify.svg" alt="Current npm package version." />
  </a>
  <a href="https://github.com/colorfy-software/localify/contributing">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

## 🎯 Purpose

Localify helps you handle localization in your React Native apps with first class Typescript support: simply autocomplete your way through your translation files.

## 🏗️ Installation

```sh
yarn add @colorfy-software/localify react-native-localize i18n-js
npx pod-install ios --yes
```

## 💻 Usage

### Setup

#### App

```ts
// ./index.tsx

import { AppRegistry } from 'react-native'
import Localify from '@colorfy-software/localify'

import App from './src/App'

const translations = {
  en: require('./src/locales/en.ts'),
  de: require('./src/locales/de.ts'),
} as const

Localify.init({
  // mandatory
  translations,
  // optional
  defaultSeparator: '.',
  // optional
  fallback: { languageTag: 'en', isRTL: false },
})

AppRegistry.registerComponent('main', () => App)

```

#### Jest

```js
// ./jest.setup.js
// (or wherever you have your Jest config's setupFiles file)

process.env.JEST = true // add this line
```

### With TypeScript & autocomplete

<details>
<summary>See steps</summary>

```ts
// ./src/locales/index.ts
import Localify, { ValueMapType, currentLocale, currentLocaleCode } from '@colorfy-software/localify'

// Example of what en.ts has to look like:

// export default {
//   general: {
//     activity: 'Activity',
//     home: 'Home',
//     settings: 'Settings',
//     tips: 'Tips',
//     logout: 'Log out',
//   },
//   errors: {
//     requiredField: 'This field is required',
//     passwordTooLong: 'Password needs to be less than **{{maxLengthValue}}** characters long.',
//     invalidEmail:
//       "Sorry, **{{email}}** is not a valid email address. Please double check the email you've entered and try again.",
//     passwordRules:
//       'Your password must be **at least 8 characters long**, with at least three of the following kinds of characters: **uppercase, lowercase, number, and/or symbols**.',
//   },
// } as const

// 👆 notice the `as const`.

import type en from './en'

type ContextType = keyof typeof en

const getLocalizedString = <
  C extends ContextType,
  K extends keyof typeof en[C],
  V extends ValueMapType<typeof en[C][K] extends string ? typeof en[C][K] : never>,
  R extends typeof en[C][K],
>(
  context: C,
  key: K,
  ...values: keyof V extends never ? [never?] : [V]
): R => Localify.getLocalizedString(context, key, values)

export { currentLocale, currentLocaleCode, getLocalizedString }
```

This is required so that you can define your preferred language for the TypeScript-powered autocompletion. Now, you'd have to import everything from `./src/locales/index.ts` instead of the library, `getLocalizedString()` being the
most important here:

```ts
// ./src/App.tsx
import * as React from 'react'
import { StyleSheet, SafeAreaView, Text } from 'react-native'

import { currentLocale, getLocalizedString } from './locales'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        {currentLocale()}
        {getLocalizedString('general', 'home')}
        {getLocalizedString('errors', 'invalidEmail', { email: 'info@colorfy.me' })}
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})
```

</details>

### Without TypeScript/autocomplete

<details>
<summary>See steps</summary>

```ts
// ./src/App.tsx
import * as React from 'react'
import Localify from '@colorfy-software/localify'
import { StyleSheet, SafeAreaView, Text } from 'react-native'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        {Localify.currentLocale()}
        {Localify.getLocalizedString('general', 'settings')}
        {Localify.getLocalizedString('errors', 'passwordTooLong', { maxLengthValue: '50' })}
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})
```
</details>

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 💖 Code of Conduct

This library has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](https://github.com/colorfy-software/localify/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## 📰 License

localify is licensed under the [MIT License](https://github.com/colorfy-software/localify/blob/main/LICENSE).
