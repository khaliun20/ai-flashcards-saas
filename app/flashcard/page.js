'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, Button } from '@mui/material'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})

  const searchParams = useSearchParams()
  const search = searchParams.get('id')
  const router = useRouter()

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return

      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
      // Initialize flipped state for each card
      const initialFlippedState = {}
      flashcards.forEach(card => {
        initialFlippedState[card.id] = false
      })
      setFlipped(initialFlippedState)
    }
    getFlashcard()
  }, [search, user])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isSignedIn) {
    return <></>
  }

  return (
    <Container maxWidth="md">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => router.push('/flashcards')}
        sx={{ mb: 2 }}
      >
        Back to Collections
      </Button>
      <Grid container spacing={3} sx={{ mt: 4 }}>
      {flashcards.map((flashcard) => (
        <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
          <Card
            sx={{
              height: 200,
              perspective: '1000px',
              '& .card-inner': {
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
              },
              '& .card-inner.flipped': {
                transform: 'rotateY(180deg)',
              },
              '& .card-front, & .card-back': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                overflowY: 'auto', // Changed to overflowY for vertical scrolling only
              },
              '& .card-back': {
                transform: 'rotateY(180deg)',
                paddingTop: 2, // Added top padding
                paddingBottom: 2, // Added bottom padding
              },
            }}
          >
            <CardActionArea
              onClick={() => handleCardClick(flashcard.id)}
              sx={{ height: '100%' }}
            >
              <Box className={`card-inner ${flipped[flashcard.id] ? 'flipped' : ''}`}>
                <CardContent className="card-front">
                  <Typography variant="h6" component="div" sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                    {flashcard.front}
                  </Typography>
                </CardContent>
                <CardContent className="card-back">
                  <Typography variant="h6" component="div" sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                    {flashcard.back}
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Container>
  )
}