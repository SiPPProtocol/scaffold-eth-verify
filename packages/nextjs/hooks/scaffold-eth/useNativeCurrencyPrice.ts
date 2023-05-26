import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { usePublicClient } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { fetchPriceFromUniswap } from "~~/utils/scaffold-eth";

const enablePolling = false;

/**
 * Get the price of Native Currency based on Native Token/DAI trading pair from Uniswap SDK
 * @returns nativeCurrencyPrice: number
 */
export const useNativeCurrencyPrice = () => {
  const publicClient = usePublicClient({ chainId: 1 });
  const [nativeCurrencyPrice, setNativeCurrencyPrice] = useState(0);

  // Get the price of ETH from Uniswap on mount
  useEffect(() => {
    (async () => {
      const price = await fetchPriceFromUniswap(publicClient);
      setNativeCurrencyPrice(price);
    })();
  }, [publicClient]);

  // Get the price of ETH from Uniswap at a given interval
  useInterval(
    async () => {
      const price = await fetchPriceFromUniswap(publicClient);
      setNativeCurrencyPrice(price);
    },
    enablePolling ? scaffoldConfig.pollingInterval : null,
  );

  return nativeCurrencyPrice;
};
