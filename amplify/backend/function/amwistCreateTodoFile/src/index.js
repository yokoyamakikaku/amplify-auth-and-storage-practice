/* Amplify Params - DO NOT EDIT
	API_AMPLIFYWITHSTORAGE_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYWITHSTORAGE_TODOTABLE_ARN
	API_AMPLIFYWITHSTORAGE_TODOTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = event => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  }
  return Promise.resolve('Successfully processed DynamoDB record');
};
