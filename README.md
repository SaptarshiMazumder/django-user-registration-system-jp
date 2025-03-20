# TG Assignment Project

## Project Overview

This repository is the solution to a multi-part assignment on user registration. It includes three main tasks:

1. **Assignment 1: Django Registration Form**

   - A custom user registration form built with Django.
   - A custom user model that overrides Django’s default and adds two fields: `tel` and `pref` (a ForeignKey to a `Pref` model).
   - Server-side validations for username, email, password, telephone number, and prefecture.
   - Automated tests to verify the registration functionality.

2. **Assignment 2: Real-Time Validation with React**

   - A React-based registration form that implements real-time (client-side) validations mirroring the server-side rules.
   - Test cases using Jest and React Testing Library that simulate user interactions and verify that validations work as expected.

3. **Assignment 3: Registration API with DRF & React Integration**
   - A RESTful API endpoint built with Django Rest Framework (DRF) for user registration.
   - An API endpoint that returns a list of prefectures.
   - A separate React component that uses the API for registration (including a dropdown for prefectures) rather than a manual ID entry.
   - Automated tests for both the Django API and the React integration.

## Backend (Django)

The backend is built using the Django framework. It provides API endpoints for user registration, authentication, and other user-related operations.

## Frontend (React)

The frontend is built using React, with Create React App. It provides a user interface for registration and interacting with the backend API.

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SaptarshiMazumder/tg_assignment.git
   cd tg_assignment
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv env
   # On Windows: env\Scripts\activate
   ```

3. **Install dependencies:**

   Ensure your requirements.txt includes Django, djangorestframework, django-cors-headers, etc.

   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Seed the Prefectures Data:**

   For the application to function correctly, you must have some initial prefecture records in the database.

   ```bash
   python manage.py shell
   ```

   Then execute:

   ```python
   from users.models import Pref
   if not Pref.objects.exists():
       Pref.objects.create(name="Tokyo")
       Pref.objects.create(name="Osaka")
       Pref.objects.create(name="Kyoto")
   exit()
   ```

6. **Start the Django server:**

   ```bash
   python manage.py runserver
   ```

   Backend:
   The HTML registration form is available at:
   http://127.0.0.1:8000/users/register/
   The Django Rest API endpoint is at:
   http://127.0.0.1:8000/api/v1/register/

7. **FrontEnd**

   The React Frontend endpoint is at:
   http://127.0.0.1:3000/register/
   This serves as the front end for accessing both the Form View and the API View

8. **React Setup**

   Navigate to the React project directory:

   ```bash
   cd frontend
   ```

9. **Install npm dependencies:**

   ```bash
   npm install
   ```

10. **Start the React development server:**

    ```bash
    npm start
    ```

    By default, the React app runs on http://localhost:3000.

You can view the real-time validation form (Assignment 2) via RegistrationForm.js.
To check the API-based registration form (Assignment 3), ensure that App.js imports and renders APIRegistrationForm.js.

### API Endpoints

The API endpoints are defined in `tg_assignment/users/api/v1/urls.py`. Key endpoints include:

- `/api/v1/register/`: User registration.
- `/api/v1/login/`: User login.
  .

## Testing

### Django Tests

Run all Django tests to verify backend functionality (registration form validations, API endpoints, etc.):

```bash
python manage.py test users
```

To run the Django tests:

```bash
python manage.py test users.api.v1.tests
```

### React Tests

From the frontend directory, run:

```bash
npm test
```

To run the React tests:

```bash
cd frontend
npm test
```

This will execute the test cases (e.g., those in RegistrationForm.test.js) verifying that the React forms behave as expected.

## How to Verify the Assignment Requirements

### Assignment 1: Django Registration Form

#### Custom User Model and Form:

The users/models.py file defines a custom user model named ‘User’ (extending AbstractUser) and a Pref model.

The registration form in users/forms.py enforces:

- Username must be at least 3 characters.
- Email is validated and checked for duplicates.
- Password requires at least 8 characters, one uppercase, one lowercase, and one digit.
- Telephone must contain only digits.
- Prefecture must be selected from existing records.

#### Manual Testing:

Navigate to http://127.0.0.1:8000/users/register/ and submit the form with both valid and invalid data.

#### Automated Testing:

Run Django tests with python manage.py test users to see that all form validations and view behaviors are correct.

### Assignment 2: React Frontend with Real-Time Validation

#### React Frontend:

The frontend/src/RegistrationForm.js component provides the Frontend to send request to the immediate validation feedback as the user types.
For cleaner organization, the front end for assignment 2 and 3 are separated.

#### Manual Testing:

Open the React app in your browser at http://localhost:3000 and try entering invalid data to see validation messages.

#### Automated Testing:

The test file frontend/src/RegistrationForm.test.js uses Jest and React Testing Library to simulate interactions and verify error messages.

### Assignment 3: DRF API and React Integration

#### API Endpoints:

The registration API is implemented in users/api_views.py and accessible at http://127.0.0.1:8000/api/v1/register/.

#### React Integration:

The frontend/src/APIRegistrationForm.js component fetches the list of prefectures from the API and displays them in a dropdown. It then submits the registration data to the API.
For cleaner organization, the front end for assignment 2 and 3 are separated.

#### Manual Testing:

Switch the rendered component in App.js to APIRegistrationForm and register a new user.

Verify that the prefecture dropdown is populated and that registration works correctly.

#### Automated Testing:

Django tests cover the API endpoints, and React tests (if written) can simulate the API call behavior.

## Additional Information

### CSRF and CORS:

During development, CSRF protection may be temporarily disabled or handled via decorators (e.g., @csrf_exempt) on API views.

django-cors-headers is configured to allow requests from http://localhost:3000.

### Database:

The application uses SQLite by default (stored in db.sqlite3). Use Django Admin or the shell to inspect database records.

### Prefecture Data:

Make sure to seed your Pref table with valid entries (e.g., Tokyo, Osaka, Hokkaido) either via the shell.
