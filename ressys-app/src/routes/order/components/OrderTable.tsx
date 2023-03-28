import MoreIcon from '@mui/icons-material/MoreVert';
import {
  Chip,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Order, OrderStatus, User } from '../../../gql/graphql';
import {
  OrderActionMenu,
  OrderActionMenuItemData,
  OrderMenuAction,
} from './OrderActionMenu';
import OrderStatusChip from './OrderStatusChip';

interface OrderTableFilter {
  all: boolean;
  status?: OrderStatus | null;
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
}

interface OrderTableProps {
  currentUser: User;
  orders: Order[];
  loading: boolean;
  filter: OrderTableFilter;
  onClickMenuItem?: (
    order: Order,
    menuItem: OrderActionMenuItemData<OrderStatus>
  ) => void;
}

interface State {
  anchorEl?: HTMLElement | null;
  currentOrder?: Order | null;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const getMenuItemDataList = (
  order: Order,
  currentUser: User | null
): OrderActionMenuItemData<OrderStatus>[] | null => {
  const list: OrderActionMenuItemData<OrderStatus>[] = [];

  if (currentUser?.role === 'admin') {
    if (order.status === OrderStatus.Pending) {
      list.push({
        label: 'Edit',
        action: OrderMenuAction.Edit,
      });
      list.push({
        label: 'Cancel',
        action: OrderMenuAction.Confirm,
        data: OrderStatus.Confirmed,
      });
      list.push({
        label: 'Complete',
        action: OrderMenuAction.Cancel,
        data: OrderStatus.Cancelled,
      });
    } else if (order.status === OrderStatus.Confirmed) {
      list.push({
        label: 'Edit',
        action: OrderMenuAction.Edit,
      });
      list.push({
        label: 'Complete',
        action: OrderMenuAction.Complete,
        data: OrderStatus.Completed,
      });
      list.push({
        label: 'Cancel',
        action: OrderMenuAction.Cancel,
        data: OrderStatus.Cancelled,
      });
    }
  } else {
    if (order.status === OrderStatus.Pending) {
      list.push({
        label: 'Edit',
        action: OrderMenuAction.Edit,
      });
      list.push({
        label: 'Cancel',
        action: OrderMenuAction.Cancel,
        data: OrderStatus.Cancelled,
      });
    }
  }

  if (list.length === 0) {
    return null;
  }

  return list;
};

export default function OrderTable({
  currentUser,
  orders,
  loading,
  filter,
  onClickMenuItem,
}: OrderTableProps): JSX.Element {
  const [state, setState] = useState<State>({});

  const isDisableMoreButton = (order: Order): boolean => {
    return (getMenuItemDataList(order, currentUser)?.length || 0) === 0;
  };

  const handleShowMenu =
    (order: Order) => (event: React.MouseEvent<HTMLElement>) => {
      setState((prev) => ({
        ...prev,
        anchorEl: event.currentTarget,
        currentOrder: order,
      }));
    };

  const handleCloseMenu = () => {
    setState((prev) => ({ ...prev, anchorEl: null, currentOrder: null }));
  };

  const renderMenu = (): JSX.Element | null => {
    if (!state.anchorEl || !state.currentOrder) return null;
    const order = state.currentOrder;

    const items = getMenuItemDataList(order, currentUser);
    if (!items || items.length === 0) return null;

    return (
      <OrderActionMenu
        anchorEl={state.anchorEl}
        items={items}
        onClose={handleCloseMenu}
        onClickMenuItem={(menuItem) => {
          handleCloseMenu();
          if (onClickMenuItem) {
            onClickMenuItem(order, menuItem);
          }
        }}
      />
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {currentUser.role === 'admin' && (
                <StyledTableCell>User</StyledTableCell>
              )}

              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Guest name</StyledTableCell>
              <StyledTableCell>Phone number</StyledTableCell>
              <StyledTableCell>Arrival time</StyledTableCell>
              <StyledTableCell>Table size</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={currentUser?.role === 'admin' ? 7 : 6}>
                  No orders found
                </TableCell>
              </TableRow>
            )}
            {orders.map((row) => (
              <StyledTableRow key={row._id}>
                {currentUser.role === 'admin' && (
                  <StyledTableCell component="th" scope="row">
                    {row.user?.email}
                    <Chip
                      label={row.user ? row.user.role || 'user' : 'guest'}
                      color="default"
                      size="small"
                      variant="outlined"
                      sx={{ margin: '0 1em' }}
                    />
                    {currentUser.email === row.user?.email && filter.all && (
                      <Chip
                        label="you"
                        color="default"
                        size="small"
                        variant="outlined"
                        sx={{ margin: '0 1em' }}
                      />
                    )}
                  </StyledTableCell>
                )}
                <StyledTableCell>
                  <OrderStatusChip status={row.status} />
                </StyledTableCell>
                <StyledTableCell>{row.guestName}</StyledTableCell>
                <StyledTableCell>{row.phoneNumber}</StyledTableCell>
                <StyledTableCell>
                  {dayjs(row.expectedArrivalTime).format(
                    'MM / DD / YYYY hh:mm A'
                  )}
                </StyledTableCell>
                <StyledTableCell>{row.reservedTableSize}</StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    size="large"
                    onClick={handleShowMenu(row)}
                    color="inherit"
                    disabled={isDisableMoreButton(row)}
                  >
                    <MoreIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderMenu()}
    </>
  );
}
