import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

global.fetch = jest.fn();
global.alert = jest.fn();

describe('RegistrationForm', () => {
  test('successful registration with fireEvent', async () => {
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

    fireEvent.change(screen.getByLabelText('ユーザー名:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('メールアドレス:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('パスワード:'), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText('パスワード確認:'), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText('電話番号:'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('都道府県:'), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    await waitFor(() => {
      expect.stringContaining('登録が完了しました！')

    });
  });

test('shows error for existing username', async () => {
    const mockPrefs = [
      { id: 1, name: 'Tokyo' },
      { id: 2, name: 'Osaka' },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPrefs),
    });
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        ユーザー名: ['そのユーザー名を持つユーザーは既に存在します'],
      }),
    });

    render(<RegistrationForm />);

    
    fireEvent.change(screen.getByLabelText('ユーザー名:'), {
      target: { value: 'picolo' },
    });
    fireEvent.change(screen.getByLabelText('メールアドレス:'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('パスワード確認:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('電話番号:'), {
      target: { value: '0987654321' },
    });
    fireEvent.change(screen.getByLabelText('都道府県:'), {
      target: { value: '2' }, // Osaka
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    await waitFor(() => {
      
      expect.stringContaining('そのユーザー名のユーザーはすでに存在します')
    });
  });


test('shows error for existing email', async () => {
    const mockPrefs = [
      { id: 1, name: 'Tokyo' },
      { id: 2, name: 'Osaka' },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPrefs),
    });
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        email: ['このメールアドレスは既に登録されています。'],
      }),
    });

    render(<RegistrationForm />);

    
    fireEvent.change(screen.getByLabelText('ユーザー名:'), {
      target: { value: 'picolo' },
    });
    fireEvent.change(screen.getByLabelText('メールアドレス:'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('パスワード確認:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('電話番号:'), {
      target: { value: '0987654321' },
    });
    fireEvent.change(screen.getByLabelText('都道府県:'), {
      target: { value: '2' }, // Osaka
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    await waitFor(() => {
      
      expect.stringContaining('このメールアドレスは既に登録されています。')
    });
  });


  test('shows error for non numeral phone number', async () => {
    const mockPrefs = [
      { id: 1, name: 'Tokyo' },
      { id: 2, name: 'Osaka' },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPrefs),
    });
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
      phone: ['電話番号は数字のみで入力してください。'],
      }),
    });

    render(<RegistrationForm />);

    
    fireEvent.change(screen.getByLabelText('ユーザー名:'), {
      target: { value: 'picolo' },
    });
    fireEvent.change(screen.getByLabelText('メールアドレス:'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('パスワード確認:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('電話番号:'), {
      target: { value: 'y7trwfggffg' },
    });
    fireEvent.change(screen.getByLabelText('都道府県:'), {
      target: { value: '2' }, // Osaka
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/i }));

    await waitFor(() => {
      
    expect.stringContaining('電話番号は数字のみで入力してください。')
    });
  });


});
