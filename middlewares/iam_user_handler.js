const { IAMClient, CreateUserCommand, AddUserToGroupCommand, DeleteUserCommand, RemoveUserFromGroupCommand } = require("@aws-sdk/client-iam")

const createIamUser = async (req, res, next)=> {
  const client = new IAMClient({ 
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ADMIN_KEY,
      secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
    }
  })

  const username = req.cookies.username || req.body.username
  const command = new CreateUserCommand({ UserName: username })
  try {
    await client.send(command)
    await addUserToGroup(username, client)
    res.sendStatus(200)
  } catch(e) {
    res.status(409).json(e)
  }
}

const addUserToGroup = async (username, client) => {
  const input = {
    GroupName: process.env.IAM_USER_GROUP,
    UserName: username
  }
  const command = new AddUserToGroupCommand(input)
  await client.send(command)
}

const deleteIamUser = async (req, res, next)=> {
  const client = new IAMClient({ 
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ADMIN_KEY,
      secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
    }
  })

  const username = req.cookies.username || req.body.username
  const command = new DeleteUserCommand({ UserName: username })
  try {
    await removeUserFromGroup(username, client)
    await client.send(command)
    res.sendStatus(200)
  } catch(e) {
    res.status(409).json(e)
  }
}

const removeUserFromGroup = async (username, client) => {
  const input = {
    GroupName: process.env.IAM_USER_GROUP,
    UserName: username
  }
  const command = new RemoveUserFromGroupCommand(input)
  await client.send(command)
}

module.exports = {
  createIamUser,
  deleteIamUser
}