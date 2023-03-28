import CloseIcon from '@mui/icons-material/Close';
import {
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import OrderForm from '../../common/OrderForm';
import { OrderStatus } from '../../gql/graphql';
import OrderTable from './components/OrderTable';
import { defaultFilter, useOrdersPage } from './Orders.hook';

export default function Orders(): JSX.Element {
  const {
    currentUser,
    pageData,
    loading,
    showProgress,
    closeDialog,
    clickMenuItem,
    saveOrder,
    changeOwner,
    changeFilterOrderStatus,
    changeStartTime,
    changeEndTime,
  } = useOrdersPage();

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Grid container>
          <Typography
            component="h1"
            variant="h4"
            sx={{ flexGrow: 1, marginBottom: '1em' }}
          >
            Orders
          </Typography>
          {showProgress && <CircularProgress />}
        </Grid>

        <Grid
          sx={{ flexGrow: 1, marginBottom: '1em', marginTop: '10px' }}
          container
          spacing={2}
        >
          {currentUser?.role === 'admin' && (
            <Grid item>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="order-owner-label">Order owner</InputLabel>
                <Select
                  labelId="order-owner-label"
                  id="order-owner"
                  value={pageData.filter.all ? 'all' : 'me'}
                  onChange={changeOwner}
                  autoWidth
                  label="Order owner"
                >
                  <MenuItem value="me">Me</MenuItem>
                  <MenuItem value="all">Everyone</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="order-status-label">Status</InputLabel>
              <Select
                labelId="order-status-label"
                id="order-status"
                value={pageData.filter.status || 'all'}
                onChange={changeFilterOrderStatus}
                autoWidth
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={OrderStatus.Pending}>
                  {OrderStatus.Pending}
                </MenuItem>
                <MenuItem value={OrderStatus.Confirmed}>
                  {OrderStatus.Confirmed}
                </MenuItem>
                <MenuItem value={OrderStatus.Completed}>
                  {OrderStatus.Completed}
                </MenuItem>
                <MenuItem value={OrderStatus.Cancelled}>
                  {OrderStatus.Cancelled}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <MobileDateTimePicker
              label="Start time"
              defaultValue={defaultFilter.startTime}
              onAccept={changeStartTime}
            />
          </Grid>

          <Grid item>
            <MobileDateTimePicker
              label="End time"
              defaultValue={defaultFilter.endTime}
              onAccept={changeEndTime}
            />
          </Grid>
        </Grid>

        {currentUser && (
          <OrderTable
            orders={pageData.orders}
            loading={loading}
            currentUser={currentUser}
            filter={pageData.filter}
            onClickMenuItem={clickMenuItem}
          />
        )}
      </Paper>

      <Dialog open={!!pageData.editingOrder} onClose={closeDialog}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Edit order
          <IconButton
            aria-label="close"
            onClick={closeDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <OrderForm
            defaultValue={
              pageData.editingOrder
                ? {
                    expectedArrivalTime: dayjs(
                      pageData.editingOrder.expectedArrivalTime
                    ),
                    guestName: pageData.editingOrder.guestName,
                    phoneNumber: pageData.editingOrder.phoneNumber,
                    reservedTableSize:
                      pageData.editingOrder.reservedTableSize.toFixed(),
                  }
                : null
            }
            submitButtonText="Save"
            onSubmit={saveOrder}
            onValidationFailed={(errorMessage: string) => {
              enqueueSnackbar(errorMessage, { variant: 'error' });
            }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
