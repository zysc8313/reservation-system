import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { OrderFormData } from '../../common/OrderForm';
import { currentUserState, refetchOrdersState } from '../../core/atoms';
import { usePlaceOrder } from '../../hooks/usePlaceOrder';

export function useCheckoutPage() {
  const currentUser = useRecoilValue(currentUserState);
  const setRefetchOrdersState = useSetRecoilState(refetchOrdersState);
  const [pageData, setPageData] = useState<OrderFormData>();
  const [placeOrder, { data, loading, error }] = usePlaceOrder();

  const submit = async (order: OrderFormData) => {
    if (loading) return;

    await placeOrder({
      variables: {
        order: {
          expectedArrivalTime:
            order.expectedArrivalTime?.format('YYYY-MM-DD HH:mm'),
          guestName: order.guestName,
          phoneNumber: order.phoneNumber,
          reservedTableSize: Number.parseInt(order.reservedTableSize),
        },
      },
    }).catch(() => {
      /* do nothing */
    });
  };

  useEffect(() => {
    if (data) {
      if (currentUser) {
        setRefetchOrdersState(true);
      }

      setPageData({
        expectedArrivalTime: dayjs().add(1, 'hour'),
        guestName: '',
        phoneNumber: '',
        reservedTableSize: '',
      });
      enqueueSnackbar('Your order is successfully placed', {
        variant: 'success',
      });
    }

    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [data, error]);

  return { pageData, placeOrder: submit };
}
