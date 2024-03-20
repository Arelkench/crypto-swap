import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useSwap } from '../hooks/useSwap.ts';

export const App = () => {
  const { usdtPrice, wethPrice } = useSwap();
  const [activePair, setActivePair] = useState('WETH_USDT');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [wethAmount, setWethAmount] = useState('');

  const handleSwap = () => {
    setActivePair(activePair === 'WETH_USDT' ? 'USDT_WETH' : 'WETH_USDT');
    setUsdtAmount('');
    setWethAmount('');
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currency: string,
  ) => {
    const amount = e.target.value;
    if (!amount.trim()) {
      setUsdtAmount('');
      setWethAmount('');
      return;
    }
    if (currency === 'USDT') {
      setUsdtAmount(amount);
      setWethAmount((parseFloat(amount) / usdtPrice).toString());
    } else {
      setWethAmount(amount);
      setUsdtAmount((parseFloat(amount) * wethPrice).toString());
    }
  };
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
      <Box display="flex" alignItems="center" marginBottom={2}>
        <TextField
          sx={{ marginRight: '16px' }}
          label="USDT"
          variant="outlined"
          value={
            !usdtPrice && activePair === 'WETH_USDT' && wethAmount
              ? 'loading...'
              : usdtAmount
          }
          onChange={(e) => handleInputChange(e, 'USDT')}
          disabled={activePair === 'WETH_USDT'}
        />
        <TextField
          label="WETH"
          variant="outlined"
          value={
            !wethPrice && activePair === 'USDT_WETH' && usdtAmount
              ? 'loading...'
              : wethAmount
          }
          onChange={(e) => handleInputChange(e, 'WETH')}
          disabled={activePair === 'USDT_WETH'}
        />
      </Box>

      <Button variant="contained" onClick={handleSwap}>
        Swap
      </Button>
    </Box>
  );
};
