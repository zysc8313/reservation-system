import { QueryHookOptions, useQuery } from '@apollo/client';
import { graphql } from '../gql';
import {
  Exact,
  InputMaybe,
  OrderFilterInput,
  OrdersQuery,
} from '../gql/graphql';

const ORDERS = graphql(`
  query Orders($filter: OrderFilterInput) {
    orders(filter: $filter) {
      _id
      user {
        _id
        email
        role
      }
      guestName
      phoneNumber
      expectedArrivalTime
      reservedTableSize
      status
    }
  }
`);

export function useOrders(
  options: QueryHookOptions<
    OrdersQuery,
    Exact<{ filter?: InputMaybe<OrderFilterInput> | undefined }>
  >
) {
  return useQuery(ORDERS, options);
}
