import { Chip } from '@mui/material';
import { OrderStatus } from '../../../gql/graphql';

const colorMap: Record<
  OrderStatus,
  'warning' | 'info' | 'default' | 'success'
> = {
  [OrderStatus.Pending]: 'warning',
  [OrderStatus.Confirmed]: 'info',
  [OrderStatus.Cancelled]: 'default',
  [OrderStatus.Completed]: 'success',
};

export default function OrderStatusChip({
  status,
}: {
  status: OrderStatus;
}): JSX.Element {
  return (
    <Chip
      label={status}
      color={colorMap[status]}
      size="small"
      sx={{ margin: '0 1em' }}
    />
  );
}
