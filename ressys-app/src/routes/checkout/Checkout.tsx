import { Container, Paper, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import OrderForm from '../../common/OrderForm';
import { useCheckoutPage } from './Checkout.hook';

export default function Checkout(): JSX.Element {
  const { pageData, placeOrder } = useCheckoutPage();

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" sx={{ marginBottom: '1em' }}>
          Make a reservation
        </Typography>
        <OrderForm
          defaultValue={pageData}
          submitButtonText="Place Order"
          onSubmit={placeOrder}
          onValidationFailed={(errorMessage: string) => {
            enqueueSnackbar(errorMessage, { variant: 'error' });
          }}
        />
      </Paper>
    </Container>
  );
}
