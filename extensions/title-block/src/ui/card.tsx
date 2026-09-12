export const Card = ({
  src,
  title,
  description,
  price,
  isEmpty,
}: {
  isEmpty: boolean;
  src?: string;
  title?: string;
  description?: string;
  price?: string;
}) => {
  if (isEmpty) {
    return (
      <s-box padding="base" border="base" borderRadius="base">
        <s-stack direction="block" gap="small">
          Карточка товара не найдена
        </s-stack>
      </s-box>
    );
  }
  return (
    <s-box padding="base" border="base" borderRadius="base">
      <s-stack direction="block" gap="small">
        {src ? (
          <s-box maxBlockSize="30%" maxInlineSize="30%">
            <s-image src={src} alt={title ?? ""} />
          </s-box>
        ) : null}
        {price ? <s-text type="strong">{price}</s-text> : null}
        {title ? <s-heading>{title}</s-heading> : null}
        {description ? <s-text color="subdued">{description}</s-text> : null}
      </s-stack>
    </s-box>
  );
};
