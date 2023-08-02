"use client"

import { useMemo } from "react"
import {
  Divider,
  Flex,
  Heading,
  useAuthenticator,
  Placeholder,
  View,
  useTheme,
  Button,
  Badge
} from "@aws-amplify/ui-react"

export default function ViewWelcomeMessage () {
  const { user, signOut } = useAuthenticator()
  const theme = useTheme()
  const email = user.attributes?.email
  const groups = useMemo(() => {
    const groups: string[] = []

    const session = user.getSignInUserSession()
    if (!session) return groups
    const { payload } = session.getAccessToken()
    const cognitoGroups = payload['cognito:groups']
    if (!Array.isArray(cognitoGroups)) return groups

    for (const group of cognitoGroups) {
      if (typeof group !== "string") continue
      groups.push(group)
    }

    return groups
  }, [user])
  return (
    <View marginBlockEnd={theme.tokens.space.xl}>
      <Flex alignItems="start" marginBlockEnd={theme.tokens.space.small}>
        <View grow={1}>
          <Heading level={5} marginBlockEnd={theme.tokens.space.small}>ようこそ {email ?? <Placeholder />}!</Heading>
          <Flex>{groups.map(group => <Badge key={group}>{group}</Badge>)}</Flex>
        </View>
        {signOut && <Button size="small" onClick={() => signOut()}>ログアウト</Button>}
      </Flex>
      <Divider/>
    </View>
  )
}
