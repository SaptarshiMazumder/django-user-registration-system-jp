import { render, screen, fireEvent, act } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

global.fetch = jest.fn();

test('clicking register sends data to the right URL and shows success', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ prefs: [{ id: 1, name: 'Tokyo' }, { id: 2, name: 'Osaka' }] })
  });

  await act(async () => {
    render(<RegistrationForm />);
  });

  await screen.findByText('Tokyo');

  const fetchSpy = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    })
  );
  global.fetch.mockImplementationOnce(fetchSpy);

  fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'jimmy' } });
  fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jimmy@gmail.com' } });
  fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password123' } });
  fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password123' } });
  fireEvent.change(screen.getByLabelText('Telephone:'), { target: { value: '1234567890' } });

  window.alert = jest.fn();

  await act(async () => {
    fireEvent.click(screen.getByText('Register'));
  });

  await new Promise(resolve => setTimeout(resolve, 100));

  expect(fetchSpy).toHaveBeenCalledWith(
    'http://127.0.0.1:8000/auth/register/',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'jimmy',
        email: 'jimmy@gmail.com',
        password: 'Password123',
        password_confirm: 'Password123',
        tel: '1234567890',
        pref: ''
      })
    })
  );

  expect(window.alert).toHaveBeenCalledWith('You’re registered!');
});
