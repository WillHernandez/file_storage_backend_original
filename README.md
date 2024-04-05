# File Storage Project (Server)

This is the server api for our file storage application:

NodeJS, AWS IAM and Cognito for user auth / authentication.
Uploaded files are stored in AWS S3 buckets

AWS IAM permissions to confirm user authorization and AWS Cognito for authentications on the server side
## Deployment

To deploy this project run

```bash
  npm run dev
```


## API Reference User

#### New User

```http
  POST /api/user/newuser
```

#### User Login

```http
  POST /api/user/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `access_token`      | `string` | **Required** |

#### User Logout

```http
  POST /api/user/logout
```

## API Reference Objects

#### Get All Objects for user

```http
  GET /api/bucket/getallobjects
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `access_token`      | `string` | **Required** |

#### Upload object

```http
  POST /api/bucket/upload
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `access_token`      | `string` | **Required** |

#### Delete Object

```http
  POST /api/delete
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `access_token`      | `string` | **Required** |

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://willhernandez.dev)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/will-hernandez-16325a88/)

