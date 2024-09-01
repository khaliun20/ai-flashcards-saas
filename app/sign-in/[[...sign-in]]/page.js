import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
  // ... (component body)
  return (
    <Container maxWidth="sm" sx={{ padding: 2 }}>
      <AppBar position="static" sx={{backgroundColor: '#3f51b5', marginBottom: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
              Flashcard SaaS
            </Link>
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Sign in
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: 4 }}
        >
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Sign In
          </Typography>
          <SignIn />
        </Box>
    </Container>
  )
}