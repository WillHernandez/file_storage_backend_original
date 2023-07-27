const { CreateUserCommand, AddUserToGroupCommand, IAMClient } = require("@aws-sdk/client-iam")
const client = new IAMClient({region: 'us-east-1'});

const newUser = async (req, res)=> {
  const username = req.cookies.username
  const command = new CreateUserCommand({ UserName: username });
  try {
    await client.send(command)
    await addToGroup(username) // may not have to await as its doing so in the func
    res.end()
  } catch(e) {
    res.status(200).json({error: e})
  }
};

const addToGroup = async (username) => {
  const input = {
    GroupName: process.env.IAM_USER_GROUP,
    UserName: username
  };
  const command = new AddUserToGroupCommand(input);
  return await client.send(command)
}

module.exports = {
  newUser
}