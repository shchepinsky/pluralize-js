/**
 * Injects parameters into template string. Arguments are marked like *{arg}*
 * @param template {string} - source string to be processed
 * @param argMap {object} - values to be injected into template
 * @returns {string} result string with injected arguments
 */
function parametrize (template, argMap) {
  let result = template
  const argNames = Object.keys(argMap)
  for (const argName of argNames) {
    const argValue = argMap[argName]
    result = result.replace('{' + argName + '}', argValue)
  }

  return result
}

export function pluralize_en ({singular, plural}) {
  // In English it is simple
  return (count) => count === 1 ? singular : plural
}

export function pluralize_ru (variantByLastDigit) {
  const numberSort = (a, b) => a - b
  const digitsList = Object
    .keys(variantByLastDigit)
    .map(Number)
    .sort(numberSort)

  // in Russian it is not so simple, but can follow pattern 1, 2, 5...cycle 21
  return (count) => {
    const digit = count > 20
      ? count % 10
      : count

    // short circuit to direct matches first
    if (variantByLastDigit[digit]) {
      return variantByLastDigit[digit]
    }

    for (let i = 0; i < digitsList.length; i++) {
      const prevDigit = Number(digitsList[i])
      const nextDigit = Number(digitsList[i + 1] || Infinity)

      if (prevDigit < digit && digit < nextDigit) {
        return variantByLastDigit[prevDigit]
      }
    }

    const lastDigit = digitsList[digitsList.length - 1]
    return variantByLastDigit[lastDigit]
  }
}

export class Txt {
  static lang = 'en'

  static setLang (lang) {
    Txt.lang = lang
  }

  constructor (stringsByLang) {
    return new Proxy(stringsByLang, {
      get: (strings, propName) => {
        if (propName === 'setLang') {
          return Txt[propName]
        }

        const token = strings[propName][Txt.lang]

        if (typeof token === 'string') {
          // include valid prop names pattern enclosed in curly braces
          const parts = token.match(/{[a-zA-Z]+[\w]+}/)

          // parametrize only if template string is found
          return Array.isArray(parts)
            ? parametrize.bind(null, token)
            : token
        }

        return token
      },
    })
  }
}
