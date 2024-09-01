'use client'

import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material'
import { SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import getStripe from '@/utils/get-stripe'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {

  const { isSignedIn } = useUser()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/flashcards')
    } else {
      router.push('/sign-up')
    }
  }

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.status === 500) {
      console.warn(checkoutSessionJson.error.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5', marginBottom: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" component={Link} href="/sign-in">Sign in</Button>
            <Button color="inherit" component={Link} href="/sign-up">Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <SignOutButton>
              <Button color="inherit">Sign out</Button>
            </SignOutButton>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={handleGetStarted}>
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          {/* Feature items */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              Smart Flashcards
            </Typography>
            <Typography>
              Our AI will break down your text into flashcards.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              Accessible Anywhere
            </Typography>
            <Typography>
              Access your flashcards from anywhere, on any device.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">
              Customizable Flashcards
            </Typography>
            <Typography>
              Customize your flashcards to your liking.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: '#ccc',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Typography variant="h5">Basic</Typography>
              <Typography variant="h6">$0/month</Typography>
              <Typography>
                Access to basic flashcards and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleGetStarted}>
                Get Started
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: '#ccc',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <Typography variant="h5">Pro</Typography>
              <Typography variant="h6">$5/month</Typography>
              <Typography>
                Access to all features. (to be determined)
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}