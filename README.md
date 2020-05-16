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
{
        "email': "kingabesh@admin.com",
        "password": "123456"
}
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

Create a new user with roles as student or tutor. P.S: You can't sign up as admin

```
POST https://online-tutor-api.herokuapp.com/api/v1/auth/register
```

##### Body

| Key       | Value          | Required |
| --------- | -------------- | -------- |
| firstName | Use First Name | Yes      |
| lastName  | User Last Name | Yes      |
| email     | User Email     | Yes      |
| password  | User Password  | Yes      |
| role      | User role      | Yes      |

Example:

```
{
        "firstName": "Sleek",
        "lastName": "Codes",
        "email": "sleekcodes@tutor.com",
        "password": "123456",
        "role": "tutor"
}
```

> POST Login

Sign in a user

```
https://online-tutor-api.herokuapp.com/api/v1/auth/login
```

##### Body

| Key      | Value            | Required |
| -------- | ---------------- | -------- |
| email    | Email of user    | Yes      |
| password | Password of user | Yes      |

Example:

```
{
        "email": "sleekcodes@tutor.com",
        "password": "123456"
}
```

### Category

Create, read, update and delete category

> POST Create Category

Create categories for subjects. Category can be PRIMARY, JSS & SSS

```
POST https://online-tutor-api.herokuapp.com/api/v1/category
```

#### Access - Admin only

#### Body

| Key         | Value                   | Required |
| ----------- | ----------------------- | -------- |
| name        | name of category        | yes      |
| description | description of category | optional |

Example

```
{
	    "name": "sss",
	    "description": "Category for Senior Secondary School Education"
}
```

> GET Retrieve all the categories

Retrieve all categories

```
GET https://online-tutor-api.herokuapp.com/api/v1/categories
```

#### Access - Authenticated users only

> PATCH Update a category

Update a category using it's ID

```
PATCH http://localhost:3000/api/v1/category/:catId
```

#### Access - Admin only

Params

- catId - Category ID

#### Body

| Key         | Value                | Required |
| ----------- | -------------------- | -------- |
| name        | name of the category | yes      |
| description | category description | no       |

Example

```
{
	    "name": "sss",
	    "description": "Category for Senior Secondary School Education"
}
```

> DELETE Delete a category

Delete a category using it's ID

```
DELETE https://online-tutor-api.herokuapp.com/api/v1/category/:catId
```

#### Access - Admin only

Params

- catId - Category ID

### Subject

Create, read, update and delete subject

> POST Create a subject

Create subjects under these categories (Primary, JSS, SSS) using the categort ID (catId)

```
POST https://online-tutor-api.herokuapp.com/api/v1/categories/:catId/subject
```

#### Access - Admin only

Params

- catId - Category ID

#### Body

| Key         | Value                  | Required |
| ----------- | ---------------------- | -------- |
| name        | subject name           | yes      |
| description | description of subject | optional |

Example

```
{
	    "name": "English",
	    "description": "Basic english language for primary school students"
}
```

> GET Retrieve all the subjects

Get all the subjects in a category using the category ID - (catId)

```
GET https://online-tutor-api.herokuapp.com/api/v1/categories/:catId/subjects
```

#### Access - All authenticated users

Params

- catId - Category ID
