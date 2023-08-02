/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDocumentDownloadUrl = /* GraphQL */ `
  mutation CreateDocumentDownloadUrl($input: CreateDocumentDownloadUrlInput) {
    createDocumentDownloadUrl(input: $input)
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput) {
    createUser(input: $input)
  }
`;
export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
      id
      parameters
      filePath
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
      id
      parameters
      filePath
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
      id
      parameters
      filePath
      createdAt
      updatedAt
      __typename
    }
  }
`;
