const { CreateUserCommand, AddUserToGroupCommand, IAMClient } = require("@aws-sdk/client-iam")

const createIamUser = async (req, res, next)=> {
  const client = new IAMClient({ 
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ADMIN_KEY,
      secretAccessKey: process.env.S3_ADMIN_SECRET_KEY
    }
  })
  const username = req.cookies.username
  const command = new CreateUserCommand({ UserName: username })
  await client.send(command)
  await addUserToGroup(username, client)
  req.session.authorized = true
};

const addUserToGroup = async (username, client) => {
  const input = {
    GroupName: process.env.IAM_USER_GROUP,
    UserName: username
  };
  const command = new AddUserToGroupCommand(input)
  await client.send(command)
}

module.exports = {
  createIamUser
}