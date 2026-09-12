import { useApplyCartLinesChange } from "@shopify/ui-extensions/checkout/preact";
import { useState } from "preact/hooks";
import { WARRANTY_TRACE_LINE_ATTRIBUTES } from "../pure-model/warranty-trace";

const BUYER_ERROR_MESSAGE =
  "Couldn't add warranty to your cart. Please try again.";

export const useAddWarranty = ({ variant }: { variant: string }) => {
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
        setError(BUYER_ERROR_MESSAGE);
      }
    } catch {
      setError(BUYER_ERROR_MESSAGE);
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
