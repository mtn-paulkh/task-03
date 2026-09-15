import {
  getWarrantyCardProduct,
  WarrantyCardVariant,
} from "../pure-model/api";
import { useState, useEffect } from "preact/hooks";

export const useCard = ({ variant }: { variant: string }) => {
  const [card, setCard] = useState<WarrantyCardVariant | null>(null);
  useEffect(() => {
    getWarrantyCardProduct({ variant }).then((data) => {
      if (data) {
        setCard(data);
      } else {
        setCard(null);
      }
    });
  }, [variant]);

  return { card };
};
