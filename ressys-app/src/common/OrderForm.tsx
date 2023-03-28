import { Box, Button, Grid, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import validator from 'validator';

export interface OrderFormData {
  expectedArrivalTime: Dayjs | null;
  guestName: string;
  phoneNumber: string;
  reservedTableSize: string;
}

function useOrderForm({
  defaultValue,
  onValidationFailed,
  onSubmit,
}: {
  defaultValue?: OrderFormData | null;
  onValidationFailed?: (errorMessage: string) => void;
  onSubmit?: (data: OrderFormData) => void;
}) {
  const [data, setData] = useState<OrderFormData>(initState);

  useEffect(() => {
    setData(defaultValue ? defaultValue : initState);
  }, [defaultValue]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let errorMessage = '';

    do {
      if (!data.expectedArrivalTime) {
        errorMessage = 'Arrival time is required';
        break;
      }

      if (!data.expectedArrivalTime.isValid()) {
        errorMessage = 'Arrival time is invalid';
        break;
      }

      if (data.expectedArrivalTime.isBefore(dayjs())) {
        errorMessage = 'Arrival time must be in the future';
        break;
      }

      const guestName = data.guestName.trim();
      if (!guestName) {
        errorMessage = 'Guest name is required';
        break;
      }

      const phoneNumber = data.phoneNumber.trim();
      const regex =
        /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/im;
      if (!phoneNumber || !regex.test(phoneNumber)) {
        errorMessage = 'Phone number is invalid';
        break;
      }

      const reservedTableSize = data.reservedTableSize.trim();

      if (
        !reservedTableSize ||
        !validator.isInt(reservedTableSize, { gt: 0, lt: 51 })
      ) {
        errorMessage = 'Table size is invalid';
        break;
      }

      if (onSubmit) {
        onSubmit({
          expectedArrivalTime: data.expectedArrivalTime,
          guestName,
          phoneNumber,
          reservedTableSize,
        });
      }
      // eslint-disable-next-line no-constant-condition
    } while (false);

    if (errorMessage) {
      if (onValidationFailed) {
        onValidationFailed(errorMessage);
      } else {
        throw new Error(errorMessage);
      }
    }
  };

  return { data, setData, submit };
}

interface OrderFormProps {
  defaultValue?: OrderFormData | null;
  submitButtonText: string;
  onValidationFailed?: (errorMessage: string) => void;
  onSubmit?: (data: OrderFormData) => void;
}

const initState: OrderFormData = {
  expectedArrivalTime: dayjs().add(1, 'hour'),
  guestName: '',
  phoneNumber: '',
  reservedTableSize: '',
};

export default function OrderForm({
  defaultValue,
  submitButtonText,
  onSubmit,
  onValidationFailed,
}: OrderFormProps): JSX.Element {
  const { data, setData, submit } = useOrderForm({
    defaultValue,
    onSubmit,
    onValidationFailed,
  });

  return (
    <Grid
      container
      spacing={3}
      component="form"
      onSubmit={submit}
      sx={{
        marginTop: 0,
      }}
    >
      <Grid item xs={12}>
        <MobileDateTimePicker
          label="Arrival Time"
          value={data.expectedArrivalTime}
          onAccept={(newValue) =>
            setData((prev) => ({ ...prev, expectedArrivalTime: newValue }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="guestName"
          name="guestName"
          label="Guest name"
          fullWidth
          autoComplete="given-name"
          variant="standard"
          inputProps={{ maxLength: 50 }}
          value={data.guestName}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              guestName: e.target.value,
            }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="phoneNumber"
          name="phoneNumber"
          label="Phone number"
          fullWidth
          autoComplete="phone"
          variant="standard"
          inputProps={{ maxLength: 11 }}
          value={data.phoneNumber}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              phoneNumber: e.target.value,
            }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="tableSize"
          name="tableSize"
          label="Table size"
          fullWidth
          variant="standard"
          type="number"
          inputProps={{ min: 1, max: 50 }}
          value={data?.reservedTableSize}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              reservedTableSize: e.target.value,
            }))
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            {submitButtonText}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
