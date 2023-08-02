"use client"

import { v4 as uuid } from "uuid"
import { useForm } from "react-hook-form"
import { Storage,StorageAccessLevel } from "@aws-amplify/storage"
import { Heading, View, useTheme, Button, Flex, TextField, SelectField, Alert } from "@aws-amplify/ui-react"
import { useMutation } from "@tanstack/react-query"

interface FormValues  {
  key: string,
  files: FileList | null,
  level: StorageAccessLevel
}

export default function UploadFile () {
  const theme = useTheme()

  const { register, handleSubmit, setError,  } = useForm<FormValues>({
    defaultValues: {
      key: uuid(),
      files: null,
      level: 'private'
    }
  })

  const mutation = useMutation({
    async mutationFn(values: FormValues) {
      if (values.key.length < 1) throw Error("ファイルのキーが設定されていません")
      if (values.files === null) throw Error("ファイルが選択されていません")
      const file = values.files[0]
      return await Storage.put(`images/${values.key}`, file, {
        contentType: file.type,
        level: values.level,
      })
    }
  })

  return (
    <View marginBlockEnd={theme.tokens.space.xl}>
      <Heading level={4} marginBlockEnd={theme.tokens.space.large}>ファイルアップロード</Heading>
      <Flex as="form" onSubmit={handleSubmit((values) => mutation.mutate(values))}
        direction="column" alignItems="start"
        gap={theme.tokens.space.medium}>
        <TextField width="400px" label="ファイルのキー" required {...register("key")}/>
        <SelectField label="アクセスレベル" {...register("level")}>
          <option value="private">private</option>
          <option value="public">public</option>
          <option value="protected">protected</option>
        </SelectField>
        <Button as="label" htmlFor="fileInput">ファイルを選択する</Button>
        <input type="file" id="fileInput" hidden {...register("files")} required />
        {mutation.isError && (
          <Alert variation="error"
            heading="エラー">
            {String(mutation.error)}
          </Alert>
        )}
        <Button type="submit" color="primary">アップロードする</Button>
      </Flex>
    </View>
  )
}
