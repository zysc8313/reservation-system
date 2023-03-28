import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../core/atoms';

type Props = { as: React.ElementType };

export const AuthRoute: React.FC<Props> = ({ as: Tag, ...props }) => {
  const currentUser = useRecoilValue(currentUserState);
  return currentUser ? <Navigate to="/" replace /> : <Tag {...props} />;
};
