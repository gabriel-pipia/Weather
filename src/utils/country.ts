import * as countries from 'i18n-iso-countries/index';
const enLocale = require('i18n-iso-countries/langs/en.json');

countries.registerLocale(enLocale);

export function getCountryName(isoCode?: string): string {
  if (!isoCode) return '';
  try {
    const name = countries.getName(isoCode.toUpperCase(), 'en');
    return name || isoCode;
  } catch {
    return isoCode;
  }
}
