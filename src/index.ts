import { I18n } from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

type Split<Str, Sep extends string> = Str extends `${infer Part1}${Sep}${infer Part2}`
  ? [Part1, ...Split<Part2, Sep>]
  : [Str]
type ValueStringType<T> = T extends `${string}{{${infer R}}}${string}` ? R : never
type ValuesType<K extends Record<keyof K, string>> = {
  [key in ValueStringType<keyof K>]: string
}

export type SplitStringType<K extends string> = Split<K, ' '>
export type StringMapType<K extends string[]> = Record<K[number], string>
export type ValuesStringMap<K extends Record<keyof K, string>> = ValuesType<K>
export type ValueMapType<K extends string> = ValuesStringMap<StringMapType<SplitStringType<K>>>

const i18n = new I18n()

let languageTag = 'en'
let translations: object = { en: {} }
let fallback = { languageTag: 'en', isRTL: false }

const parseStringForValues = (string: string, values: Record<string, string>) => {
  const regex = /\{\{([^}]+)\}\}/g
  const matches = string.match(regex)

  if (matches) {
    matches.forEach(match => {
      const key = match.replace(/\{\{|\}\}/g, '')
      const valueToReplace = values[key]

      if (valueToReplace) {
        string = string.replace(match, valueToReplace)
      }
    })
  }

  return string
}

/**
 * Initializes Localify.
 * @param translations - `{ [locale: string]: object }`– Object containing the languages and their translations.
 * @param defaultSeparator - `{ [locale: string]: object }`– Optional. Separator used between the context and the key.
 * Defaults to `.`, ie: `errors.requiredEmail`.
 * @param parser - `(translatedString: string) => string`– Optional. Parser.
 * Defaults to returning the translated string as is
 * @param fallback - `{ languageTag: string; isRTL: boolean }`– Optional. Fallback language to use when the user's
 * device is set to a language that's not supported. Defaults to `{ languageTag: 'en', isRTL: false }`.
 */
export const initLocalify = <
  TranslationsType extends object,
  LanguageTagType extends Exclude<keyof TranslationsType, number | symbol>,
>({
  translations: translationsObj,
  defaultSeparator = '.',
  fallback: fallbackObj = {
    languageTag: ('en' in translationsObj ? 'en' : Object.keys(translationsObj)[0]) as LanguageTagType,
    isRTL: false,
  },
}: {
  translations: TranslationsType
  defaultSeparator?: string
  fallback?: { languageTag: LanguageTagType; isRTL: boolean }
}) => {
  fallback = fallbackObj
  translations = translationsObj

  i18n.store(translations)
  i18n.enableFallback = Boolean(fallback)
  const language = process.env.JEST
    ? { languageTag: 'en' }
    : /* istanbul ignore next */ // NOTE: Excluding native module from Jest coverage.
      RNLocalize.findBestAvailableLanguage(Object.keys(i18n.translations)) || fallback

  languageTag = language.languageTag
  i18n.locale = language.languageTag
  i18n.defaultSeparator = defaultSeparator
  i18n.defaultLocale = fallback.languageTag
}

/**
 * Full locale string.
 */
export const currentLocale = () => i18n.locale

/**
 * 2-character long locale code string.
 */
export const currentLocaleCode = () => i18n.locale.substring(0, 2)

/**
 * Fetches and returns a translation string inside a given context, based on the current device language.
 * @param context - `string`– The context in which the translation key is.
 * @param key - `string`– The translation key string.
 * @param values - `Record<string, string>`– Optional. Values for the variables used inside the translation string.
 * Defaults to `.`, ie: `errors.requiredEmail`.
 */
export const getLocalizedString = <ContextType, KeyType, StringValuesType, TranslatedStringType>(
  context: ContextType,
  key: KeyType,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...values: StringValuesType
): TranslatedStringType => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const string = (translations?.[languageTag]?.[context]?.[key] ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    translations?.[languageTag]?.default?.[context]?.[key]) as unknown as string
  let fallbackString = ''

  /* istanbul ignore next */ // NOTE: Excluding from Jest coverage as it uses the fallback language by default.
  if (!string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fallbackString = translations?.[fallback.languageTag]?.[context]?.[key] as unknown as string

    if (!fallbackString) {
      throw new Error(`[missing "${languageTag}.${context}.${String(key)}" translation]`)
    }
  }

  const stringValues: Record<string, string> = (values as Record<string, string>[])?.length
    ? Array.isArray((values as Record<string, string>[])[0])
      ? ((values as Record<string, string>[][])?.[0]?.[0] as Record<string, string>)
      : ((values as Record<string, string>[])[0] as Record<string, string>)
    : {}

  /* istanbul ignore next */ // NOTE: Excluding native module from Jest coverage as it uses the fallback language by default.
  return parseStringForValues(string || fallbackString, stringValues) as unknown as TranslatedStringType
}

const Localify = {
  /**
   * Full locale string.
   */
  currentLocale,
  /**
   * 2-character long locale code string.
   */
  currentLocaleCode,
  /**
   * Initializes Localify.
   * @param translations - `{ [locale: string]: object }`– Object containing the languages and their translations.
   * @param defaultSeparator - `{ [locale: string]: object }`– Optional. Separator used between the context and the key.
   * Defaults to `.`, ie: `errors.requiredEmail`.
   * @param fallback - `{ languageTag: string; isRTL: boolean }`– Optional. Fallback language to use when the user's
   * device is set to a language that's not supported.
   * Defaults to `{ languageTag: 'en', isRTL: false }`.
   */
  init: initLocalify,
  /**
   * Fetches and returns a translation string inside a given context, based on the current device language.
   * @param context - `string`– The context in which the translation key is.
   * @param key - `string`– The translation key string.
   * @param values - `Record<string, string>`– Optional. Values for the variables used inside the translation string.
   * Defaults to `.`, ie: `errors.requiredEmail`.
   */
  getLocalizedString,
}

export default Localify
