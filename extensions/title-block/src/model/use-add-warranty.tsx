import {
  useApplyCartLinesChange,
  useTranslate,
} from "@shopify/ui-extensions/checkout/preact";
import { useState } from "preact/hooks";
import { I18N } from "../pure-model/i18n-keys";
import { WARRANTY_TRACE_LINE_ATTRIBUTES } from "../pure-model/warranty-trace";

export const useAddWarranty = ({ variant }: { variant: string }) => {
  const translate = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const applyCartLinesChange = useApplyCartLinesChange();

  const clearError = () => setError(null);

  const handleAddWarranty = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await applyCartLinesChange({
        merchandiseId: variant,
        type: "addCartLine",
        quantity: 1,
        attributes: WARRANTY_TRACE_LINE_ATTRIBUTES,
      });
      if (result.type === "error") {
        setError(translate(I18N.addWarrantyError));
      }
    } catch {
      setError(translate(I18N.addWarrantyError));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    clearError,
    handleAddWarranty,
  };
};
