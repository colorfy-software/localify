import Localify, { ValueMapType, currentLocale, currentLocaleCode } from '@colorfy-software/localify'

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
