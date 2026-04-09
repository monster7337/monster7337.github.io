# V Elkah Site

Сайт антикафе "В Ёлках" на Next.js.

## Local Development

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## GitHub Pages

Для GitHub Pages статический экспорт включается только в CI через переменную `STATIC_EXPORT=true`.

Workflow деплоя находится в [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).

Локально можно проверить экспорт так:

```bash
set STATIC_EXPORT=true
npm run build
```
