import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

// Mock global fetch and alert
global.fetch = jest.fn();
global.alert = jest.fn();

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });



  test('successful registration with fireEvent', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<RegistrationForm />);

    // Fill form using fireEvent.change
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText('Telephone:'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Prefecture:'), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/auth/register/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password1',
            password_confirm: 'Password1',
            tel: '1234567890',
            pref: '1'
          }),
        })
      );
      expect(alert).toHaveBeenCalledWith('You’re registered!');
    });
  });

 


});