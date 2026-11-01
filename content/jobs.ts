import type { Locale } from '@/lib/i18n'

/** Background job texts (header pill, note, toast, notification). Small, because every page's client code imports it. */
export const JOBS: Record<Locale, {
  working: string; left: string; leftShort: string; canLeave: string; notifyMe: string; notifyOn: string
  ready: string; play: string; open: string; dismiss: string
}> = {
  en: {
    working: 'Generating your audio', left: 'About {n} s left', leftShort: '{n} s left', canLeave: 'You can browse other pages',
    notifyMe: "Notify me when it's ready", notifyOn: "We'll notify you when it's ready.",
    ready: 'Your audio is ready', play: 'Play', open: 'Open', dismiss: 'Dismiss',
  },
  es: {
    working: 'Generando tu audio', left: 'Faltan unos {n} s', leftShort: 'Faltan {n} s', canLeave: 'Puedes visitar otras páginas',
    notifyMe: 'Avísame cuando esté listo', notifyOn: 'Te avisaremos cuando esté listo.',
    ready: 'Tu audio está listo', play: 'Reproducir', open: 'Abrir', dismiss: 'Cerrar',
  },
  pt: {
    working: 'Gerando seu áudio', left: 'Faltam cerca de {n} s', leftShort: 'Faltam {n} s', canLeave: 'Você pode ver outras páginas',
    notifyMe: 'Avise-me quando estiver pronto', notifyOn: 'Vamos avisar quando estiver pronto.',
    ready: 'Seu áudio está pronto', play: 'Reproduzir', open: 'Abrir', dismiss: 'Fechar',
  },
  de: {
    working: 'Dein Audio wird erzeugt', left: 'Noch etwa {n} s', leftShort: 'Noch {n} s', canLeave: 'Du kannst andere Seiten öffnen',
    notifyMe: 'Benachrichtige mich, wenn es fertig ist', notifyOn: 'Wir benachrichtigen dich, wenn es fertig ist.',
    ready: 'Dein Audio ist fertig', play: 'Abspielen', open: 'Öffnen', dismiss: 'Schließen',
  },
  it: {
    working: 'Sto generando il tuo audio', left: 'Mancano circa {n} s', leftShort: 'Mancano {n} s', canLeave: 'Puoi visitare altre pagine',
    notifyMe: 'Avvisami quando è pronto', notifyOn: 'Ti avviseremo quando è pronto.',
    ready: 'Il tuo audio è pronto', play: 'Riproduci', open: 'Apri', dismiss: 'Chiudi',
  },
}
