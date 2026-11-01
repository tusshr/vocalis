import type { Locale } from '@/lib/i18n'

/** Background job texts (header pill, note, toast, notification). Small, because every page's client code imports it. */
export const JOBS: Record<Locale, {
  working: string; left: string; keepBrowsing: string; notifyMe: string; notifyOn: string; installHint: string
  ready: string; play: string; open: string; dismiss: string
}> = {
  en: {
    working: 'Generating your audio', left: 'About {n} s left.', keepBrowsing: 'You can keep browsing the site; your audio keeps being made.',
    notifyMe: "Notify me when it's ready", notifyOn: "We'll notify you when it's ready.",
    installHint: "Add Vocalis to your Home Screen to get a notification when it's ready.",
    ready: 'Your audio is ready', play: 'Play', open: 'Open', dismiss: 'Dismiss',
  },
  es: {
    working: 'Generando tu audio', left: 'Faltan unos {n} s.', keepBrowsing: 'Puedes seguir navegando por el sitio; tu audio se sigue creando.',
    notifyMe: 'Avísame cuando esté listo', notifyOn: 'Te avisaremos cuando esté listo.',
    installHint: 'Añade Vocalis a tu pantalla de inicio para recibir un aviso cuando esté listo.',
    ready: 'Tu audio está listo', play: 'Reproducir', open: 'Abrir', dismiss: 'Cerrar',
  },
  pt: {
    working: 'Gerando seu áudio', left: 'Faltam cerca de {n} s.', keepBrowsing: 'Você pode continuar navegando no site; seu áudio continua sendo criado.',
    notifyMe: 'Avise-me quando estiver pronto', notifyOn: 'Vamos avisar quando estiver pronto.',
    installHint: 'Adicione o Vocalis à tela inicial para receber um aviso quando estiver pronto.',
    ready: 'Seu áudio está pronto', play: 'Reproduzir', open: 'Abrir', dismiss: 'Fechar',
  },
  de: {
    working: 'Dein Audio wird erzeugt', left: 'Noch etwa {n} s.', keepBrowsing: 'Du kannst die Seite weiter nutzen; dein Audio wird weiter erzeugt.',
    notifyMe: 'Benachrichtige mich, wenn es fertig ist', notifyOn: 'Wir benachrichtigen dich, wenn es fertig ist.',
    installHint: 'Füge Vocalis zum Home-Bildschirm hinzu, um eine Benachrichtigung zu bekommen, wenn es fertig ist.',
    ready: 'Dein Audio ist fertig', play: 'Abspielen', open: 'Öffnen', dismiss: 'Schließen',
  },
  it: {
    working: 'Sto generando il tuo audio', left: 'Mancano circa {n} s.', keepBrowsing: 'Puoi continuare a navigare nel sito; il tuo audio continua a essere creato.',
    notifyMe: 'Avvisami quando è pronto', notifyOn: 'Ti avviseremo quando è pronto.',
    installHint: 'Aggiungi Vocalis alla schermata Home per ricevere un avviso quando è pronto.',
    ready: 'Il tuo audio è pronto', play: 'Riproduci', open: 'Apri', dismiss: 'Chiudi',
  },
}
