import { render, screen, fireEvent, act } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

global.fetch = jest.fn();

test('clicking register sends data and shows success', async () => {
  await act(async () => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ prefs: [{ id: 1, name: 'Tokyo' }, { id: 2, name: 'Osaka' }] })
    });

    render(<RegistrationForm />);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    });
  });

  
  fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'jimmy' } });
  fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jimmy@gmail.com' } });
  fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password123' } });
  fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'Password123' } });
  fireEvent.change(screen.getByLabelText('Telephone:'), { target: { value: '1234567890' } });
  fireEvent.change(screen.getByLabelText('Prefecture:'), { target: { value: '1' } }); // String '1', not number 1

  window.alert = jest.fn();

  fireEvent.click(screen.getByText('Register'));
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(window.alert).toHaveBeenCalledWith('You’re registered!');

  // Check the second fetch call (first is prefs, second is register)
  // expect(fetch.mock.calls[1]).toEqual([
  //   'http://127.0.0.1:8000/auth/register/',
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       username: 'jimmy',
  //       email: 'jimmy@gmail.com',
  //       password: 'Password123',
  //       password_confirm: 'Password123',
  //       tel: '1234567890',
  //       pref: '1'
  //     })
  //   }
  // ]);
});
