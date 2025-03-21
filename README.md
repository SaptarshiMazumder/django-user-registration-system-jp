English follows Japanese
---

# Tokyo Gas 課題プロジェクト

## プロジェクト概要

このリポジトリは、ユーザー登録に関する多岐にわたる課題の解決策です。主に以下の 3 つのタスクが含まれています。

1. **課題 1：Django 登録フォーム**

   - Django で構築されたカスタムユーザー登録フォーム。
   - Django のデフォルトをオーバーライドし、`tel`と`pref`（`Pref`モデルへの ForeignKey）の 2 つのフィールドを追加するカスタムユーザーモデル。
   - ユーザー名、メールアドレス、パスワード、電話番号、都道府県に対するサーバー側の検証。
   - 登録機能を確認するための自動テスト。

2. **課題 2：React によるリアルタイム検証**

   - サーバー側のルールを反映したリアルタイム（クライアント側）検証を実装する React ベースの登録フォーム。
   - ユーザーインタラクションをシミュレートし、検証が期待どおりに機能することを確認する Jest および React Testing Library を使用したテストケース。

3. **課題 3：DRF と React の統合による登録 API**
   - ユーザー登録用の Django Rest Framework（DRF）で構築された RESTful API エンドポイント。
   - 都道府県のリストを返す API エンドポイント。
   - 手動 ID 入力ではなく、API を登録に使用する（都道府県のドロップダウンを含む）別の React コンポーネント。
   - Django API と React 統合の両方に対する自動テスト。

## バックエンド（Django）

バックエンドは、Django フレームワークを使用して構築されています。ユーザー登録、認証、およびその他のユーザー関連の操作のための API エンドポイントを提供します。

## フロントエンド（React）

フロントエンドは、Create React App を使用して React で構築されています。登録およびバックエンド API とのインタラクションのためのユーザーインターフェースを提供します。

### セットアップ

1. **リポジトリをクローンします：**

   ```bash
   git clone https://github.com/SaptarshiMazumder/tg_assignment.git
   cd tg_assignment
   ```

2. **仮想環境を作成してアクティブ化します：**

   ```bash
   python -m venv env
   # Windowsの場合：env\Scripts\activate
   ```

3. **依存関係をインストールします：**

   requirements.txt に Django、djangorestframework、django-cors-headers などが含まれていることを確認してください。

   ```bash
   pip install -r requirements.txt
   ```

4. **マイグレーションを実行します：**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **都道府県データをシードします：**

   アプリケーションが正しく機能するためには、データベースにいくつかの初期都道府県レコードが必要です。

   ```bash
   python manage.py shell
   ```

   次に実行します：

   ```python
   from users.models import Pref
   if not Pref.objects.exists():
       Pref.objects.create(name="Tokyo")
       Pref.objects.create(name="Osaka")
       Pref.objects.create(name="Kyoto")
   exit()
   ```

6. **Django サーバーを起動します：**

   ```bash
   python manage.py runserver
   ```

   バックエンド：
   HTML 登録フォームは以下で利用可能です：
   http://127.0.0.1:8000/users/register/
   Django Rest API エンドポイントは以下にあります：
   http://127.0.0.1:8000/api/v1/register/

7. **フロントエンド**

   React フロントエンドのエンドポイントは以下にあります：
   http://127.0.0.1:3000/register/
   これは、フォームビューと API ビューの両方にアクセスするためのフロントエンドとして機能します。

8. **React のセットアップ**

   React プロジェクトディレクトリに移動します：

   ```bash
   cd frontend
   ```

9. **npm の依存関係をインストールします：**

   ```bash
   npm install
   ```

10. **React 開発サーバーを起動します：**

    ```bash
    npm start
    ```

    デフォルトでは、React アプリは http://localhost:3000 で実行されます。

リアルタイム検証フォーム（課題 2）は、RegistrationForm.js から表示できます。
API ベースの登録フォーム（課題 3）を確認するには、App.js が APIRegistrationForm.js をインポートしてレンダリングしていることを確認してください。

### API エンドポイント

API エンドポイントは、`tg_assignment/users/api/v1/urls.py`で定義されています。主要なエンドポイントは次のとおりです：

- `/api/v1/register/`：ユーザー登録。
- `/api/v1/login/`：ユーザーログイン。
  .

## テスト

### Django テスト

すべての Django テストを実行して、バックエンド機能（登録フォームの検証、API エンドポイントなど）を確認します：

```bash
python manage.py test users
```

Django テストを実行するには：

```bash
python manage.py test users.api.v1.tests
```

### React テスト

frontend ディレクトリから、以下を実行します：

```bash
npm test
```

React テストを実行するには：

```bash
cd frontend
npm test
```

これにより、テストケース（たとえば、RegistrationForm.test.js のテストケース）が実行され、React フォームが期待どおりに動作することが検証されます。

## 課題要件の確認方法

### 課題 1：Django 登録フォーム

#### カスタムユーザーモデルとフォーム：

users/models.py ファイルは、カスタムユーザーモデル「User」（AbstractUser を拡張）と Pref モデルを定義します。

users/forms.py の登録フォームは、以下を強制します：

- ユーザー名は 3 文字以上である必要があります。
- メールアドレスは検証され、重複がないか確認されます。
- パスワードは、8 文字以上、大文字 1 つ、小文字 1 つ、数字 1 つが必要です。
- 電話番号は数字のみを含む必要があります。
- 都道府県は既存のレコードから選択する必要があります。

#### 手動テスト：

http://127.0.0.1:8000/users/register/に移動し、有効なデータと無効なデータの両方でフォームを送信します。

#### 自動テスト：

python manage.py test users で Django テストを実行して、すべてのフォーム検証とビューの動作が正しいことを確認します。

### 課題 2：リアルタイム検証を備えた React フロントエンド

#### React フロントエンド：

frontend/src/RegistrationForm.js コンポーネントは、ユーザーが入力するときに即時検証フィードバックを送信するためのフロントエンドを提供します。
よりクリーンな編成のために、課題 2 と 3 のフロントエンドは分離されています。

#### 手動テスト：

ブラウザで React アプリを http://localhost:3000 で開き、無効なデータを入力して検証メッセージを表示してみてください。

#### 自動テスト：

テストファイル frontend/src/RegistrationForm.test.js は、Jest と React Testing Library を使用してインタラクションをシミュレートし、エラーメッセージを検証します。

### 課題 3：DRF API と React の統合

#### API エンドポイント：

登録 API は users/api_views.py に実装されており、http://127.0.0.1:8000/api/v1/register/でアクセスできます。

#### React の統合：

frontend/src/APIRegistrationForm.js コンポーネントは、API から都道府県のリストを取得し、ドロップダウンに表示します。次に、登録データを API に送信します。
よりクリーンな編成のために、課題 2 と 3 のフロントエンドは分離されています。

#### 手動テスト：

App.js でレンダリングされたコンポーネントを APIRegistrationForm に切り替え、新しいユーザーを登録します。

都道府県のドロップダウンが入力され、登録が正しく機能することを確認します。

#### 自動テスト：

Django テストは API エンドポイントをカバーし、React テスト（作成されている場合）は API 呼び出しの動作をシミュレートできます。

## 追加情報

### CSRF と CORS：

開発中、CSRF 保護は一時的に無効にするか、API ビューのデコレータ（例：@csrf_exempt）を介して処理できます。

django-cors-headers は、http://localhost:3000 からのリクエストを許可するように構成されています。

### データベース：

アプリケーションはデフォルトで SQLite（db.sqlite3 に保存）を使用します。Django Admin またはシェルを使用して、データベースレコードを検査します。

### 都道府県データ：

シェルを介して、Pref テーブルに有効なエントリ（例：Tokyo、Osaka、Hokkaido）をシードしてください。


---------------------

# Tokyo Gas Assignment Project

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

