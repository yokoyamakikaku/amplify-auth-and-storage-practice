"use client"

import { saveAs } from 'file-saver'
import { Storage, StorageAccessLevel } from "@aws-amplify/storage"
import { Heading, View, useTheme, Card, Divider, Button, Flex, SelectField } from "@aws-amplify/ui-react"
import { MdRefresh  } from 'react-icons/md'
import { useQuery } from "@tanstack/react-query"
import { useState } from 'react'

export default function ViewFiles () {
  const theme = useTheme()

  const [level, setLevel] = useState<StorageAccessLevel>('private')

  const {
    data,
    isSuccess,
    refetch
  } = useQuery({
    queryKey: ['files'],
    async queryFn () {
      const { results } = await Storage.list('images/', {
        level: level,
        pageSize: 999,
      })
      return results
    }
  })

  const download = async (key?:string) => {
    if (!key) return
    const result = await Storage.get(key, { download: true })
    if (!result.Body) return
    saveAs(result.Body, key)
  }

  const deleteFile = async (key?: string) => {
    if(!key) return
    await Storage.remove(key)
    refetch()
  }

  return (
    <View marginBlockEnd={theme.tokens.space.xl}>
      <Flex alignItems="start" marginBlockEnd={theme.tokens.space.large}>
        <Heading
          level={4} grow={1}>
          ファイルの一覧
        </Heading>
        <Flex>
          <SelectField label="アクセスレベル" labelHidden value={level} onChange={event => setLevel(event.target.value as StorageAccessLevel)}>
            <option value="private">private</option>
            <option value="public">public</option>
            <option value="protected">protected</option>
          </SelectField>
          <Button onClick={() => refetch()}>
            <MdRefresh />
          </Button>
        </Flex>
      </Flex>
      {isSuccess && data.map(item => (
        <View key={item.key}>
          <Flex
            alignItems="center"
            paddingBlock={theme.tokens.space.xs} gap={theme.tokens.space.small}>
            <View grow={1}>{item.key}</View>
            <View shrink={0}>
              <Flex gap={theme.tokens.space.xs}>
                <Button size="small" onClick={() => deleteFile(item.key)}>削除</Button>
                <Button size="small" onClick={() => download(item.key)}>ダウンロード</Button>
              </Flex>
            </View>
          </Flex>
          <Divider />
        </View>
      ))}
    </View>
  )
}
