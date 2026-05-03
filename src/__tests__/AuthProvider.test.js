import React from 'react';
import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AuthProvider from '../context/AuthProvider';
import AuthContext from '../context/AuthContext';

const mockAxios = new MockAdapter(axios);

const TestComponent = () => {
  const { user, apiCallLogin, apiCallRegister, ApiErrMsg, HandleLogOut } =
    React.useContext(AuthContext);

  return (
    <div>
      <button onClick={() => apiCallLogin({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={() => apiCallRegister({ email: 'test@example.com', password: 'password' })}>
        Register
      </button>
      <button onClick={HandleLogOut}>Logout</button>
      <div>{user ? `User: ${user}` : 'No user'}</div>
      {ApiErrMsg && <div>Error: {ApiErrMsg}</div>}
    </div>
  );
};

describe('AuthProvider', () => {
  afterEach(() => {
    mockAxios.reset();
    sessionStorage.clear();
  });

  it('logs in a user successfully', async () => {
    const token = 'mock-token';
    mockAxios.onPost('https://backend1.gridxmeter.com/signin').reply(200, { token });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByText(`User: ${token}`)).toBeInTheDocument();
  });

  it('handles login error', async () => {
    mockAxios.onPost('https://backend1.gridxmeter.com/signin').reply(401);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByText('Error: Unauthorized')).toBeInTheDocument();
    expect(screen.getByText('No user')).toBeInTheDocument();
  });

  it('registers a user successfully', async () => {
    const token = 'mock-token';
    mockAxios.onPost('https://backend1.gridxmeter.com/signup').reply(200, { token });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    expect(screen.getByText(`User: ${token}`)).toBeInTheDocument();
  });

  it('handles registration error', async () => {
    mockAxios.onPost('https://backend1.gridxmeter.com/signup').reply(409);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    expect(screen.getByText('Error: Account already registered')).toBeInTheDocument();
    expect(screen.getByText('No user')).toBeInTheDocument();
  });

  it('logs out a user', async () => {
    const token = 'mock-token';
    sessionStorage.setItem('Token', token);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByText('No user')).toBeInTheDocument();
    expect(sessionStorage.getItem('Token')).toBeNull();
  });
});
