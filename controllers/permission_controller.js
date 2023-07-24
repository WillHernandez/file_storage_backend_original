const { GetRoleCommand, AttachRolePolicyCommand, IAMClient } = require("@aws-sdk/client-iam")

const client = new IAMClient({ region: "us-east-1" });

const getRole = async (roleName) => {
  const command = new GetRoleCommand({
    RoleName: roleName,
  });

  const response = await client.send(command);
	console.log(response);
};

/**
 *
 * @param {string} policyArn
 * @param {string} roleName
 */
const attachRole = async (policyArn, roleName) => {
  const command = new AttachRolePolicyCommand({
    PolicyArn: policyArn,
    RoleName: roleName,
  });

  const response = await client.send(command);
	console.log(response);
};

module.exports = {
	getRole,
	attachRole
}