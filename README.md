# takeo

A package that make remote resource request and map resource to Model object.

## 1. Installation

`npm install takeo` or `yarn install takeo`

## 2. Usage

#### 2-1. Import

```javascript
import {request, models} from 'takeo';
```

#### 2-2. Making a simple request

```javascript
const http = new request.Http();
http
  .request({
    url: 'https://reqres.in/api/users',
    method: request.Http.GET, // Methods .GET | .POST | .PUT  | .DELETE | .PATCH
    params: {page: 3}, // This params will transform to querystring parameter
    data: {}, // POST data
  })
  .then((response) => {
    // console.log('response', response.data);
  })
  .catch((error) => {
    // console.log('error', error)
  });
```

#### 2-3. Making request throught Model class

- Create a Model class represent to remote resource.(User.ts)

  ```typescript
  import {models} from 'takeo';

  export class User extends models.Model {
    public static objects: models.Manager = new models.Manager(User); // "objects" must declear in every sub class of Model.
    public static fields: string[] = [
      'id',
      'email',
      'first_name',
      'last_name',
      'avatar',
    ]; // "fields" must declear in every sub class of Model.

    private first_name?: string;
    private last_name?: string;
    private email?: string;
    private avatar?: string;

    // Contructor method needed in every sub class of Model
    public constructor(data: any) {
      super(data);
      this.fields = User.fields;
    }

    // getManager method needed in every sub class of Model
    protected getManager(): any {
      return User.objects;
    }

    public getId() {
      return this.id;
    }

    public getFirstName() {
      return this.first_name;
    }

    public getLastName() {
      return this.last_name;
    }

    public getEmail() {
      return this.email;
    }

    public getAvatar() {
      return this.avatar;
    }
  }
  ```

- Configuration

  ```typescript
  // The configuration will effect gobally
  request.Http.defaultConfig = {
    baseURL: 'https://reqres.in/api',
    header: {
      // http header here.
    },
    // other config here
  };
  ```

- Fetch data(list)

  ```typescript
  User.objects
    .filter({first_name: 'Lindsay', last_name: 'Ferguson'})
    .then((resultSet: models.ResultSet<any>) => {
      console.log('Fetch users success', resultSet);
      // resultSet is a list of User Model objects.
    })
    .catch((error) => {
      console.log('Error fetch users', error);
    });
  ```

  The above line will make a request to '`{baseURL}/{model_name}s/`' (https://reqres.in/api/users/). This URL is configureable by overiding a method in `User Model` class as bellow:

  ```typescript
    public static getResourceURL(): any {
      return 'custom/url/here'; // ex: '/api/profile' or 'https://example.com/api/profile'
    }
  ```

- Fetch data(signle resource)

  ```typescript
  User.objects
    .get({id: 7})
    .then((user) => {
      console.log('Get user', user); // user is a Model(User) object.
    })
    .catch((error) => {
      console.log('Get user error', error);
    });
  ```

- POST to create a signle resource

  ```typescript
  newUser = await User.objects.create({
    email: 'lindsay.ferguson@reqres.in',
    first_name: 'Lindsay',
    last_name: 'Ferguson',
    avatar: 'https://reqres.in/img/faces/8-image.jpg',
  });
  // newUser is a Model(User) object.
  ```

- PUT to update a signle resource

  ```typescript
  newUser.email = 'new.email@example.com';
  newUser?.save().then((updatedUser) => {
    console.log('Updated', updatedUser);
    // updatedUser is a Model(User) object.
  });
  ```

- DELETE a singole resource

  ```typescript
  newUser
    ?.delete()
    .then((result: any) => {
      console.log('Deleted user');
    })
    .catch((error: any) => {
      console.log('Delete user error', error);
    });
  ```

- GET count resource
  ```typescript
  User.objects
    .count()
    .then((result: any) => {
      console.log('User count', result);
    })
    .catch((error: any) => {
      console.log('Count user error', error);
    });
  ```
