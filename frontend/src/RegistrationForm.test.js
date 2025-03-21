import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RegistrationForm from './RegistrationForm';

// Set up mock fetch before each test case

beforeEach(() => {
    // Mock the global fetch API with a default response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ prefectures: [] }),
    })
  );
});

// Clean up mock after each test 
afterEach(() => {
  jest.resetAllMocks();
});

// Test case: Successful registration flow
test('test successful registration displays success message', async () => {
  // Mock prefecture data for the form'prefecture  dropdown
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

  // Render the form on screen
  render(<RegistrationForm />);
  // Simulate user filling out all form fields with valid data
  await userEvent.type(screen.getByLabelText('ユーザー名:'), 'john');
  await userEvent.type(screen.getByLabelText('メールアドレス:'), 'john@wwe.com');
  await userEvent.type(screen.getByLabelText('パスワード:'), 'JohnCena#17');
  await userEvent.type(screen.getByLabelText('パスワード確認:'), 'JohnCena#17');
  await userEvent.type(screen.getByLabelText('都道府県:'), 'Tokyo');
  await userEvent.type(screen.getByLabelText('電話番号:'), '08012345678');

  // Simulate form submission
  await userEvent.click(screen.getByRole('button', { name: '登録' }));

  // Verify success message appears after form submission
  await waitFor(() => {
    expect(screen.getByText('登録が完了しました！')).toBeInTheDocument();
  });
});

// test error message after typing invalid email 

test('test error message after typing invalid email', async () => {
  render(<RegistrationForm />);
  
  const emailInput = screen.getByLabelText('メールアドレス:');
// Type an invalid email address
  await userEvent.type(emailInput, 'john@gmail');
  // Move focus to the next field, to wait for error to appear
  await userEvent.tab();  

  await waitFor(() => {
    expect(screen.getByText('有効なメールアドレスではありません。')).toBeInTheDocument();
  });
});

// test error message after password mismatch
test('test error message on password mismatch', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('ユーザー名:'), 'john');
  await userEvent.type(screen.getByLabelText('メールアドレス:'), 'john@wwe.com');
  // Type different passwords
  await userEvent.type(screen.getByLabelText('パスワード:'), 'JohnCena#17');
  await userEvent.type(screen.getByLabelText('パスワード確認:'), 'JohnCena#16');
// Move focus to the next field, to wait for error to appear
  await userEvent.tab();
// Verify error message appears after typing mismatched passwords
  await waitFor(() => {
    expect(screen.getByText('パスワードが一致しません。')).toBeInTheDocument();
  });
});

// test error message after typing short username
test('test error message on short username', async () => {
  render(<RegistrationForm />);
// Type a short username
  await userEvent.type(screen.getByLabelText('ユーザー名:'), 'ab');
  await userEvent.tab();

  // Verify error message appears after typing a short username
  await waitFor(() => {
    expect(screen.getByText('ユーザー名は3文字以上である必要があります。')).toBeInTheDocument();
  });
});

// test error message after typing short password
test('test error message on short password', async () => {
  render(<RegistrationForm />);

  // Type a short password
  await userEvent.type(screen.getByLabelText('パスワード:'), 'wwe25');
  await userEvent.tab();
 // Verify error message appears after typing a short password
  await waitFor(() => {
    expect(screen.getByText('パスワードは8文字以上である必要があります。')).toBeInTheDocument();
  });
});

// test error message after typing invalid prefecture
test('test error message when password is missing an uppercase letter', async () => {
  render(<RegistrationForm />);

  await userEvent.type(screen.getByLabelText('パスワード:'), 'johncena#17');
  await userEvent.tab();

  // Verify error message appears after typing  password without uppercase letter
  await waitFor(() => {
    expect(screen.getByText('大文字を追加してください。')).toBeInTheDocument();
  });
});

// test error message after typing invalid prefecture
test('displays error message when password is missing a lowercase letter', async () => {
  render(<RegistrationForm />);
// Type a password without lowercase letter
  await userEvent.type(screen.getByLabelText('パスワード:'), 'JOHNCENA#17');
  await userEvent.tab();

  // Verify error message appears after typing password without lowercase letter
  await waitFor(() => {
    expect(screen.getByText('小文字を追加してください。')).toBeInTheDocument();
  });
});

// test error message after typing invalid prefecture
test('displays error message when password is missing a digit', async () => {
  render(<RegistrationForm />);

  // Type a password without a digit
  await userEvent.type(screen.getByLabelText('パスワード:'), 'JohnCena#');
  await userEvent.tab();

  // Verify error message appears after typing password without a digit
  await waitFor(() => {
    expect(screen.getByText('数字を追加してください。')).toBeInTheDocument();
  });
});

// test error message after typing invalid prefecture
test('displays error message when phone number is non-numeric', async () => {
  render(<RegistrationForm />);

  // Type a non numeric phone number
  await userEvent.type(screen.getByLabelText('電話番号:'), 'abcd123');
  await userEvent.tab();

  // Verify error message appears after typing non numeric phonenumber
  await waitFor(() => {
    expect(screen.getByText('電話番号は数字のみで入力してください。')).toBeInTheDocument();
  });
});



