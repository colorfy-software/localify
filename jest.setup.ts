process.env.JEST = 'true'

jest.mock('react-native-localize', () => require('react-native-localize/mock'))
jest.mock('i18n-js', () => {
  class I18nMock {
    store = () => jest.fn()
    enableFallback = true
    locale = 'en'
    defaultSeparator = '.'
    defaultLocale = 'en'
  }

  return {
    __esModule: true,
    I18n: I18nMock,
  }
})
