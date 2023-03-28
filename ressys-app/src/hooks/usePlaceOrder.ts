import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const PLACE_ORDER = graphql(`
  mutation PlaceOrder($order: PlaceOrderInput!) {
    placeOrder(order: $order) {
      _id
      status
      guestName
      phoneNumber
      reservedTableSize
      expectedArrivalTime
    }
  }
`);

export function usePlaceOrder() {
  return useMutation(PLACE_ORDER);
}
