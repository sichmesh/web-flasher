export type Lang = "en" | "ua";

export const translations = {
  en: {
    nav: {
      website: "Website",
      cta: "Join Community",
    },
    flash: {
      label: "Web Flasher",
      comingSoonBadge: "Coming soon",
      comingSoonTitle: "Firmware is on its way",
      comingSoon:
        "The first public SICH firmware release is being prepared. Join the community to hear first when it is ready to flash.",
      comingSoonCta: "Join Discord",
      title: "Flash SICH Firmware",
      lead: "Install the latest SICH firmware straight from your browser — no drivers, no IDE. Connect your ESP32 over USB, pick your device, and click Flash.",
      deviceLabel: "Select your device",
      version: "Version",
      flashCta: "Flash",
      steps: [
        "Connect the SICH device to your computer with a USB-C cable.",
        "Choose your device model below.",
        'Click "Flash" and select the serial port in the browser prompt.',
        "Keep the cable connected until installation completes.",
      ],
      stepsTitle: "How it works",
      troubleTitle: "Not detected?",
      trouble:
        "If your board doesn't appear in the port list, hold the BOOT button while plugging in the cable (or while clicking Flash), then release it.",
      unsupportedTitle: "Browser not supported",
      unsupported:
        "Web flashing uses the Web Serial API, available only in desktop Chrome or Edge. Please open this page in one of those browsers on a computer.",
      capabilities: {
        label: "Firmware capabilities",
        title: "What SICH firmware can do",
        intro:
          "Version 1.0.0 packs a complete off-grid toolkit into a single device — mesh messaging, navigation, voice and full connectivity.",
        note: "The MeshCore and Reticulum compatibility profiles are experimental placeholders and will be tuned in future updates.",
        groups: [
          {
            title: "Communication & Mesh",
            intro:
              "Long-range LoRa mesh, compatible with the Meshtastic ecosystem.",
            items: [
              "LoRa radio on the Semtech SX1262 (E22-900M30S front-end)",
              "Receives Meshtastic text messages",
              "Rebroadcasts as a repeater, with implicit delivery ACK for broadcasts",
              "Compatibility profiles: SICH, Meshtastic, MeshCore, Reticulum",
              "Tunable radio: frequency 850–930 MHz, spreading factor, bandwidth, TX power −9…+22 dBm",
              "Heard-nodes list with ID, last-seen and RSSI",
            ],
          },
          {
            title: "Navigation & Time",
            intro: "Know where you are and keep accurate time, fully offline.",
            items: [
              "u-blox M10 GPS with AGPS warm-start",
              "Live GPS clock (Kyiv timezone), 12/24-hour",
              "QMC5883L digital compass",
            ],
          },
          {
            title: "Audio",
            intro: "Capture and play back voice directly on the device.",
            items: [
              "Voice recording via an INMP441 microphone",
              "Playback through a MAX98357A amplifier and speaker",
            ],
          },
          {
            title: "Connectivity & System",
            intro: "Set up and manage SICH from any phone or laptop.",
            items: [
              "Wi-Fi station + access point with captive portal and QR pairing",
              "Device-info screen with the full component list and firmware version",
              "Gold + Night interface, rotary-encoder navigation, boot splash and vector icons",
            ],
          },
        ],
      },
    },
    footer: {
      license: "Open source under GPL-3.0",
    },
  },
  ua: {
    nav: {
      website: "Сайт",
      cta: "Приєднатися",
    },
    flash: {
      label: "Веб-прошивальник",
      comingSoonBadge: "Незабаром",
      comingSoonTitle: "Прошивка вже в дорозі",
      comingSoon:
        "Готуємо перший публічний реліз прошивки SICH. Приєднуйтесь до спільноти, щоб першими дізнатися, коли її можна буде прошити.",
      comingSoonCta: "Приєднатися до Discord",
      title: "Прошивка SICH",
      lead: "Встановіть найновішу прошивку SICH прямо з браузера — без драйверів і середовищ розробки. Підключіть ESP32 через USB, оберіть пристрій і натисніть «Прошити».",
      deviceLabel: "Оберіть свій пристрій",
      version: "Версія",
      flashCta: "Прошити",
      steps: [
        "Підключіть пристрій SICH до комп’ютера кабелем USB-C.",
        "Оберіть модель свого пристрою нижче.",
        "Натисніть «Прошити» та виберіть послідовний порт у вікні браузера.",
        "Не від’єднуйте кабель до завершення встановлення.",
      ],
      stepsTitle: "Як це працює",
      troubleTitle: "Не визначається?",
      trouble:
        "Якщо плата не з’являється у списку портів, утримуйте кнопку BOOT під час підключення кабелю (або під час натискання «Прошити»), а потім відпустіть її.",
      unsupportedTitle: "Браузер не підтримується",
      unsupported:
        "Веб-прошивка використовує Web Serial API, доступний лише в десктопних Chrome або Edge. Будь ласка, відкрийте цю сторінку в одному з цих браузерів на комп’ютері.",
      capabilities: {
        label: "Можливості прошивки",
        title: "Що вміє прошивка SICH",
        intro:
          "Версія 1.0.0 вміщує повний офлайн-набір в одному пристрої — mesh-повідомлення, навігацію, голос і повноцінне підключення.",
        note: "Профілі сумісності MeshCore та Reticulum наразі експериментальні (заглушки) і будуть допрацьовані в наступних оновленнях.",
        groups: [
          {
            title: "Зв'язок і Mesh",
            intro: "Далекобійний LoRa-mesh, сумісний з екосистемою Meshtastic.",
            items: [
              "LoRa-радіо на Semtech SX1262 (підсилювач E22-900M30S)",
              "Приймає текстові повідомлення Meshtastic",
              "Працює ретранслятором із неявним підтвердженням доставки для широкомовних пакетів",
              "Профілі сумісності: SICH, Meshtastic, MeshCore, Reticulum",
              "Налаштування радіо: частота 850–930 МГц, фактор розширення, смуга, потужність −9…+22 дБм",
              "Список почутих вузлів: ID, час останнього контакту та RSSI",
            ],
          },
          {
            title: "Навігація та час",
            intro: "Визначай своє місце й тримай точний час — повністю офлайн.",
            items: [
              "GPS u-blox M10 з теплим стартом AGPS",
              "Живий GPS-годинник (київський час), 12/24 години",
              "Цифровий компас QMC5883L",
            ],
          },
          {
            title: "Аудіо",
            intro: "Запис і відтворення голосу прямо на пристрої.",
            items: [
              "Запис голосу через мікрофон INMP441",
              "Відтворення через підсилювач MAX98357A і динамік",
            ],
          },
          {
            title: "Підключення та система",
            intro: "Налаштовуй і керуй SICH з будь-якого телефона чи ноутбука.",
            items: [
              "Wi-Fi: клієнт + точка доступу з captive-порталом і QR-парингом",
              "Екран інформації про пристрій із повним переліком компонентів і версією прошивки",
              "Інтерфейс Gold + Night, навігація енкодером, заставка та векторні іконки",
            ],
          },
        ],
      },
    },
    footer: {
      license: "Відкритий код під GPL-3.0",
    },
  },
};

export type Dict = (typeof translations)["en"];
