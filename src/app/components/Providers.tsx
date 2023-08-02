"use client"

import { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import { Authenticator, useTheme } from '@aws-amplify/ui-react'
import { View } from '@aws-amplify/ui-react'

import config from '@/aws-exports'

const client = new QueryClient()
Amplify.configure(config)

export default function Providers ({ children } : PropsWithChildren) {
  const theme = useTheme()
  return (
    <QueryClientProvider client={client}>
      <Authenticator>
        <View
          marginInline="auto"
          paddingBlock={theme.tokens.space.large}
          maxWidth={theme.breakpoints.values.large}>
          {children}
        </View>
      </Authenticator>
    </QueryClientProvider>
  )
}
