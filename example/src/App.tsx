import * as React from 'react'
import Localify from '@colorfy-software/localify'
import reactStringReplace from 'react-string-replace'
import { StyleSheet, SafeAreaView, Text } from 'react-native'

import { currentLocale, getLocalizedString } from './locales'

const parseStringForBold = (string: string): Iterable<React.ReactNode> =>
  reactStringReplace(string, /\*\*(.*?)\*\*/g, (match, i) => (
    <Text key={i} style={{ fontWeight: 'bold' }}>
      {match}
    </Text>
  ))

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>{currentLocale()}</Text>
      <Text>----------------------</Text>
      {/* NOTE: With autocomplete ✅ */}
      <Text>{getLocalizedString('general', 'home')}</Text>
      <Text>{parseStringForBold(getLocalizedString('errors', 'invalidEmail', { email: 'info@colorfy.me' }))}</Text>
      <Text>----------------------</Text>
      {/* NOTE: Without autocomplete ❌ */}
      <Text>{Localify.getLocalizedString('general', 'settings')}</Text>
      <Text>
        {parseStringForBold(Localify.getLocalizedString('errors', 'passwordTooLong', { maxLengthValue: '50' }))}
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
