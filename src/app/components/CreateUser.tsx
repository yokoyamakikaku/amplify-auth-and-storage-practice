"use client"

import { v4 as uuid } from 'uuid'
import { API, graphqlOperation, GraphQLResult } from '@aws-amplify/api'

import { useFieldArray, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Heading, View, useTheme, Button, Flex, TextField, Alert, Divider } from "@aws-amplify/ui-react"

import { CreateUserMutation, CreateUserMutationVariables } from '@/API'
import * as mutations from '@/graphql/mutations'

interface FormValues  {
  email: string
  password: string
  groups: {
    id: string
    name: string
  }[]
}

export default function CreateUser () {
  const theme = useTheme()

  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      groups: [{
        id: uuid(),
        name: '',
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  });

  const mutation = useMutation({
    async mutationFn(values: FormValues) {
      const result = (await API.graphql(
        graphqlOperation(
          mutations.createUser, {
            input: {
              email: values.email,
              password: values.password,
              groups: values.groups.map(({ name: group }) => group),
            }
          } as CreateUserMutationVariables
        )
      )) as GraphQLResult<CreateUserMutation>
      return result.data?.createUser
    }
  })

  return (
    <View marginBlockEnd={theme.tokens.space.xl}>
      <Heading level={4} marginBlockEnd={theme.tokens.space.large}>ユーザの作成</Heading>
      <Flex as="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}
        direction="column" alignItems="start"
        gap={theme.tokens.space.medium}>
        <TextField width="400px" label="メールアドレス" required {...register("email")}/>
        <TextField width="400px" label="パスワード" required {...register("password")}/>
        {fields.map((field, index) => {
          return (
            <View key={field.id}>
              <Flex paddingBlock={theme.tokens.space.small} alignItems="end">
                <TextField label="グループ" labelHidden={index > 0} {...register(`groups.${index}.name` as const)}/>
                {fields.length > 1 && (
                  <Button type="button" onClick={() => remove(index)}>削除</Button>
                )}
              </Flex>
              <Divider />
            </View>
          )
        })}
        <Button type="button" onClick={() => append({ id: uuid(), name: '' }, { shouldFocus: true })}>追加</Button>
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
