import { atom } from 'recoil';
import { User } from '../gql/graphql';

export const currentUserState = atom<User | null>({
  key: 'CurrentUser',
  default: null,
});

export const refetchOrdersState = atom({
  key: 'RefetchOrders',
  default: false,
});
