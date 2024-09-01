'use client'

import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {getFirestore, collection, doc, getDoc, setDoc, writeBatch} from 'firebase/firestore'
import {db} from '@/firebase'
import {useState} from 'react'

import {Container, Grid, Card, CardActionArea, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box} from '@mui/material'



export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})

  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()



  const handleSubmit = async () => {
    fetch('api/generate',{
      method: 'POST',
      body: text,
    })
    .then(res => res.json())
    .then(data => setFlashcards(data))
  }

  const handleCardClick = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }


  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()){
      const collections = userDocSnap.data().flashcardSets || []
      if (collections.find((f) => f.name === name)) {
        alert('You already have a flashcard set with this name.')
        return
      }else{
        collections.push({name})
        batch.set(userDocRef, {flashcardSets: collections},{merge: true})
      }
    }
    else{
      batch.set(userDocRef,{flashcards:[{name}]})
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    alert('Flashcards saved successfully!')
    handleClose()
    router.push('/flashcards')
  }



  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
              '& fieldset': {
                borderColor: 'text.primary',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'text.secondary',
              '&.Mui-focused': {
                color: 'primary.main',
              },
            },
            '& .MuiInputBase-input': {
              color: 'text.primary',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {flipped[index] ? (
                      <Typography>{flashcard.back}</Typography>
                    ) : (
                      <Typography>{flashcard.front}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}