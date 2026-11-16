export type Lang = "en" | "ua";

export const translations = {
  en: {
    nav: {
      website: "Website",
      discord: "Discord",
      github: "GitHub",
    },
    hero: {
      label: "SICH firmware",
      title: "Web Flasher",
      lead: "Install or update SICH firmware right in your browser. No apps, no drivers, just a USB cable.",
      ready: "Web Serial ready",
      license: "Open source · GPL-3.0",
      unsupportedTitle: "This browser can't flash devices",
      unsupported:
        "Flashing uses Web Serial, which only desktop Chrome, Edge and Opera have. Open this page in one of them on a computer.",
    },
    steps: {
      device: {
        label: "Device",
        title: "Choose your device",
        desc: "Connect it with a USB data cable.",
        select: "Select device",
      },
      firmware: {
        label: "Firmware",
        title: "Pick a version",
        desc: "The latest stable release is selected for you.",
        soonDesc: "The first public release is on its way.",
        soon: "Coming soon",
      },
      flash: {
        label: "Flash",
        title: "Install it",
        desc: "Update and keep your data, or start clean.",
        cta: "Flash SICH",
        again: "Flash again",
        soon: "Coming soon",
      },
    },
    channel: { stable: "Stable", beta: "Beta" },
    picker: {
      title: "Select your device",
      all: "All",
      reference: "Reference",
      addTitle: "Your device here",
      addText: "Building hardware for SICH? Add your board with a pull request to",
    },
    notes: {
      whatsNew: "What's new",
      changelog: "Full changelog on GitHub",
      continue: "Continue",
    },
    dialog: {
      title: "Flash",
      connectTitle: "Connect the device",
      connectText:
        "Plug a USB-C data cable into the USB port. Not found in the list? Hold BOOT while plugging it in, then release.",
      typeTitle: "Install type",
      update: "Update · keep data",
      clean: "Clean install · erase all",
      flashTitle: "Flash",
      phases: { erase: "Erase", write: "Write", verify: "Verify" },
      ready: "Ready to install",
      cta: "Connect & flash",
      connecting: "Choose the port in the browser window…",
      done: "Done",
      retry: "Try again",
      success: "installed. The device is rebooting.",
      cancelled: "No port was selected.",
      failed: "Flashing failed:",
      showLog: "show log",
      hideLog: "hide log",
      close: "Close",
    },
    footer: {
      trademark: "SICH™ is a trademark of BFU Electronics LTD",
      license: "Open source under GPL-3.0",
    },
  },
  ua: {
    nav: {
      website: "Сайт",
      discord: "Discord",
      github: "GitHub",
    },
    hero: {
      label: "Прошивка SICH",
      title: "Web Flasher",
      lead: "Встановлюй або оновлюй прошивку SICH прямо в браузері. Без програм і драйверів, лише USB-кабель.",
      ready: "Web Serial готовий",
      license: "Відкритий код · GPL-3.0",
      unsupportedTitle: "Цей браузер не може прошивати пристрої",
      unsupported:
        "Прошивка працює через Web Serial, який є лише в Chrome, Edge та Opera на комп'ютері. Відкрий цю сторінку в одному з них.",
    },
    steps: {
      device: {
        label: "Пристрій",
        title: "Обери пристрій",
        desc: "Підключи його USB-кабелем для передачі даних.",
        select: "Обрати пристрій",
      },
      firmware: {
        label: "Прошивка",
        title: "Обери версію",
        desc: "Останній стабільний реліз уже обраний.",
        soonDesc: "Перший публічний реліз уже в дорозі.",
        soon: "Незабаром",
      },
      flash: {
        label: "Встановлення",
        title: "Встанови",
        desc: "Онови зі збереженням даних або встанови з нуля.",
        cta: "Прошити SICH",
        again: "Прошити ще раз",
        soon: "Незабаром",
      },
    },
    channel: { stable: "Стабільна", beta: "Бета" },
    picker: {
      title: "Обери свій пристрій",
      all: "Усі",
      reference: "Референсний",
      addTitle: "Тут може бути твій пристрій",
      addText: "Робиш залізо для SICH? Додай свою плату через pull request у",
    },
    notes: {
      whatsNew: "Що нового",
      changelog: "Повний список змін на GitHub",
      continue: "Далі",
    },
    dialog: {
      title: "Прошивка",
      connectTitle: "Підключи пристрій",
      connectText:
        "Встав USB-C кабель для передачі даних у порт USB. Немає у списку? Затисни BOOT, підключи кабель і відпусти.",
      typeTitle: "Тип встановлення",
      update: "Оновити · зберегти дані",
      clean: "З нуля · стерти все",
      flashTitle: "Прошивка",
      phases: { erase: "Стирання", write: "Запис", verify: "Перевірка" },
      ready: "Готово до встановлення",
      cta: "Підключити й прошити",
      connecting: "Обери порт у вікні браузера…",
      done: "Готово",
      retry: "Спробувати ще",
      success: "встановлено. Пристрій перезавантажується.",
      cancelled: "Порт не обрано.",
      failed: "Помилка прошивки:",
      showLog: "показати лог",
      hideLog: "сховати лог",
      close: "Закрити",
    },
    footer: {
      trademark: "SICH™ — торговельна марка BFU Electronics LTD",
      license: "Відкритий код під GPL-3.0",
    },
  },
};

export type Dict = (typeof translations)["en"];
