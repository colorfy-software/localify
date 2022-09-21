import Localify from '../index'
import en from '../../example/src/locales/en'

describe('🌍 Localify', () => {
  it('initLocalify() sets up the library', () => {
    expect(Localify.getLocalizedString('general', 'home')).toStrictEqual('[missing "en.general.home" translation]')
    Localify.init({
      translations: {
        en: require('../../example/src/locales/en'),
        de: require('../../example/src/locales/de'),
      },
    })
    expect(Localify.getLocalizedString('general', 'home')).toStrictEqual(en.general.home)
    expect.assertions(2)
  })
  it('exports the correct locale', () => {
    expect(Localify.currentLocale()).toStrictEqual('en')
    expect(Localify.currentLocaleCode()).toStrictEqual('en')
    expect.assertions(2)
  })
  it('getLocalizedString() outputs the expected string when no values are provided', () => {
    expect(Localify.getLocalizedString('general', 'home')).toStrictEqual(en.general.home)
    expect.assertions(1)
  })
  it('getLocalizedString() outputs the expected string when values are provided', () => {
    expect(Localify.getLocalizedString('errors', 'passwordTooLong', { maxLengthValue: '50' })).toStrictEqual(
      'Password needs to be less than **50** characters long.',
    )
    expect.assertions(1)
  })
})
