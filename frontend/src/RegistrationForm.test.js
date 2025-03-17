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

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText('Telephone:'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Prefecture:'), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('You’re registered!');
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
        username: ['A user with that username already exists'],
      }),
    });

    render(<RegistrationForm />);

    
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'picolo' },
    });
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('Telephone:'), {
      target: { value: '0987654321' },
    });
    fireEvent.change(screen.getByLabelText('Prefecture:'), {
      target: { value: '2' }, // Osaka
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      
      expect.stringContaining('There was an error')
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
        email: ['Email address is already registered.'],
      }),
    });

    render(<RegistrationForm />);

    
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'picolo' },
    });
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('Telephone:'), {
      target: { value: '0987654321' },
    });
    fireEvent.change(screen.getByLabelText('Prefecture:'), {
      target: { value: '2' }, // Osaka
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      
      expect.stringContaining('Email address is already registered.')
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
        phone: ['Phone number should be just numbers.'],
      }),
    });

    render(<RegistrationForm />);

    
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'picolo' },
    });
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), {
      target: { value: 'SecurePass1' },
    });
    fireEvent.change(screen.getByLabelText('Telephone:'), {
      target: { value: 'y7trwfggffg' },
    });
    fireEvent.change(screen.getByLabelText('Prefecture:'), {
      target: { value: '2' }, // Osaka
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      
      expect.stringContaining('Phone number should be just numbers.')
    });
  });


});



