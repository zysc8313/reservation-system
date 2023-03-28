import { SelectChangeEvent } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { OrderFormData } from '../../common/OrderForm';
import { currentUserState, refetchOrdersState } from '../../core/atoms';
import { Order, OrderStatus, UpdateOrderInput } from '../../gql/graphql';
import { useCancelOrder } from '../../hooks/useCancelOrder';
import { useCompleteOrder } from '../../hooks/useCompleteOrder';
import { useConfirmOrder } from '../../hooks/useConfirmOrder';
import { useOrders } from '../../hooks/useOrders';
import { useUpdateOrder } from '../../hooks/useUpdateOrder';
import {
  OrderActionMenuItemData,
  OrderMenuAction,
} from './components/OrderActionMenu';

interface State {
  orders: Order[];
  editingOrder?: Order | null;
  filter: {
    all: boolean;
    status?: OrderStatus | null;
    startTime?: Dayjs | null;
    endTime?: Dayjs | null;
  };
}

export const defaultFilter: State['filter'] = {
  all: false,
  startTime: dayjs().startOf('day').subtract(1, 'week'),
  endTime: dayjs().endOf('day').add(1, 'month'),
};

export function useOrdersPage() {
  const currentUser = useRecoilValue(currentUserState);
  const [refetchOrders, setRefetchOrdersState] =
    useRecoilState(refetchOrdersState);

  const [confirmOrder, { data: cfmData }] = useConfirmOrder();
  const [cancelOrder, { data: cxData }] = useCancelOrder();
  const [completeOrder, { data: complData }] = useCompleteOrder();
  const [pageData, setPageData] = useState<State>({
    orders: [],
    filter: defaultFilter,
  });
  const { loading, error, data, refetch } = useOrders({
    variables: {
      filter: pageData.filter,
    },
  });
  const [updateOrder, { data: uoData, loading: uoLoading, error: uoError }] =
    useUpdateOrder();

  useEffect(() => {
    if (uoData) {
      const index = pageData.orders.findIndex(
        (order) => order._id === uoData.updateOrder._id
      );

      if (index !== -1) {
        pageData.orders[index] = {
          ...pageData.orders[index],
          expectedArrivalTime: uoData.updateOrder.expectedArrivalTime,
          guestName: uoData.updateOrder.guestName,
          phoneNumber: uoData.updateOrder.phoneNumber,
          reservedTableSize: uoData.updateOrder.reservedTableSize,
        };
        setPageData((prev) => ({ ...prev, orders: [...pageData.orders] }));
      }

      enqueueSnackbar('Order is successfully updated', {
        variant: 'success',
      });
    }

    if (uoError) {
      enqueueSnackbar(uoError.message, { variant: 'error' });
    }
  }, [uoData, uoError]);

  useEffect(() => {
    if (refetchOrders) {
      setRefetchOrdersState(false);
      refetch();
    }
  }, [refetchOrders]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }

    if (data) {
      setPageData((prev) => ({ ...prev, orders: [...data.orders] }));
    }
  }, [data, error]);

  useEffect(() => {
    handleChangedOrderStatus(
      !!cfmData,
      OrderStatus.Confirmed,
      cfmData?.confirmOrder
    );
  }, [cfmData]);

  useEffect(() => {
    handleChangedOrderStatus(
      !!cxData,
      OrderStatus.Cancelled,
      cxData?.cancelOrder
    );
  }, [cxData]);

  useEffect(() => {
    handleChangedOrderStatus(
      !!complData,
      OrderStatus.Completed,
      complData?.completeOrder
    );
  }, [complData]);

  const handleChangedOrderStatus = (
    hasData: boolean,
    status: OrderStatus,
    orderId?: string | null
  ) => {
    if (hasData) {
      if (!orderId) {
        enqueueSnackbar('Operation failed', {
          variant: 'error',
        });
      }
    } else {
      return;
    }

    enqueueSnackbar('Order status has been successfully updated', {
      variant: 'success',
    });

    const index = pageData.orders.findIndex((order) => order._id === orderId);

    if (index !== -1) {
      pageData.orders[index] = {
        ...pageData.orders[index],
        status,
      };
      setPageData((prev) => ({ ...prev, orders: [...pageData.orders] }));
    }
  };

  const closeDialog = () => {
    setPageData((prev) => ({ ...prev, editingOrder: null }));
  };

  const clickMenuItem = (
    order: Order,
    menuItemData: OrderActionMenuItemData<OrderStatus>
  ) => {
    if (menuItemData.action === OrderMenuAction.Edit) {
      setPageData((prev) => ({
        ...prev,
        editingOrder: order,
      }));
    } else {
      handleChangeOrderStatus(order, menuItemData.data!);
    }
  };

  const handleChangeOrderStatus = async (order: Order, status: OrderStatus) => {
    if (status === OrderStatus.Confirmed) {
      await confirmOrder({
        variables: {
          id: order._id,
        },
      }).catch(() => {
        /* do nothing */
      });
    } else if (status === OrderStatus.Cancelled) {
      await cancelOrder({
        variables: {
          id: order._id,
        },
      }).catch(() => {
        /* do nothing */
      });
    } else if (status === OrderStatus.Completed) {
      await completeOrder({
        variables: {
          id: order._id,
        },
      }).catch(() => {
        /* do nothing */
      });
    }
  };

  const changeOwner = (event: SelectChangeEvent) => {
    const filter = {
      ...pageData.filter,
      all: event.target.value === 'all',
    };

    setPageData((prev) => ({
      ...prev,
      filter,
    }));

    filterOrders(filter);
  };

  const changeFilterOrderStatus = (event: SelectChangeEvent) => {
    const status = event.target.value as unknown as OrderStatus;
    const filter = {
      ...pageData.filter,
      status: typeof OrderStatus[status] === 'undefined' ? null : status,
    };

    setPageData((prev) => ({
      ...prev,
      filter,
    }));

    filterOrders(filter);
  };

  const changeStartTime = (value: Dayjs | null) => {
    const filter = {
      ...pageData.filter,
      startTime: value,
    };

    setPageData((prev) => ({
      ...prev,
      filter,
    }));

    filterOrders(filter);
  };

  const changeEndTime = (value: Dayjs | null) => {
    const filter = {
      ...pageData.filter,
      endTime: value,
    };

    setPageData((prev) => ({
      ...prev,
      filter,
    }));

    filterOrders(filter);
  };

  const filterOrders = (filter: State['filter']) => {
    refetch({
      filter: {
        ...filter,
        startTime: filter.startTime?.format('YYYY-MM-DD HH:mm'),
        endTime: filter.endTime?.format('YYYY-MM-DD HH:mm'),
      },
    });
  };

  const saveOrder = async (data: OrderFormData) => {
    const order = pageData.editingOrder;
    closeDialog();

    if (uoLoading || !order) return;

    const updates: UpdateOrderInput = {
      _id: order._id,
    };

    if (!data.expectedArrivalTime?.isSame(order.expectedArrivalTime)) {
      updates.expectedArrivalTime =
        data.expectedArrivalTime?.format('YYYY-MM-DD HH:mm');
    }

    if (order.guestName !== data.guestName) {
      updates.guestName = data.guestName;
    }

    if (order.phoneNumber !== data.phoneNumber) {
      updates.phoneNumber = data.phoneNumber;
    }

    if (order.reservedTableSize.toFixed() !== data.reservedTableSize) {
      updates.reservedTableSize = Number.parseInt(data.reservedTableSize);
    }

    if (Object.keys(updates).length === 1) return;

    await updateOrder({
      variables: {
        order: updates,
      },
    }).catch(() => {
      /* do nothing */
    });
  };

  return {
    currentUser,
    pageData,
    loading,
    showProgress: loading || uoLoading,
    closeDialog,
    clickMenuItem,
    saveOrder,
    changeOwner,
    changeFilterOrderStatus,
    changeStartTime,
    changeEndTime,
  };
}
