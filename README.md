# takeo

A package that make remote resource request and map resource to Model object.

# 1. Installation

`npm install takeo` or `yarn install takeo`

# 2. [Using with typescript](https://github.com/chhanhtrao/takeo/blob/main/doc/TYPESCRIPT-USAGE.md)

# 3. Using with javascript

#### 2-1. Import

```javascript
import {request, models} from 'takeo';
```

#### 2-2. Making a simple request

```javascript
const http = new request.Http();
http
  .request({
    url: 'https://jsonplaceholder.typicode.com/Users',
    method: request.Http.GET, // Methods .GET | .POST | .PUT  | .DELETE | .PATCH
    // params: { id: 1 }, // This params will transform to querystring parameter
    data: {}, // POST data
  })
  .then((response) => {
    setPostList(response.data);
  })
  .catch((error) => {
    // console.log('error', error)
  });
```

#### 2-3. Making request throught Model class

- Create a Model class represent to remote resource.(User.js)

  ```javascript
  import {models} from 'takeo';

  export class User extends models.Model {
    static objects = new models.Manager(User);
    static fields = ['id', 'name', 'username', 'email'];

    constructor(data) {
      super(data);
      this.fields = User.fields;
    }

    getManager() {
      return User.objects;
    }
  }
  ```

- Configuration

  ```javascript
  // The configuration will effect gobally
  request.Http.defaultConfig = {
    baseURL: 'https://jsonplaceholder.typicode.com',
    header: {
      // http header here.
    },
    // other config here
  };
  ```

- Fetch data(list)

  ```javascript
  User.objects
    .filter({username: 'Bret'})
    .then((response) => {
      console.log('Fetch users success', resultSet);
      // resultSet is a list of User Model objects.
    })
    .catch((error) => {
      console.log('Error fetch users', error);
    });
  ```

  The above line will make a request to '`{baseURL}/{model_name}s/`' (https://jsonplaceholder.typicode.com/users/). This URL is configureable by overiding a method in `User Model` class as bellow:

  ```javascript
    static getResourceURL(): any {
      return 'custom/url/here'; // ex: '/api/profile' or 'https://example.com/api/profile'
    }
  ```

- Fetch data(signle resource)

  ```javascript
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

  ```javascript
  const newUser = await User.objects.create({
    email: 'lindsay.ferguson@reqres.in',
    first_name: 'Lindsay',
    last_name: 'Ferguson',
    avatar: 'https://reqres.in/img/faces/8-image.jpg',
  });
  // newUser is a Model(User) object.
  ```

- PUT to update a signle resource

  ```javascript
  newUser.email = 'new.email@example.com';
  newUser.save().then((updatedUser) => {
    console.log('Updated', updatedUser);
    // updatedUser is a Model(User) object.
  });
  ```

- DELETE a singole resource

  ```javascript
  newUser
    .delete()
    .then((result: any) => {
      console.log('Deleted user');
    })
    .catch((error: any) => {
      console.log('Delete user error', error);
    });
  ```

- GET count resource
  ```javascript
  User.objects
    .count()
    .then((result: any) => {
      console.log('User count', result);
    })
    .catch((error: any) => {
      console.log('Count user error', error);
    });
  ```

# 3. Advance Usage

#### 3-1. Using your own Manager class

- Create a file `UserManager.js`

  ```javascript
  import {models} from 'takeo';

  export class UserManager extends models.Manager {
    // Override this method to transform response data to Model object
    transformResponseToObject(responseData) {
      const resData = JSON.parse(responseData);
      return new this.model(resData.data);
    }

    // Override this method to transform response data to list of Model objects
    transformResponseToList(responseData) {
      return super.transformResponseToList(responseData);
    }

    // Add your cusutom function to model manager
    // Calling: User.objects.yourCustomFunction()
    yourCustomFunction() {
      // Your code here.
    }
  }
  ```

- Using `UserManager` as instead of default Manager class within your model class - `User.js`

  ```javascript
  import {UserManager} from './UserManager';

  export class User extends models.Model {
    static objects = new UserManager(User);
    static fields= ['id', 'email', 'first_name', 'last_name', 'avatar']
    ...
    getManager() {
        return User.objects;
    }
    ...
  }
  ```

- Calling a custom function of your `MyManager`
  ```javascript
  User.objects.yourCustomFunction();
  ```

#### 3-2. Custom request config

```javascript
const user = await User.objects.filter(
  {email: 'email@example.com'},
  {
    url: 'custom-url-here',
    header: {
      // custom-header-here
    },
  },
);
```
