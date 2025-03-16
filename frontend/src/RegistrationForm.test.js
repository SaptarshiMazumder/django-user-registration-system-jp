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

 test('shows error for existing username', async () => {
  // Mock failed response with username error
  fetch.mockResolvedValueOnce({
    ok: false,
    json: () => Promise.resolve({ 
      
    }),
  });

  render(<RegistrationForm />);

  // Fill form with valid data that will conflict on server
  fireEvent.change(screen.getByLabelText('Username:'), { 
    target: { value: 'picolo' } 
  });
  fireEvent.change(screen.getByLabelText('Email:'), { 
    target: { value: 'new@example.com' } 
  });
  fireEvent.change(screen.getByLabelText('Password:'), { 
    target: { value: 'SecurePass1' } 
  });
  fireEvent.change(screen.getByLabelText('Confirm Password:'), { 
    target: { value: 'SecurePass1' } 
  });
  fireEvent.change(screen.getByLabelText('Telephone:'), { 
    target: { value: '0987654321' } 
  });
  fireEvent.change(screen.getByLabelText('Prefecture:'), { 
    target: { value: '2' }  // Osaka
  });

  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    // Verify the API call was made
    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/auth/register/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          username: 'picolo',
          email: 'new@example.com',
          password: 'SecurePass1',
          password_confirm: 'SecurePass1',
          tel: '0987654321',
          pref: '2'
        }),
      })
    );

    // Verify error alert shows server message
    expect(alert).toHaveBeenCalledWith(
      expect.stringContaining('Something went wrong:')
    );
  });
});




});