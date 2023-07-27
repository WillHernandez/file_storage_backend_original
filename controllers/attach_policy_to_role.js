const { AttachRolePolicyCommand, CreateRoleCommand, IAMClient } = require('@aws-sdk/client-iam');

const client = new IAMClient({ region: "us-east-1" });

const arn = process.env.S3_BUCKET_ARN
/**
 *
 * @param {string} policyArn
 * @param {string} roleName
 */
const attachRolePolicy = (policyArn, roleName) => {
  const command = new AttachRolePolicyCommand({
    PolicyArn: policyArn,
    RoleName: roleName,
  });

  return client.send(command);
};

const createRole = async (req, res) => {
	const command = new CreateRoleCommand({
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
			"Statement": [
				// {
				// 	"Sid": "AllowUserToSeeBucketListInTheConsole",
				// 	"Action": ["s3:ListAllMyBuckets", "s3:GetBucketLocation"],
				// 	"Effect": "Allow",
				// 	"Resource": ["arn:aws:s3:::*"]
				// },
			 {
					"Sid": "AllowRootAndHomeListingOfCompanyBucket",
					"Action": ["s3:ListBucket"],
					"Effect": "Allow",
					"Resource": [arn],
					"Condition":{"StringEquals":{"s3:prefix":["","home/", `home/${req.cookies.userName}`],"s3:delimiter":["/"]}}
				 },
				{
					"Sid": "AllowListingOfUserFolder",
					"Action": ["s3:ListBucket"],
					"Effect": "Allow",
					"Resource": [arn],
					"Condition":{"StringLike":{"s3:prefix":[`home/${req.cookies.username}/*`]}}
				},
				{
					"Sid": "AllowAllS3ActionsInUserFolder",
					"Effect": "Allow",
					"Action": ["s3:*"],
					"Resource": [`${arn}/home/${req.cookies.username}/*`]
				}
			]
    }),
    RoleName: `s3_policy_role_${req.cookies.username}`,
  });
	const cmd = await client.send(command)
	console.log(cmd);
  // return client.send(command);
}

const role = {
  "Version":"2012-10-17",
  "Statement": [
    {
      "Sid": "AllowGroupToSeeBucketListInTheConsole",
      "Action": ["s3:ListAllMyBuckets", "s3:GetBucketLocation"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::*"]
    },
    {
      "Sid": "AllowRootAndHomeListingOfCompanyBucket",
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::file-storage-project-will2code"],
      "Condition":{"StringEquals":{"s3:prefix":["","home/"],"s3:delimiter":["/"]}}
    },
    {
      "Sid": "AllowListingOfUserFolder",
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::file-storage-project-will2code"],
      "Condition":{"StringLike":{"s3:prefix":
                  [
                       "home/${aws:username}/*",
                       "home/${aws:username}"
                  ]
               }
        }
    },
    {
       "Sid": "AllowAllS3ActionsInUserFolder",
       "Action":["s3:*"],
       "Effect":"Allow",
       "Resource": ["arn:aws:s3:::file-storage-project-will2code/home/${aws:username}/*"]
    }
  ]
}

module.exports = {
	createRole
}