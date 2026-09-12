# task-03 — Minimal Shopify App + Checkout Extension

Минимальное Shopify-приложение с одной Checkout UI extension `title-block`.
Extension показывает merchant-настройку **Title** в checkout (target: `purchase.checkout.block.render`).

## Стек

- Shopify App (React Router template) — OAuth shell
- Checkout UI extension `extensions/title-block` — единственная «фича»
- API version: `2026-07`

## Быстрый старт

### 1. Установить app на dev store

**Вариант A — через CLI (рекомендуется):**

```bash
cd task-03
shopify app dev -s test-lh0ojzye.myshopify.com
```

CLI откроет браузер для OAuth и установит app на store.

> Если tunnel падает (`cloudflared EPERM`) — запусти терминал от администратора или используй `--use-localhost --install-mkcert` (нужны права на установку CA).

**Вариант B — вручную через Partners Dashboard:**

1. [Dev Dashboard → task-03](https://dev.shopify.com/dashboard/233577832/apps/422061080577)
2. **Test on development store** → выбрать `test-lh0ojzye.myshopify.com`

**Вариант C — install link:**

```
https://admin.shopify.com/store/test-lh0ojzye/oauth/install?client_id=7390491037930ed495892bf47b45d215
```

### 2. Включить extension в checkout

1. Admin → **Settings → Checkout → Customize**
2. **Add app block** → **title-block**
3. Заполнить поле **Title** (например: `Welcome to our store`)
4. **Save**

### 3. Проверить

Добавь товар в корзину → перейди в checkout → увидишь heading с заданным title.

## Deploy

```bash
shopify app config validate --json   # проверка конфигов
shopify app deploy --allow-updates     # публикация версии
```

Последняя версия: **task-03-2** — [Dev Dashboard](https://dev.shopify.com/dashboard/233577832/apps/422061080577/versions/1124705173505)

## Структура extension

```
extensions/title-block/
├── shopify.extension.toml   # target + setting "title"
└── src/Checkout.jsx         # читает shopify.settings.value.title
```

### Код extension

```jsx
const title = shopify.settings.value.title ?? 'Default title';

return (
  <s-box padding="base">
    <s-heading>{title}</s-heading>
  </s-box>
);
```

Setting определяется в `shopify.extension.toml`:

```toml
[extensions.settings]
[[extensions.settings.fields]]
key = "title"
type = "single_line_text_field"
name = "Title"
description = "Text displayed in checkout"
```

---

## Пути получения данных

### A. Checkout UI Extension (без своего backend)

Данные **reactive** — уже в контексте checkout, fetch не нужен.

| API | Что даёт | Пример |
|-----|----------|--------|
| **Settings** | Merchant config | `shopify.settings.value.title` ← **наш кейс** |
| **Shop** | name, domain | `shopify.shop.myshopifyDomain` |
| **Cart Lines** | товары, qty, variant | `shopify.lines.value` |
| **Cost** | subtotal, total, tax | `shopify.cost.totalAmount` |
| **Buyer Identity** | email, phone, customer | `shopify.buyerIdentity.email` |
| **Localization** | currency, country, language | `shopify.localization.country.isoCode` |
| **Attributes** | cart note, custom attrs | `shopify.attributes` |
| **Metafields** | cart/shop/product meta | `shopify.appMetafields` |
| **Storage** | local KV в extension | `shopify.storage.read('key')` |
| **Analytics** | publish events | `shopify.analytics.publish('event', data)` |
| **Storefront API** | GraphQL из extension | `shopify.query(query, {variables})` (нужен `api_access = true`) |

Подписка на изменения:

```jsx
shopify.lines.subscribe((lines) => {
  console.log(lines);
});
```

### B. App Backend (Admin GraphQL)

Когда нужны products, orders, customers вне checkout sandbox:

```
Admin UI (embedded app)
    │ Session Token (JWT per request)
    ▼
App Backend (Node/Rails/etc.)
    │ Admin GraphQL API
    ▼
Shopify Admin (products, orders, metafields...)
```

- **Session Token** — `authenticate.admin(request)` в React Router template
- **Admin GraphQL** — scopes в `shopify.app.toml` (`write_products`, etc.)
- **Webhooks** — push events (`orders/create`, `app/uninstalled`)
- **Offline access token** — background jobs без user session

Для `title-block` backend **не используется** — Settings читаются напрямую в extension.

### C. Theme / Storefront (контекст)

| Путь | Где | Для чего |
|------|-----|----------|
| **Liquid** | Theme templates | `{{ product.title }}`, `{{ cart.item_count }}` |
| **Storefront GraphQL** | Headless storefront | Products, cart mutations |
| **Theme App Extensions** | Online Store theme | App blocks в theme (не checkout) |

### D. Кто задаёт данные

| Данные | Источник | Кто настраивает |
|--------|----------|-----------------|
| `title` | Extension Settings | Merchant в Checkout Editor |
| Cart / products | Checkout session | Покупатель |
| Shop info | Shop API | Shopify |
| Business logic data | Metafields / Admin API | App backend или Admin |

---

## Полезные команды

```bash
shopify app info              # app + extensions info
shopify app build             # build extensions
shopify store list            # dev stores
shopify organization list     # partner orgs
```

## Требования

- Node.js 18+
- Shopify CLI 4.x
- Dev store с **Checkout Extensibility** (Plus или compatible plan)
- Partner account
