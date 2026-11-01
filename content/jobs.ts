import type { Locale } from '@/lib/i18n'

/** Background job texts (header pill, note, toast, notification). Small, because every page's client code imports it. */
export const JOBS: Record<Locale, {
  working: string; left: string; leftShort: string; canLeave: string; notifyMe: string; notifyOn: string
  ready: string; play: string; pause: string; open: string; dismiss: string; notifyShort: string; notifyOnShort: string; speed: string; position: string
}> = {
  en: {
    working: 'Generating your audio', left: 'About {n} s left', leftShort: '{n} s left', canLeave: 'You can browse other pages',
    notifyMe: "Notify me when it's ready", notifyOn: "We'll notify you when it's ready.",
    ready: 'Your audio is ready', play: 'Play', pause: 'Pause', open: 'Open', dismiss: 'Dismiss',
    notifyShort: 'Notify me', notifyOnShort: 'On', speed: 'Playback speed', position: 'Position',
  },
  es: {
    working: 'Generando tu audio', left: 'Faltan unos {n} s', leftShort: 'Faltan {n} s', canLeave: 'Puedes visitar otras páginas',
    notifyMe: 'Avísame cuando esté listo', notifyOn: 'Te avisaremos cuando esté listo.',
    ready: 'Tu audio está listo', play: 'Reproducir', pause: 'Pausa', open: 'Abrir', dismiss: 'Cerrar',
    notifyShort: 'Avisarme', notifyOnShort: 'Activado', speed: 'Velocidad', position: 'Posición',
  },
  pt: {
    working: 'Gerando seu áudio', left: 'Faltam cerca de {n} s', leftShort: 'Faltam {n} s', canLeave: 'Você pode ver outras páginas',
    notifyMe: 'Avise-me quando estiver pronto', notifyOn: 'Vamos avisar quando estiver pronto.',
    ready: 'Seu áudio está pronto', play: 'Reproduzir', pause: 'Pausar', open: 'Abrir', dismiss: 'Fechar',
    notifyShort: 'Avisar-me', notifyOnShort: 'Ativado', speed: 'Velocidade', position: 'Posição',
  },
  de: {
    working: 'Dein Audio wird erzeugt', left: 'Noch etwa {n} s', leftShort: 'Noch {n} s', canLeave: 'Du kannst andere Seiten öffnen',
    notifyMe: 'Benachrichtige mich, wenn es fertig ist', notifyOn: 'Wir benachrichtigen dich, wenn es fertig ist.',
    ready: 'Dein Audio ist fertig', play: 'Abspielen', pause: 'Pause', open: 'Öffnen', dismiss: 'Schließen',
    notifyShort: 'Benachrichtigen', notifyOnShort: 'An', speed: 'Geschwindigkeit', position: 'Position',
  },
  it: {
    working: 'Sto generando il tuo audio', left: 'Mancano circa {n} s', leftShort: 'Mancano {n} s', canLeave: 'Puoi visitare altre pagine',
    notifyMe: 'Avvisami quando è pronto', notifyOn: 'Ti avviseremo quando è pronto.',
    ready: 'Il tuo audio è pronto', play: 'Riproduci', pause: 'Pausa', open: 'Apri', dismiss: 'Chiudi',
    notifyShort: 'Avvisami', notifyOnShort: 'Attivo', speed: 'Velocità', position: 'Posizione',
  },
}
