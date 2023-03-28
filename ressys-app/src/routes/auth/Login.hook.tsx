import delay from 'delay';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import validator from 'validator';
import { currentUserState } from '../../core/atoms';
import { useLogin } from '../../hooks/useLogin';

export function useLoginPage() {
  const navigate = useNavigate();
  const setCurrentUser = useSetRecoilState(currentUserState);
  const { enqueueSnackbar } = useSnackbar();
  const [login, { data, loading, error }] = useLogin();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email')?.toString().trim();
    if (!email) {
      enqueueSnackbar('Email is required', { variant: 'error' });
      return;
    }
    if (!validator.isEmail(email)) {
      enqueueSnackbar('Email is invalid', { variant: 'error' });
      return;
    }

    const password = formData.get('password')?.toString();
    if (!password) {
      enqueueSnackbar('Password is required', { variant: 'error' });
      return;
    }

    await login({
      variables: {
        input: {
          email,
          password,
        },
      },
    }).catch(() => {
      /* do nothing */
    });
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }

    if (data) {
      Cookies.set('token', data.login.token);
      Cookies.set('user', JSON.stringify(data.login.user));
      setCurrentUser(data.login.user);
      delay(100).then(() => navigate('/'));
    }
  }, [data, error]);

  return { submit, loading };
}
