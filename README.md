# task-03

Shopify-приложение с checkout UI extension **title-block**: upsell гарантии в checkout. Блок показывается, если в корзине есть товар с заполненным metafield **Warranty days**, и предлагает добавить отдельный variant гарантии одной кнопкой. Добавление через блок помечается атрибутами на line item (см. [docs/order-trace.md](docs/order-trace.md)).

Backend app нужен для OAuth и установки; логика upsell выполняется в extension на checkout.

## Требования

- Node.js 20.19+ (см. `package.json`)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) 4.x
- Development store с **Checkout extensibility**
- Partner account

## Запуск

```bash
cd task-03
npm install
shopify app dev -s <your-dev-store>.myshopify.com
```

CLI установит app на store (OAuth), поднимет tunnel и соберёт extension. Открой checkout с витрины магазина, не только preview в редакторе.

Публикация версии:

```bash
shopify app deploy
```

## Данные в админке для тестирования

### 1. Установить app

Через `shopify app dev` или **Partners → Apps → task-03 → Test on development store**.

### 2. Платежи (чтобы дойти до заказа)

**Settings → Payments** → включён **Тестовый платежный шлюз** (Bogus). В checkout в поле номера карты вводи **`1`** (успех), не `4242…` — это карты для Shopify Payments test mode.

### 3. Товары

Нужны **два** продукта (или один основной + один «гарантия»):

| Роль                  | Что настроить                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Основной товар**    | Опубликован в Online Store, можно добавить в корзину. Metafield **Warranty days** (`custom.warranty_days`, тип integer) — любое число **> 0**, например `365`. Без него блок в checkout не появится. |
| **Гарантия (upsell)** | Отдельный product/variant с ценой, **Available** и опубликован для storefront (extension читает variant через Storefront API).                                                                       |

Metafield **Warranty days** объявлен в [shopify.app.toml](shopify.app.toml); после deploy заполнить в **Products → [товар] → Metafields** (или через bulk editor).

Extension читает metafield продукта в namespace **`$app:custom`** / key **`warranty_days`** — это app-owned поле, связанное с определением в app. Если в админке видишь только `custom.warranty_days`, используй definition приложения после установки; значение должно быть непустым.

### 4. Checkout extension

**Settings → Checkout → Customize** → **Add app block** → **title-block** → разместить на странице checkout → **Save**.

| Setting             | Для теста                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Title**           | Заголовок блока (если пусто — в checkout будет «Default title»).                                 |
| **Add button text** | Текст кнопки (если пусто — «Add to cart»).                                                       |
| **Product variant** | Variant товара **гарантии** из шага 3. **Обязательно** — без него карточка и кнопка не работают. |

### 5. Сценарий проверки

1. На витрине: в корзину только **основной товар** (с Warranty days).
2. Checkout: виден блок title-block → **Add** → в order summary появилась строка гарантии.
3. Оплата тестовым шлюзом (`1` → Pay now).
4. **Orders** → заказ → на line item гарантии: `_warranty_source` = `title-block`, `Warranty source` = `Checkout upsell`.

Сравнение: добавь тот же variant гарантии с витрины без блока — в заказе не будет `_warranty_source`.
