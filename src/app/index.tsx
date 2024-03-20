import { ChangeEvent, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
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
    if (currency === 'USDT') {
      setUsdtAmount(amount);
      setWethAmount((parseFloat(amount) / usdtPrice).toString());
    } else {
      setWethAmount(amount);
      setUsdtAmount((parseFloat(amount) * wethPrice).toString());
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <TextField
          label="USDT"
          variant="outlined"
          value={usdtAmount}
          onChange={(e) => handleInputChange(e, 'USDT')}
          fullWidth
          disabled={activePair === 'WETH_USDT'}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="WETH"
          variant="outlined"
          value={wethAmount}
          onChange={(e) => handleInputChange(e, 'WETH')}
          fullWidth
          disabled={activePair === 'USDT_WETH'}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSwap}>
          Swap
        </Button>
      </Grid>
    </Grid>
  );
};
