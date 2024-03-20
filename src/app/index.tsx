import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useSwap } from '../hooks/useSwap.ts';

export const App = () => {
  const { usdtPrice, wethPrice } = useSwap();

  const [activePair, setActivePair] = useState('WETH_USDT');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [wethAmount, setWethAmount] = useState('');

  const isWethLoading = useMemo(
    () => !wethPrice && activePair === 'USDT_WETH' && usdtAmount,
    [activePair, usdtAmount, wethPrice],
  );

  const isUsdtLoading = useMemo(
    () => !usdtPrice && activePair === 'WETH_USDT' && wethAmount,
    [activePair, usdtPrice, wethAmount],
  );
  const resetFields = useCallback(() => {
    setUsdtAmount('');
    setWethAmount('');
  }, []);

  const handleSwap = () => {
    setActivePair(activePair === 'WETH_USDT' ? 'USDT_WETH' : 'WETH_USDT');
    resetFields();
  };

  const handleInputChange = useCallback(
    (currency: string) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const amount = e.target.value;

        if (!amount.trim()) {
          resetFields();
          return;
        }

        if (currency === 'USDT') {
          setUsdtAmount(amount);
          setWethAmount((parseFloat(amount) / usdtPrice).toString());
          return;
        }

        setWethAmount(amount);
        setUsdtAmount((parseFloat(amount) * wethPrice).toString());
      },
    [resetFields, usdtPrice, wethPrice],
  );

  useEffect(() => {
    if (activePair === 'WETH_USDT' && wethAmount) {
      setUsdtAmount((parseFloat(wethAmount) * wethPrice).toString());
      return;
    }

    if (!usdtAmount) {
      return;
    }

    setWethAmount((parseFloat(usdtAmount) / usdtPrice).toString());
  }, [activePair, usdtAmount, usdtPrice, wethAmount, wethPrice]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box display="flex" alignItems="center" gap="16px" marginBottom={2}>
        <TextField
          label="USDT"
          variant="outlined"
          value={isUsdtLoading ? 'Loading...' : usdtAmount}
          onChange={handleInputChange('USDT')}
          disabled={activePair === 'WETH_USDT'}
        />
        <TextField
          label="WETH"
          variant="outlined"
          value={isWethLoading ? 'Loading...' : wethAmount}
          onChange={handleInputChange('WETH')}
          disabled={activePair === 'USDT_WETH'}
        />
      </Box>

      <Button variant="contained" onClick={handleSwap}>
        Swap
      </Button>
    </Box>
  );
};
