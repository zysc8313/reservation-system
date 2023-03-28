import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const CANCEL = graphql(`
  mutation CancelOrder($id: String!) {
    cancelOrder(id: $id)
  }
`);

export function useCancelOrder() {
  return useMutation(CANCEL);
}
