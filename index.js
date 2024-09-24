const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());
const { check, validationResult } = require('express-validator');
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');
const { update } = require('lodash');

const Movies = Models.Movie;
const Users = Models.User;

/* mongoose.connect('mongodb://localhost:27017/cfDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */

 mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

//Example user
let users = [
  {
    id: 1,
    username: 'Kim',
    favoriteMovies: ['The Avengers'],
  },
  {
    id: 2,
    username: 'Joe',
    favoriteMovies: ['Deadpool'],
  },
];

let movies = [
  {
    Title: 'The Avengers',
    Description:
      "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Joss Whedon',
      Bio: "Joss Whedon is an American filmmaker, screenwriter, and producer known for his work in television and film. Born on June 23, 1964, in New York City, he comes from a family with a strong background in writing and show business. Whedon is best known for creating the cult television series 'Buffy the Vampire Slayer' (1997-2003), 'Angel' (1999-2004), 'Firefly' (2002-2003), and 'Dollhouse' (2009-2010). In addition to his television work, Whedon directed and co-wrote 'The Avengers' (2012) and its sequel 'Avengers: Age of Ultron' (2015), which were major box office successes and and pivotal films in the MCU. Whedon is also recognized for his distinct writing style, characterized by sharp dialogue, strong character development, and blending genres. Throughout his career, Whedon has earned a reputation for creating complex, empowered female characters and for his significant contributions to the science fiction and fantasy genres",
      BirthYear: 1964,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Avengers: Age of Ultron',
    Description:
      "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.",
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Joss Whedon',
      Bio: "Joss Whedon is an American filmmaker, screenwriter, and producer known for his work in television and film. Born on June 23, 1964, in New York City, he comes from a family with a strong background in writing and show business. Whedon is best known for creating the cult television series 'Buffy the Vampire Slayer' (1997-2003), 'Angel' (1999-2004), 'Firefly' (2002-2003), and 'Dollhouse' (2009-2010). In addition to his television work, Whedon directed and co-wrote 'The Avengers' (2012) and its sequel 'Avengers: Age of Ultron' (2015), which were major box office successes and and pivotal films in the MCU. Whedon is also recognized for his distinct writing style, characterized by sharp dialogue, strong character development, and blending genres. Throughout his career, Whedon has earned a reputation for creating complex, empowered female characters and for his significant contributions to the science fiction and fantasy genres",
      BirthYear: 1964,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Avengers: Infinity War',
    Description:
      'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.',
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Anthony Russo',
      Bio: 'Anthony and Joe Russo, known as the Russo Brothers, are acclaimed American filmmakers famous for their work in the Marvel Cinematic Universe (MCU). Born in Cleveland, Ohio—Anthony on February 3, 1970, and Joe on July 18, 1971—the brothers began their careers in television, directing episodes of Arrested Development and Community. Their film breakthrough came with Captain America: The Winter Soldier (2014), praised for its action and political intrigue. They continued their MCU success with Captain America: Civil War (2016), Avengers: Infinity War (2018), and Avengers: Endgame (2019), which became the highest-grossing film of all time. Beyond the MCU, they produced and directed Extraction (2020) and Cherry (2021). They also founded AGBO, a production company focused on innovative content, solidifying their influence in modern cinema.',
      BirthYear: 1970,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Avengers: Endgame',
    Description:
      "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Anthony Russo',
      Bio: "Anthony Russo and Joe Russo, collectively known as the Russo Brothers, are acclaimed American filmmakers renowned for their significant contributions to the Marvel Cinematic Universe (MCU). Born in Cleveland, Ohio, Anthony on February 3, 1970, and Joe on July 18, 1971, the Russo Brothers began their careers in television, directing episodes for series such as 'Arrested Development' and 'Community.' Their major breakthrough in film came when they directed 'Captain America: The Winter Soldier' (2014), which was highly praised for its action sequences and political intrigue. They continued their success in the MCU with 'Captain America: Civil War' (2016), and later helmed the monumental 'Avengers: Infinity War' (2018) and 'Avengers: Endgame' (2019). 'Endgame' became the highest-grossing film of all time, showcasing their ability to blend complex storytelling with large ensemble casts and epic action scenes. Beyond the MCU, the Russo Brothers have produced and directed several other projects, including the action-thriller 'Extraction' (2020) and the crime drama 'Cherry' (2021). They are also the founders of AGBO, a production company focused on creating innovative and diverse film and television content. Their influence in modern cinema is marked by their skill in crafting compelling narratives and their successful partnership as a dynamic directing duo.",
      BirthYear: 1970,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Avengers: Secret Wars',
    Description:
      'Avengers: Secret Wars is an upcoming Marvel Cinematic Universe (MCU) film that is anticipated to be a major crossover event, bringing together characters from across the Marvel universe. Based on the iconic comic book storyline, the movie is expected to feature the Avengers and other Marvel heroes facing off against an array of villains in a multiverse-spanning battle. As realities collide, the heroes must unite to prevent the destruction of the multiverse. With epic battles, unexpected alliances, and high stakes, Avengers: Secret Wars is poised to be one of the most significant and expansive films in the MCU.',
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Anthony Russo',
      Bio: "Anthony Russo and Joe Russo, collectively known as the Russo Brothers, are acclaimed American filmmakers renowned for their significant contributions to the Marvel Cinematic Universe (MCU). Born in Cleveland, Ohio, Anthony on February 3, 1970, and Joe on July 18, 1971, the Russo Brothers began their careers in television, directing episodes for series such as 'Arrested Development' and 'Community.' Their major breakthrough in film came when they directed 'Captain America: The Winter Soldier' (2014), which was highly praised for its action sequences and political intrigue. They continued their success in the MCU with 'Captain America: Civil War' (2016), and later helmed the monumental 'Avengers: Infinity War' (2018) and 'Avengers: Endgame' (2019). 'Endgame' became the highest-grossing film of all time, showcasing their ability to blend complex storytelling with large ensemble casts and epic action scenes. Beyond the MCU, the Russo Brothers have produced and directed several other projects, including the action-thriller 'Extraction' (2020) and the crime drama 'Cherry' (2021). They are also the founders of AGBO, a production company focused on creating innovative and diverse film and television content. Their influence in modern cinema is marked by their skill in crafting compelling narratives and their successful partnership as a dynamic directing duo.",
      BirthYear: 1970,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Deadpool',
    Description:
      'A wisecracking mercenary gets experimented on and becomes immortal yet hideously scarred, and sets out to track down the man who ruined his looks.',
    Genre: {
      Name: 'Comedy',
      'Description:':
        'A light-hearted genre focused on humor, where the primary goal is to entertain and amuse. Comedy often involves exaggerated characters, witty dialogue, and situations that lead to laughter and fun, providing a feel-good experience.',
    },
    Director: {
      Name: 'Tim Miller',
      Bio: "Tim Miller is an American filmmaker and visual effects artist best known for his directorial debut with the blockbuster film 'Deadpool' (2016). Born on October 10, 1964, in Fort Washington, Maryland, Miller began his career in visual effects, co-founding the Blur Studio in 1995, which worked on numerous film, television, and video game projects. His direction of 'Deadpool' received widespread acclaim for its unique blend of humor, action, and faithful adaptation of the comic book character, leading to significant box office success and revitalizing the superhero genre with its R-rated approach. Miller has continued to work on high-profile projects, including 'Terminator: Dark Fate' (2019), further establishing his reputation in the film industry.",
      BirthYear: 1964,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Deadpool 2',
    Description:
      'Foul-mouthed mutant mercenary Wade Wilson (a.k.a. Deadpool) assembles a team of fellow mutant rogues to protect a young boy with abilities from the brutal, time-traveling cyborg Cable.',
    Genre: {
      Name: 'Comedy',
      Description:
        'A light-hearted genre focused on humor, where the primary goal is to entertain and amuse. Comedy often involves exaggerated characters, witty dialogue, and situations that lead to laughter and fun, providing a feel-good experience.',
    },
    Director: {
      Name: 'David Leitch',
      Bio: 'David Leitch is an American filmmaker, stunt coordinator, and actor, renowned for his contributions to action cinema. Born on November 16, 1969, in Kohler, Wisconsin, Leitch co-directed the critically acclaimed John Wick (2014) with Chad Stahelski, though he was uncredited. His expertise in choreographing action sequences comes from his extensive stunt work, doubling for stars like Brad Pitt and Jean-Claude Van Damme. Leitch made his solo directorial debut with Atomic Blonde (2017), praised for its stylish action. He followed with Deadpool 2 (2018), solidifying his reputation as a top action director. His work on Fast & Furious Presents: Hobbs & Shaw (2019) showcased his ability to helm big-budget projects. Through his production company, 87North, Leitch continues to innovate in the action genre.',
      BirthYear: 1975,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Deadpool & Wolverine',
    Description:
      'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy.',
    Genre: {
      Name: 'Comedy',
      Description:
        'A light-hearted genre focused on humor, where the primary goal is to entertain and amuse. Comedy often involves exaggerated characters, witty dialogue, and situations that lead to laughter and fun, providing a feel-good experience.',
    },
    Director: {
      Name: 'Shawn Levy',
      Bio: 'Shawn Levy is a Canadian filmmaker, producer, and actor known for his success in both film and television. Born on July 23, 1968, in Montreal, Quebec, Levy gained early recognition with Cheaper by the Dozen (2003) and its sequel. He solidified his reputation with the Night at the Museum trilogy, blending humor and adventure into global box office hits. Levy’s versatility shines in his diverse projects, such as the family-friendly Real Steel (2011) and the comedy The Internship (2013). As a producer, Levy made a significant impact with the Netflix series Stranger Things, a critically acclaimed cultural phenomenon. Through his production company, 21 Laps Entertainment, Levy continues to create popular and varied content. Known for balancing heart, humor, and spectacle, he remains a prominent figure in Hollywood.',
      BirthYear: 1968,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Black Panther',
    Description:
      "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Ryan Coogler',
      Bio: 'Ryan Coogler is an acclaimed American filmmaker and screenwriter, known for his culturally resonant films. Born on May 23, 1986, in Oakland, California, Coogler gained attention with his debut film, Fruitvale Station (2013), which won critical acclaim and awards at the Sundance Film Festival. He solidified his reputation with Creed (2015), a fresh take on the Rocky franchise that he directed and co-wrote. In 2018, Coogler directed Black Panther, a groundbreaking Marvel film celebrated for its cultural significance and powerful storytelling. Black Panther earned over $1.3 billion worldwide and secured multiple Academy Award nominations, winning three Oscars. Coogler’s work is known for its social consciousness, compelling characters, and rich narratives, making him a prominent and influential voice in cinema.',
      BirthYear: 1986,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Black Panther: Wakanda Forever',
    Description:
      "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Ryan Coogler',
      Bio: "Ryan Coogler is an acclaimed American filmmaker and screenwriter, known for his impactful and culturally resonant films. Born on May 23, 1986, in Oakland, California, Coogler first garnered widespread attention with his debut feature film, 'Fruitvale Station' (2013). The film, based on the real-life story of Oscar Grant, received critical acclaim and won several awards, including the Grand Jury Prize and the Audience Award at the Sundance Film Festival. Coogler's talent and vision further shone through in 'Creed' (2015), a successful continuation of the Rocky franchise, which he directed and co-wrote. The film was praised for its fresh take on the classic boxing saga and solidified Coogler's reputation in Hollywood. In 2018, Coogler directed 'Black Panther,' a groundbreaking Marvel superhero film that became a global phenomenon. 'Black Panther' was celebrated for its cultural significance, diverse representation, and powerful storytelling, earning over $1.3 billion worldwide and securing multiple Academy Award nominations, including Best Picture. The film won three Oscars for Best Original Score, Best Costume Design, and Best Production Design. Ryan Coogler's work is characterized by its deep social consciousness, compelling characters, and rich narratives. His contributions to cinema have not only entertained audiences but also sparked important conversations about race, identity, and history. Coogler continues to be a prominent and influential voice in the film industry, with upcoming projects that promise to further his legacy.",
      BirthYear: 1986,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Spider-Man',
    Description:
      'Spider-Man (2002), starring Tobey Maguire, is a superhero film that follows the story of Peter Parker, an ordinary high school student who gains superhuman abilities after being bitten by a genetically modified spider. As he learns to harness his newfound powers, Peter adopts the alter ego of Spider-Man to fight crime in New York City. Balancing his responsibilities as a hero with his personal life, Peter faces off against the villainous Green Goblin while grappling with the famous mantra, “With great power comes great responsibility.” The film is a beloved adaptation of the classic Marvel Comics character.',
    Genre: {
      Name: 'Fantasy',
      Description:
        'A genre that transports audiences to imaginative worlds filled with magical creatures, epic quests, and supernatural elements. Fantasy often explores themes of good versus evil, featuring heroes who embark on adventures beyond the realm of the ordinary.',
    },
    Director: {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi is an American filmmaker born on October 23, 1959, in Michigan. He is best known for directing The Evil Dead (1981) and the Spider-Man trilogy (2002-2007) starring Tobey Maguire. Raimi’s work blends horror, humor, and inventive storytelling, making him a key figure in both horror and superhero genres. He recently returned to superhero films with Doctor Strange in the Multiverse of Madness (2022).',
      BirthYear: 1959,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Spider-Man 2',
    Description:
      'Spider-Man 2 (2004), starring Tobey Maguire, is the sequel to the 2002 superhero film Spider-Man. The movie follows Peter Parker as he struggles to balance his life as Spider-Man with his personal relationships and responsibilities. Faced with doubts about his double life, Peter’s challenges intensify when Dr. Otto Octavius, a brilliant scientist turned villain, becomes Doctor Octopus after a failed experiment. As Spider-Man, Peter must stop Doctor Octopus from destroying New York City while coming to terms with his own identity and the sacrifices that come with being a hero.',
    Genre: {
      Name: 'Drama',
      Description:
        'A genre centered on realistic, emotional storytelling that delves into complex characters and situations. Drama often explores themes of love, conflict, and moral dilemmas, with a focus on character development and the human condition.',
    },
    Director: {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi is an American filmmaker born on October 23, 1959, in Michigan. He is best known for directing The Evil Dead (1981) and the Spider-Man trilogy (2002-2007) starring Tobey Maguire. Raimi’s work blends horror, humor, and inventive storytelling, making him a key figure in both horror and superhero genres. He recently returned to superhero films with Doctor Strange in the Multiverse of Madness (2022).',
      BirthYear: 1959,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Spider-Man 3',
    Description:
      'Spider-Man 3 (2007), starring Tobey Maguire, is the third installment in the Spider-Man trilogy directed by Sam Raimi. The film follows Peter Parker as he faces his darkest challenges yet, both as Spider-Man and in his personal life. Peter’s bond with a mysterious black substance enhances his powers but also amplifies his darker impulses. Meanwhile, he battles multiple villains, including the Sandman, who is linked to his past, and a new version of the Green Goblin. As Peter struggles with his inner demons and relationships, he must find a way to overcome the darkness within to protect those he loves.',
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Sam Raimi',
      Bio: 'Sam Raimi is an American filmmaker born on October 23, 1959, in Michigan. He is best known for directing The Evil Dead (1981) and the Spider-Man trilogy (2002-2007) starring Tobey Maguire. Raimi’s work blends horror, humor, and inventive storytelling, making him a key figure in both horror and superhero genres. He recently returned to superhero films with Doctor Strange in the Multiverse of Madness (2022).',
      BirthYear: 1959,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Iron Man',
    Description:
      'Iron Man (2008) is a superhero film that marks the beginning of the Marvel Cinematic Universe (MCU). It stars Robert Downey Jr. as Tony Stark, a wealthy and brilliant industrialist who is captured by terrorists while demonstrating a new weapon. During his captivity, Stark builds a powerful suit of armor to escape, which leads him to become the armored superhero, Iron Man. Upon returning home, Stark refines his suit and uses it to combat threats, including those from within his own company. The film is known for its blend of action, humor, and Robert Downey Jr.’s iconic portrayal of Tony Stark.',
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Jon Favreau',
      Bio: 'Jon Favreau is an American filmmaker, actor, and producer, known for his versatile work in both directing and acting. Born on October 19, 1966, in Queens, New York, Favreau gained early recognition as an actor in films like Swingers (1996), which he also wrote. He later became a prominent director, known for helming Iron Man (2008) and Iron Man 2 (2010), launching the Marvel Cinematic Universe. Favreau also directed and produced The Jungle Book (2016) and The Lion King (2019) live-action adaptations. He is the creator of the popular Star Wars series The Mandalorian (2019). Favreau’s work spans genres, making him a key figure in modern Hollywood.',
      BirthYear: 1966,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },

  {
    Title: 'Iron Man 2',
    Description:
      'Iron Man 2 (2010) is the sequel to the 2008 superhero film Iron Man. Directed by Jon Favreau, the movie continues the story of Tony Stark, played by Robert Downey Jr., who publicly reveals himself as Iron Man. As Stark faces pressure from the government to share his technology, he also battles declining health due to the palladium in his chest reactor. Meanwhile, a new villain, Ivan Vanko (Whiplash), emerges, seeking revenge against Stark for his family’s past. Balancing his personal struggles, new threats, and the responsibilities of being Iron Man, Stark must confront challenges that test both his intellect and his resolve.',
    Genre: {
      Name: 'Action',
      Description:
        'A genre that emphasizes high-energy sequences, intense physical stunts, and adrenaline-pumping conflict. Characters often face life-threatening situations, with scenes filled with chases, battles, and explosive confrontations.',
    },
    Director: {
      Name: 'Jon Favreau',
      Bio: 'Jon Favreau is an American filmmaker, actor, and producer, known for his versatile work in both directing and acting. Born on October 19, 1966, in Queens, New York, Favreau gained early recognition as an actor in films like Swingers (1996), which he also wrote. He later became a prominent director, known for helming Iron Man (2008) and Iron Man 2 (2010), launching the Marvel Cinematic Universe. Favreau also directed and produced The Jungle Book (2016) and The Lion King (2019) live-action adaptations. He is the creator of the popular Star Wars series The Mandalorian (2019). Favreau’s work spans genres, making him a key figure in modern Hollywood.',
      BirthYear: 1966,
    },
    ImageURL: 'url-to-image',
    Featured: true,
  },
];

// READ
app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

// READ
app.get(
  '/movies',
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ
app.get(
  '/movies/genre/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movie) => {
        if (!movie) {
          return res
            .status(404)
            .send('Error: ' + req.params.Name + ' was not found');
        } else {
          res.status(200).json(movie.Genre.Description);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ
app.get(
  'movies/director/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
        if (!movie) {
          return res
            .status(404)
            .send('Error: ' + req.params.Name + ' was not found');
        } else {
          res.status(200).json(movie.Name);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ Get all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// CREATE
// Validation logic here for request
//you can either use a chain of methods like .not().isEmpty()
//which means "opposite of isEmpty" in plain english "is not empty"
//or use .isLength({min: 5}) which means
//minimum value of 5 characters are only allowed

app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists ');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birth_date: req.body.Birth_date,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// UPDATE
app.put(
  '/users/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send(' permission denied ');
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birth_date: req.body.Birth_date,
        },
      },
      { new: true }
    )
      .then((updatedUser) => res.status(200).json(updatedUser))
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    });

// CREATE // Add a movie to a user's list of favorites
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
   (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
     Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// DELETE
app.delete(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => res.status(200).json(updatedUser))
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

// DELETE // Delete a user by username
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
   async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req, params.Username + 'was not found');
        } else {
          res.status(200).send(req.params.Username + 'was delete.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on Port ' + port);
});
