import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const UPDATE_ORDER = graphql(`
  mutation UpdateOrder($order: UpdateOrderInput!) {
    updateOrder(order: $order) {
      _id
      guestName
      phoneNumber
      reservedTableSize
      expectedArrivalTime
    }
  }
`);

export function useUpdateOrder() {
  return useMutation(UPDATE_ORDER);
}
