"use client"

import { API, graphqlOperation, GraphQLResult } from '@aws-amplify/api'

import { useMutation, useQuery } from "@tanstack/react-query"
import { Heading, Text, View, useTheme, Button, Flex, Alert, Loader, Divider } from "@aws-amplify/ui-react"
import { MdRefresh } from 'react-icons/md'

import { CreateDocumentDownloadUrlMutation, CreateDocumentDownloadUrlMutationVariables, DeleteDocumentMutation, DeleteDocumentMutationVariables, Document, ListDocumentsQuery, ListDocumentsQueryVariables  } from '@/API'
import * as queries from '@/graphql/queries'
import * as mutations from '@/graphql/mutations'
import { saveAs } from 'file-saver'

export default function ViewDocuments () {
  const theme = useTheme()

  const query = useQuery({
    queryKey: ['documents'],
    async queryFn() {
      const documents: (Document & {
        title: string
        contents: string
      })[] = []
      let nextToken: undefined | string
      do {
        const result = (await API.graphql(
          graphqlOperation(queries.listDocuments, {
            nextToken
          } as ListDocumentsQueryVariables)
        )) as GraphQLResult<ListDocumentsQuery>
        nextToken = result.data?.listDocuments?.nextToken ?? undefined

        for (const item of result.data?.listDocuments?.items ?? []) {
          if (item === null) continue
          try {
            const data = JSON.parse(item.parameters)
            const title = data.title
            const contents = data.contents
            if (typeof title !== "string") continue
            if (typeof contents !== "string") continue
            documents.push({
              ...item,
              title, contents
            })
          } catch {
            console.warn("Invalid item")
          }
        }
      } while (nextToken)

      return documents.sort((a,b) => a.createdAt < b.createdAt ? 1 : -1)
    }
  })

  const deleteMutation = useMutation({
    async mutationFn(id: string) {
      return (await API.graphql(
        graphqlOperation(mutations.deleteDocument, {
          input: { id }
        } as DeleteDocumentMutationVariables)
      )) as GraphQLResult<DeleteDocumentMutation>
    },
    onSuccess () {
      query.refetch()
    }
  })

  const downloadMutation = useMutation({
    async mutationFn (id: string) {
      const result = (await API.graphql(
        graphqlOperation(mutations.createDocumentDownloadUrl, {
          input: {
            id: id
          }
        } as CreateDocumentDownloadUrlMutationVariables)
      )) as GraphQLResult<CreateDocumentDownloadUrlMutation>

      const url = result.data?.createDocumentDownloadUrl as string

      const response = await fetch(url)
      const blob = await response.blob()
      saveAs(blob, 'file.txt')
    }
  })

  return (
    <View marginBlockEnd={theme.tokens.space.xl}>
      <Flex marginBlockEnd={theme.tokens.space.large} gap={theme.tokens.space.medium}>
        <Heading level={4} grow={1}>書類の一覧</Heading>
        <Button onClick={() => query.refetch()}>
          <MdRefresh />
        </Button>
      </Flex>
      {query.isLoading && <Loader />}
      {query.isError && (
        <Alert variation='error' heading="取得に失敗しました" />
      )}
      {downloadMutation.isError && (
        <Alert variation='error' heading="ダウンロードに失敗しました" />
      )}
      {deleteMutation.isError && (
        <Alert variation='error' heading="削除に失敗しました" />
      )}
      {query.isSuccess && query.data.length === 0 && (
        <Alert heading="書類がありません" />
      )}
      {query.isSuccess && query.data.length > 0 && (
        query.data.map(document => (
          <View key={document.id} paddingBlock={theme.tokens.space.xs}>
            <Flex gap={theme.tokens.space.small} alignItems="start" paddingBlock={theme.tokens.space.xs}>
              <Flex direction="column" grow={1} gap={theme.tokens.space.xs}>
                <Heading level={6}>{document.title}</Heading>
                <Flex gap={theme.tokens.space.xxs}>
                  <Text fontSize="smaller">{new Date(document.createdAt).toLocaleDateString()}</Text>
                  <Text fontSize="smaller">{new Date(document.createdAt).toLocaleTimeString()}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Button variation="warning" onClick={() => deleteMutation.mutate(document.id)}>削除</Button>
                {typeof document.filePath === "string" ? (
                  <Button size="small" onClick={() => downloadMutation.mutate(document.id)}>ダウンロード</Button>
                ) : (
                  <Button size="small" disabled>ダウンロードできません</Button>
                )}
              </Flex>
            </Flex>
            <Divider />
          </View>
        ))
      )}
    </View>
  )
}
