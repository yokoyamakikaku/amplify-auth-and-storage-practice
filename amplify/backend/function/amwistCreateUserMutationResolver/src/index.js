/* Amplify Params - DO NOT EDIT
  AUTH_AMPLIFYWITHSTORAGE582F37E2_USERPOOLID
  ENV
  REGION
Amplify Params - DO NOT EDIT */

const  {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminSetUserPasswordCommand
} = require("@aws-sdk/client-cognito-identity-provider")

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler<{
 *   input: {
 *     email: string
 *     password: string
 *     groups: string[]
 *   }
 * }, Boolean>}
 */
exports.handler = async (event) => {
  /** @type {string[]} */
  const groups = event.identity.groups
  if (!groups.includes("admin")) throw Error("Forbidden")

  const client = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  })

  const {
    email,
    groups: GroupNames,
    password: TemporaryPassword,
  } = event.arguments.input

  const UserPoolId = process.env.AUTH_AMPLIFYWITHSTORAGE582F37E2_USERPOOLID
  const Username = email

  await client.send(new AdminCreateUserCommand({
    UserPoolId, Username, TemporaryPassword,
    UserAttributes: [{
      Name: 'email',
      Value: email
    }, {
      Name: 'email_verified',
      Value: 'true'
    }],
    MessageAction: 'SUPPRESS',
  }))

  await client.send(new AdminSetUserPasswordCommand({
    UserPoolId,
    Username,
    Password: TemporaryPassword,
    Permanent: true
  }));

  for (const GroupName of GroupNames) {
    await client.send(new AdminAddUserToGroupCommand({ UserPoolId, GroupName, Username }))
  }

  return true
};
