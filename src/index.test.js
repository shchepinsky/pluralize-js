import { pluralize_en, pluralize_ru, Txt } from './index'

const txt = new Txt({
  hello: {
    en: 'Hello! You have {count} {emails}.',
    ru: 'Привет! У вас {count} {emails}.',
  },
  emails: {
    en: pluralize_en({
      singular: 'Mail',
      plural: 'Mails',
    }),
    ru: pluralize_ru({
      1: 'Письмо',
      2: 'Письма',
      5: 'Писем',
    }),
  },
})

describe('EN', () => {
  it('switches lang', () => {
    const lang = 'en'
    Txt.setLang(lang)
    expect(Txt.lang).toBe(lang)
  })

  it('pluralize', () => {
    const singular = 'Mail'
    const plural = 'Mails'
    const mails = pluralize_en({
      singular,
      plural,
    })

    expect(mails(0)).toBe(plural)
    expect(mails(1)).toBe(singular)
  })

  it('translation with arguments', () => {
    const count = 0

    const result1 = txt.hello({
      count: count,
      emails: txt.emails(count),
    }).toLowerCase()

    expect(result1).toBe('hello! you have 0 mails.')
  })
})

describe('RU', () => {
  it('switches lang', () => {
    const lang = 'ru'
    Txt.setLang(lang)
    expect(Txt.lang).toBe(lang)
  })

  it('pluralize', () => {
    const one = 'Письмо'
    const two = 'Письма'
    const five = 'Писем'
    const mails = pluralize_ru({
      1: one,
      2: two,
      5: five,
    })

    expect(mails(0)).toBe(five)
    expect(mails(1)).toBe(one)
    expect(mails(2)).toBe(two)
  })

  it('translation with arguments', () => {
    const count = 0

    const result1 = txt.hello({
      count: count,
      emails: txt.emails(count),
    }).toLowerCase()

    expect(result1).toBe('привет! у вас 0 писем.')
  })
})
