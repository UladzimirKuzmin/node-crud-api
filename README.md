# node-crud-api

## How to run application:
1. `npm install` or `yarn install`
2. Rename `.env.example` to `.env`
3. Run `npm run start` or `yarn start`

## How to call API
1. Open Postman or any other API testing tool
2. Fill the address input with `http://localhost:4000/api/users`
3. Choose method and send request.
4. Testing data for PUT request:
  ```
    {
      "id": "95b8cb0c-3365-425e-8fa5-ac4fce61bcb2",
      "username": "Lord Sith",
      "age": 100,
      "hobbies": ["be evil"]
    }
  ```

## How to test code
1. Run `npm run test` or `yarn test`
