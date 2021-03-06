import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form } from '../../components/Form';
import { CREATE_USER } from '../../queries/CreateUser';
import { CreateUser, CreateUserVariables } from '../../queries/__generated__/CreateUser';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [createUser] = useMutation<CreateUser, CreateUserVariables>(CREATE_USER, {
    variables: {
      input: {
        email,
        password,
      },
    },
    onCompleted: async ({ createUser }) => {
      // TODO: decide on a better way to deal with autogenerated union types of this kind (e.g. type guards)
      if ('message' in createUser) {
        setErrorMessage(createUser.message);
      } else {
        await router.push('/login');
      }
    }
  })

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    await createUser();
  }, [createUser])

  return (
    <Form
      title='Sign Up'
      onSubmit={handleSubmit}
      errorMessage={errorMessage}
    >
      <Form.Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Form.Input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Form>
  );
};

export default Login;
