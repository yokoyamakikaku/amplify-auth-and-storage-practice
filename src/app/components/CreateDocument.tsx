"use client"

import { API, graphqlOperation, GraphQLResult } from '@aws-amplify/api'

import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Heading, View, useTheme, Button, Flex, TextField, SelectField, Alert } from "@aws-amplify/ui-react"

import { CreateDocumentMutation, CreateDocumentMutationVariables } from '@/API'
import * as mutations from '@/graphql/mutations'

interface FormValues  {
  title: string
  contents: string
}

export default function CreateDocument () {
  const theme = useTheme()

  const { register, handleSubmit, setError,  } = useForm<FormValues>({
    defaultValues: {
      title: "Sample Title",
      contents: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia libero nobis facere ea autem, quod earum blanditiis quam asperiores aut, quaerat numquam deserunt quis, odit excepturi repellat doloremque voluptates ut."
    }
  })

  const mutation = useMutation({
    async mutationFn(values: FormValues) {
      const result = (await API.graphql(
        graphqlOperation(
          mutations.createDocument, {
            input: {
              parameters: JSON.stringify({
                title: values.title,
                contents: values.contents
              })
            }
          } as CreateDocumentMutationVariables
        )
      )) as GraphQLResult<CreateDocumentMutation>
      return result.data
    }
  })

  return (
    <View marginBlockEnd={theme.tokens.space.xl}>
      <Heading level={4} marginBlockEnd={theme.tokens.space.large}>書類の作成</Heading>
      <Flex as="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}
        direction="column" alignItems="start"
        gap={theme.tokens.space.medium}>
        <TextField width="400px" label="表題" required {...register("title")}/>
        <TextField width="400px" label="内容" required {...register("contents")}/>
        {mutation.isError && (
          <Alert variation="error"
            heading="エラー">
            {String(mutation.error)}
          </Alert>
        )}
        <Button type="submit" color="primary">作成する</Button>
      </Flex>
    </View>
  )
}
