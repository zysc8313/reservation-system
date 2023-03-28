import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

const COMPLETE = graphql(`
  mutation CompleteOrder($id: String!) {
    completeOrder(id: $id)
  }
`);

export function useCompleteOrder() {
  return useMutation(COMPLETE);
}
