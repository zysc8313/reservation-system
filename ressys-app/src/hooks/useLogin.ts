import { useMutation } from '@apollo/client';
import { graphql } from '../gql';

export const LOGIN = graphql(`
  mutation Login($input: LoginWithEmailInput!) {
    login(input: $input) {
      user {
        _id
        email
        role
      }
      token
    }
  }
`);

export function useLogin() {
  return useMutation(LOGIN);
}
