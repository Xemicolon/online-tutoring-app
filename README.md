# ONLINE TUTOR APP

> This is the backend server for an online tutor app

### How to use:

An .env-sample contains the details you need to get started or you can create a new file in the root directory and name it .env. This file should hold these details below:

```
DB_URI
SECRET_KEY
NODE_ENV
expiresIn
```

### Install dependencies:

```
npm i
```

### Run the app:

```
# You can run the app in dev mode or prod mode using any of the below:
```

```
# dev mode
npm run dev

or

# prod mode
npm run start
```

### Admin demo Login:

```
email: kingabesh@admin.com
password: 12345
```

### API ENDPOINTS:

#### Status code

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 201         | Created               |
| 400         | Bad request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not found             |
| 500         | Internal server error |

### Authentication

Create, read and sign out users.
> POST Register
Create a new user with roles as student or tutor  
P.S: You can't sign up as admin

```
POST https://online-tutor-api.herokuapp.com/api/v1/auth/register
```