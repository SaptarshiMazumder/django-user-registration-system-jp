import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RegistrationForm from './RegistrationForm';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ prefectures: [] }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('test successful registration displays success message', async () => {

   const mockPrefs = [
      { id: 1, name: 'Tokyo' },
      { id: 2, name: 'Osaka' },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPrefs),
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('ユーザー名:'), 'john');
  await userEvent.type(screen.getByLabelText('メールアドレス:'), 'john@wwe.com');
  await userEvent.type(screen.getByLabelText('パスワード:'), 'JohnCena#17');
  await userEvent.type(screen.getByLabelText('パスワード確認:'), 'JohnCena#17');
  await userEvent.type(screen.getByLabelText('都道府県:'), 'Tokyo');
  await userEvent.type(screen.getByLabelText('電話番号:'), '08012345678');


  await userEvent.click(screen.getByRole('button', { name: '登録' }));

  await waitFor(() => {
    expect(screen.getByText('登録が完了しました！')).toBeInTheDocument();
  });
});


test('test error message after typing invalid email', async () => {
  render(<RegistrationForm />);
  
  const emailInput = screen.getByLabelText('メールアドレス:');

  await userEvent.type(emailInput, 'john@gmail');
  await userEvent.tab();  

  await waitFor(() => {
    expect(screen.getByText('有効なメールアドレスではありません。')).toBeInTheDocument();
  });
});

test('test error message on password mismatch', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('ユーザー名:'), 'john');
  await userEvent.type(screen.getByLabelText('メールアドレス:'), 'john@wwe.com');
  await userEvent.type(screen.getByLabelText('パスワード:'), 'JohnCena#17');
  await userEvent.type(screen.getByLabelText('パスワード確認:'), 'JohnCena#16');

  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('パスワードが一致しません。')).toBeInTheDocument();
  });
});

test('test error message on short username', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('ユーザー名:'), 'ab');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('ユーザー名は3文字以上である必要があります。')).toBeInTheDocument();
  });
});

test('test error message on short password', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('パスワード:'), 'wwe25');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('パスワードは8文字以上である必要があります。')).toBeInTheDocument();
  });
});

test('test error message when password is missing an uppercase letter', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('パスワード:'), 'johncena#17');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('大文字を追加してください。')).toBeInTheDocument();
  });
});

test('displays error message when password is missing a lowercase letter', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('パスワード:'), 'JOHNCENA#17');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('小文字を追加してください。')).toBeInTheDocument();
  });
});

test('displays error message when password is missing a digit', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('パスワード:'), 'JohnCena#');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('数字を追加してください。')).toBeInTheDocument();
  });
});

test('displays error message when phone number is non-numeric', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('電話番号:'), 'abcd123');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('電話番号は数字のみで入力してください。')).toBeInTheDocument();
  });
});



