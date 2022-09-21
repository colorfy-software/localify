import { AppRegistry } from 'react-native'
import Localify from '@colorfy-software/localify'

import App from './src/App'

const translations = {
  en: require('./src/locales/en.ts'),
  de: require('./src/locales/de.ts'),
} as const

Localify.init({ translations })

AppRegistry.registerComponent('main', () => App)
