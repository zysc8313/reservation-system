import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const CONFIRM = graphql(`
  mutation ConfirmOrder($id: String!) {
    confirmOrder(id: $id)
  }
`);

export function useConfirmOrder() {
  return useMutation(CONFIRM);
}
