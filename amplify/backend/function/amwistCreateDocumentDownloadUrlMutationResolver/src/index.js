/* Amplify Params - DO NOT EDIT
  API_AMPLIFYWITHSTORAGE_DOCUMENTTABLE_ARN
  API_AMPLIFYWITHSTORAGE_DOCUMENTTABLE_NAME
  API_AMPLIFYWITHSTORAGE_GRAPHQLAPIIDOUTPUT
  ENV
  REGION
  STORAGE_S3686D2FF7_BUCKETNAME
Amplify Params - DO NOT EDIT */

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

/**
 * @type {import('@types/aws-lambda').AppSyncResolverHandler<{ input: { id: string }}, string>}
 */
exports.handler = async (event) => {

  if (event.typeName !== "Mutation") throw Error(`Invalid typeName ${event.typeName}`)
  if (event.fieldName !== "createDocumentDownloadUrl") throw Error(`Invalid fieldName ${event.fieldName}`)

  const groups = event.identity.groups
  if (
    !Array.isArray(groups)
    || (!groups.includes("admin") && !groups.includes("staff"))
  ) throw Error("Not Authorized")

  const id = event.arguments.input.id
  if (typeof id !== "string") throw Error("Invalid id")

  const region = process.env.REGION

  const dynamoDb = new DynamoDB({ region })
  const s3Client = new S3Client({ region })

  const result = await dynamoDb.getItem({
    TableName: process.env.API_AMPLIFYWITHSTORAGE_DOCUMENTTABLE_NAME,
    Key: marshall({ id }),
    ProjectionExpression: "#filePath",
    ExpressionAttributeNames: {
      '#filePath': 'filePath'
    }
  })

  if (typeof result.Item === "undefined") throw Error("The document was not found")

  const key = unmarshall(result.Item).filePath
  if (typeof key !== "string") throw Error("Invalid key")

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.STORAGE_S3686D2FF7_BUCKETNAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
  if (typeof url !== "string") throw Error("Failed to create url.")

  return url
};
