/* Amplify Params - DO NOT EDIT
  API_AMPLIFYWITHSTORAGE_DOCUMENTTABLE_ARN
  API_AMPLIFYWITHSTORAGE_DOCUMENTTABLE_NAME
  API_AMPLIFYWITHSTORAGE_GRAPHQLAPIIDOUTPUT
  STORAGE_S3686D2FF7_BUCKETNAME
Amplify Params - DO NOT EDIT */

import { v4 as uuid } from 'uuid'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

/**
 * @type {import('@types/aws-lambda').DynamoDBStreamHandler}
 */
export const handler = async event => {
  const region = process.env.REGION
  const dynamodb = new DynamoDB({ region })
  const s3Client = new S3Client({ region })
  for (const record of event.Records) {
    const created = typeof record.dynamodb.OldImage === "undefined" && typeof record.dynamodb.NewImage !== "undefined"
    if (!created) continue

    const {
      id,
      parameters
    } = unmarshall(record.dynamodb.NewImage)

    const filePath = `documents/${uuid()}`
    console.log(`filePath=${filePath}`)

    console.log(`Create File: start`)
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.STORAGE_S3686D2FF7_BUCKETNAME,
      Key: filePath,
      Body: [parameters?.title, parameters?.contents].join('\n'),
      ContentType: 'text/plain'
    }))
    console.log(`Create File: finish`)

    console.log(`Update Record: start`)
    await dynamodb.updateItem({
      TableName: process.env.API_AMPLIFYWITHSTORAGE_DOCUMENTTABLE_NAME,
      Key: marshall({ id }),
      UpdateExpression: `SET #filePath=:filePath`,
      ExpressionAttributeNames: {
        '#filePath': 'filePath'
      },
      ExpressionAttributeValues: marshall({
        ':filePath': filePath
      })
    })
    console.log(`Update Record: finish`)
  }
  return 1
};
