# 📺 YouTube TTY + Neural Background

> Стилизация YouTube под **плоский фосфорный терминал** + живая **нейросетка на canvas**, реагирующая на курсор.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Firefox](https://img.shields.io/badge/Firefox-156+-orange.svg)](https://firefox.com)
[![Enhancer for YouTube](https://img.shields.io/badge/Enhancer%20for%20YouTube-required-blue.svg)](https://www.mrfdev.com/enhancer-for-youtube)

---

## 🎯 Что это

Набор из двух файлов (**CSS + JS**), превращающих YouTube в **TTY-терминал**:

- 🟢 **Плоский фосфорный зелёный** — без неона, свечения и теней
- 🔤 **Моноширный шрифт** везде (JetBrains Mono → Fira Code → Roboto Mono)
- ⬛ **Все углы квадратные** (`border-radius: 0` глобально)
- 🔴→🟢 **Красный YouTube → зелёный** (лого, прогресс-бар, LIVE, бейджи)
- 🌐 **Живая нейросетка на canvas** — реагирует на курсор, зелёная, приглушённая
- 🖤 **Панели (меню, плейлист, диалоги) — сплошной чёрный**
- 👁️ **Основная область (лента, видео) — прозрачная** — нейросетка видна
- 🔄 **Hover = инверсия** (зелёный фон + чёрный текст), как в реальном терминале

---

## 🚀 Установка

### Вариант 1 — Enhancer for YouTube (рекомендуется)

1. Установи [Enhancer for YouTube](https://www.mrfdev.com/enhancer-for-youtube).
2. Открой настройки расширения → **⚙️ → Внешний вид → Пользовательский CSS**.
3. Вставь содержимое [`src/neural-bg.css`](src/neural-bg.css).
4. Перейди в **⚙️ → Разное (Miscellaneous) → Пользовательский скрипт**.
5. Вставь содержимое [`src/neural-bg.js`](src/neural-bg.js).
6. Открой YouTube и нажми **Ctrl+F5** (жёсткая перезагрузка).

### Вариант 2 — Tampermonkey (только JS)

Оберни [`src/neural-bg.js`](src/neural-bg.js) в `==UserScript==`-шапку:

```javascript
// ==UserScript==
// @name         YouTube Neural Background
// @namespace    https://github.com/<username>/youtube-tty-neural
// @version      4.0.0
// @description  Neural network canvas background for YouTube TTY theme
// @author       <твой_ник>
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

// ... вставить содержимое neural-bg.js ...
```

CSS при этом всё равно нужно вставлять через Stylish / Stylus / Enhancer.

📖 Подробная инструкция: [`docs/INSTALL.md`](docs/INSTALL.md)

---

## 🎨 Быстрая кастомизация

### Другой оттенок (правь `:root` в CSS)

```css
/* Янтарный терминал */
--fg:        #ffb000;
--fg-dim:    #b87a00;
--fg-meta:   #ffcc66;
--fg-bright: #ffd77a;

/* Белый vt220 */
--fg:        #e0e0e0;
--fg-dim:    #808080;
--fg-meta:   #c0c0c0;
--fg-bright: #ffffff;

/* IBM 3270 голубой */
--fg:        #44aaff;
--fg-dim:    #1f5580;
--fg-meta:   #88ccff;
--fg-bright: #aaddff;
```

### Настройки нейросетки (объект `CFG` в JS)

| Параметр      | Что делает                | Значения                          |
|---------------|---------------------------|-----------------------------------|
| `color`       | Цвет сетки (RGB-строка)   | `'255, 176, 0'` — янтарь          |
| `density`     | Плотность точек           | `1/8000` плотно, `1/30000` редко  |
| `speed`       | Скорость движения         | `0.08` медленно, `0.35` быстро    |
| `linkDist`    | Длина связей              | `150` короткие, `280` длинные     |
| `mouseRadius` | Радиус курсора            | `150` узкий, `320` широкий        |
| `dotAlpha`    | Яркость точек             | `0.3` тускло, `0.8` ярко          |
| `lineAlpha`   | Яркость линий             | `0.05` тускло, `0.2` ярко         |
| `mouseBoost`  | Усиление у курсора        | `1.5` мягко, `3.5` вспышка        |

📖 Больше рецептов: [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md)

---

## 📋 Требования

- **Браузер:** Firefox 100+ / Chrome 100+ / Edge 100+ / Safari 15+
- **Расширение:** [Enhancer for YouTube](https://www.mrfdev.com/enhancer-for-youtube) **или** Tampermonkey + Stylus
- **Разрешение:** ≥ 1280×720 (нейросетка плотнее на больших экранах)

---

## 🐛 Известные проблемы

| Проблема                                   | Статус      | Решение                          |
|--------------------------------------------|-------------|----------------------------------|
| Чип-бар серый                              | ✅ Исправлено | `background: transparent` на обёртках |
| Сетка съезжает с 4 на 3 колонки            | ✅ Исправлено | `outline` вместо `border`       |
| Пропадает имя канала / исполнителя         | ✅ Исправлено | `--fg-meta: #4aff4a`            |
| Панели (плейлист, меню) мутные             | ✅ Исправлено | `#000` вместо `rgba(0,0,0,0.92)` |
| Пропадает длительность ролика              | ✅ Исправлено (v4) | Секция 22 в CSS              |
| Дублируется длительность ролика            | ✅ Исправлено (v4) | Убраны `visibility` / `opacity` форсы |

Если что-то не так — см. [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).

---

## 🤝 Contributing

1. Форкни репозиторий.
2. Создай ветку: `git checkout -b feature/my-fix`.
3. Коммит: `git commit -m "fix: ..."`.
4. Пуш: `git push origin feature/my-fix`.
5. Открой Pull Request.

**Правила PR:**
- Один фикс / фича — один PR.
- Прикладывай скриншоты «до / после».
- Соблюдай стиль существующего CSS (отступы — 4 пробела, секции пронумерованы).
- Обновляй `CHANGELOG.md` в разделе `[Unreleased]`.

---

## 📜 Лицензия

[MIT](LICENSE) © 2026 vigil33t-cmd

---

## 🙏 Благодарности

- [Enhancer for YouTube](https://www.mrfdev.com/enhancer-for-youtube) — за точки внедрения CSS/JS
- Deepseek
- Сообщество YouTube Power Users — за реверс-инжиниринг селекторов
- Все, кто репортил баги в issues
