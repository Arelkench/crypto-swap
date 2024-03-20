import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import v2PairArtifact from '@uniswap/v2-periphery/build/IUniswapV2Pair.json';

export const useSwap = (): { usdtPrice: number; wethPrice: number } => {
  const [wethPrice, setWethPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(0);

  useEffect(() => {
    const ETH_USDT_V2 = '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852';
    const provider = new ethers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/2cf4c2d303e04a488fb9cb0619f60b5f',
    );
    const v2Pair = new ethers.Contract(
      ETH_USDT_V2,
      v2PairArtifact.abi,
      provider,
    );

    const calcWethPrice = (amount0In: string, amount1Out: string): number => {
      return 1 / (Number(amount0In) / Number(amount1Out) / 10 ** 12);
    };

    const calcUsdtPrice = (amount1In: string, amount0Out: string): number => {
      return (Number(amount1In) / Number(amount0Out)) * 10 ** 12;
    };

    const handleSwapEvent = (
      _: string,
      amount0In: string,
      amount1In: string,
      amount0Out: string,
      amount1Out: string,
      to: string,
    ) => {
      console.log(
        'WETH/USDT:',
        calcWethPrice(amount0In, amount1Out),
        'USDT/WETH:',
        calcUsdtPrice(amount1In, amount0Out),
      );

      const newWethPrice = calcWethPrice(amount0In, amount1Out);

      if (!isNaN(newWethPrice)) {
        setWethPrice(newWethPrice);
      }

      const newUsdtPrice = calcUsdtPrice(amount1In, amount0Out);

      if (!isNaN(newUsdtPrice)) {
        setUsdtPrice(calcUsdtPrice(amount1In, amount0Out));
      }
    };

    v2Pair.on('Swap', handleSwapEvent).catch((error: Error) => {
      console.error('Error subscribing to Swap event:', error);
    });

    // Cleanup function to unsubscribe from the event when the component unmounts
    return () => {
      v2Pair.off('Swap');
    };
  }, []);

  return { wethPrice, usdtPrice };
};
