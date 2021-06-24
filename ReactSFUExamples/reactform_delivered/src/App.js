import React, { useState, useEffect } from "react";
import SimpleFileUpload, {
  SimpleFileUploadProvider
} from "react-simple-file-upload";

import { signInWithGoogle, auth, generateUserDocument, storage, firestore } from "./firebase";

import moment from 'moment'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import ExitToApp from '@material-ui/icons/ExitToApp';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';


import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Simple File Upload
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
    backgroundPosition: 'center',
    display: 'grid',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    maxWidth: 345,
  },

}));


function App() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState('');
  const [email, setEmail] = useState();
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [tileData, setTileData] = useState([]);

  const classes = useStyles();


  const getTiles = async (uid) => {
    firestore
      .doc('users/'+uid)
      .get()
      .then(snapshot => {
          console.log(snapshot.data())
          let res = snapshot.data()
          if(res.artworks)
            setTileData(res.artworks);

      })
      .catch(err => {
          console.log(err);

      });
  }

  useEffect(()=>{
    auth.onAuthStateChanged(async userAuth => {
      console.log(userAuth)
      const data = await generateUserDocument(userAuth);
      if(data){
        setUser(data)
        console.log(data);
        getTiles(data.uid);
      }

    });
  }, [])

  const resetState = () => {
    setUser()
    setFile()
    setEmail()
    setTitle()
  }

  const sauvegarde = () => {
    console.log(file)
    console.log(title)
    if(!file || !title)
      return false;

    let temp = [...tileData, {
      url: file,
      title: title,
      timestamp: new Date()
    }];

    setTileData(temp)


    console.log(temp);

    firestore.doc('users/'+user.uid).set
      ({
        artworks: temp
      }, {merge: true}).then(function(docRef) {
          console.log(docRef);
          console.log('Document added successfully');
          setFile('')
          setTitle('')
      }).catch(error=>{
          console.log(error)
      });
  }

  return (
    <div className="App">

      <Grid container component="main" className={classes.root}>


        <CssBaseline />
        <Grid item xs={false} sm={4} md={6}
          className={classes.image}>
          { user && file &&
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar
                  alt={user.displayName}
                  src={`${user.photoURL}`}
                  className={classes.large} />
                }
                title={user.displayName}
                subheader={moment(new Date()).format('DD MM YYYY')}
              />

              <CardMedia
                className={classes.media}
                image={file}
                title={title}
              />
            </Card>
          }
        </Grid>

        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <div className={classes.paper}>

            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Submit an artwork
            </Typography>
            <form className={classes.form} noValidate
              onSubmit={(e) => {
                e.preventDefault()
                }}>
              { !user && <Button
                startIcon={<MailIcon />}
                variant="contained" color="primary"
                onClick = {() => {
                  signInWithGoogle()
                }}
                >
                Sign in with Google
              </Button> }
              {/*displayName, photoURL, email */}
              { user &&
              <>
              <Avatar
              alt={user.displayName}
              src={`${user.photoURL}`}
              className={classes.large} />
              <Typography component="h1" variant="h5">
                {user.displayName}
              </Typography>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="title"
                label="Title"
                id="title"
                autoComplete="title"

                value={title}
                error={!title ? true : false}
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
              />

              <Typography component="h1" variant="h5">
                Artwork here
              </Typography>
              <SimpleFileUpload
                apiKey="5ec58ecf3341e6f572c370f40ebfc97a"
                preview="true"
                onSuccess={ (url) =>{
                  setFile(url)
                  console.log(url)
                }}
              />
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={file && title ? false : true}
                    className={classes.submit}
                    onClick={sauvegarde}
                  >
                    Submit
                  </Button>

                  <Button
                    startIcon={<ExitToApp />}
                    variant="contained" color="primary"
                    onClick = {() => {
                      resetState();
                      auth.signOut()
                    }}
                    >
                    Sign out
                  </Button>
                </Grid>
                </>
              }

              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>


        <GridList className={classes.gridList} cols={2.5}>
          {tileData.length > 0 && tileData.map((tile) => (
            <GridListTile key={tile.url}>
              <img src={tile.url} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                actionIcon={
                  <IconButton aria-label={`star ${tile.title}`}>
                    <StarBorderIcon className={classes.title} />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>


      </Grid>
    </div>
  );
}

export default App;
