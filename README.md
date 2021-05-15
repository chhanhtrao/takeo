# takeo

A package that make remote resource request and map resource to Model object.

## 1. Installation

`npm install takeo ` or `yarn install takeo`

## 2. Usage

#### 2-1. Import

```javascript
import {request, models} from 'takeo';
```

#### 2-2. Making a request

- Making a simple request
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
