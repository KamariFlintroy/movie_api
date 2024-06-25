const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

app.use(bodyParser.json());

//Example user
let users = [
  {
    id: 1,
    name: 'Kim',
    favoriteMovies: ['The Avengers'],
  },
  {
    id: 2,
    name: 'Joe',
    favoriteMovies: ['Deadpool'],
  },
];

let movies = [
  {
    "Title": 'The Avengers',
    "Description":
      "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    "Genre": {
      "Name": 'Action',
      "Description":
        "The Avengers is a genre-defining action and sci-fi film that brings together Marvel's mightiest heroes to face an unprecedented global threat. Combining intense action sequences, cutting-edge special effects, and a gripping storyline, the film showcases the teamwork and resilience of iconic characters like Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye as they battle to save humanity from the mischievous Loki and his alien army.",
    },
    "Director": {
      "Name": 'Joss Whedon',
      "Bio": "Joss Whedon is an American filmmaker, screenwriter, and producer known for his work in television and film. Born on June 23, 1964, in New York City, he comes from a family with a strong background in writing and show business. Whedon is best known for creating the cult television series 'Buffy the Vampire Slayer' (1997-2003), 'Angel' (1999-2004), 'Firefly' (2002-2003), and 'Dollhouse' (2009-2010). In addition to his television work, Whedon directed and co-wrote 'The Avengers' (2012) and its sequel 'Avengers: Age of Ultron' (2015), which were major box office successes and and pivotal films in the MCU. Whedon is also recognized for his distinct writing style, characterized by sharp dialogue, strong character development, and blending genres. Throughout his career, Whedon has earned a reputation for creating complex, empowered female characters and for his significant contributions to the science fiction and fantasy genres",
      "BirthYear": 1964,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Avengers: Age of Ultron',
    "Description":
      "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.",
    "Genre": {
      "Name": 'Action',
      "Description": "Avengers: Age of Ultron is an action-packed sci-fi film that follows Earth's mightiest heroes as they confront a new and formidable adversary, the rogue artificial intelligence Ultron. As Tony Stark and Bruce Banner's attempt to jumpstart a dormant peacekeeping program goes awry, the Avengers must unite to stop Ultron's catastrophic plans. The film combines thrilling action sequences, advanced special effects, and a compelling narrative, highlighting themes of teamwork, redemption, and the ethical implications of technology.",
    },
    "Director": {
      "Name": 'Joss Whedon',
      "Bio": "Joss Whedon is an American filmmaker, screenwriter, and producer known for his work in television and film. Born on June 23, 1964, in New York City, he comes from a family with a strong background in writing and show business. Whedon is best known for creating the cult television series 'Buffy the Vampire Slayer' (1997-2003), 'Angel' (1999-2004), 'Firefly' (2002-2003), and 'Dollhouse' (2009-2010). In addition to his television work, Whedon directed and co-wrote 'The Avengers' (2012) and its sequel 'Avengers: Age of Ultron' (2015), which were major box office successes and and pivotal films in the MCU. Whedon is also recognized for his distinct writing style, characterized by sharp dialogue, strong character development, and blending genres. Throughout his career, Whedon has earned a reputation for creating complex, empowered female characters and for his significant contributions to the science fiction and fantasy genres",
      "BirthYear": 1964,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Avengers: Infinity War',
    "Description":
      'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.',
    "Genre": {
      "Name": 'Action',
      "Description": "Avengers: Infinity War is an epic action and sci-fi film that brings together the Avengers and their allies to confront the universe's most powerful threat, Thanos. As he seeks to collect all six Infinity Stones to wield ultimate power, the heroes must put aside their differences and unite in a battle that spans the cosmos. With breathtaking action sequences, state-of-the-art special effects, and a storyline filled with suspense and emotional stakes, the film explores themes of sacrifice, resilience, and the complexity of good versus evil.",
    },
    "Director": {
      "Name": 'Anthony Russo, Joe Russo',
      "Bio": "Anthony Russo and Joe Russo, collectively known as the Russo Brothers, are acclaimed American filmmakers renowned for their significant contributions to the Marvel Cinematic Universe (MCU). Born in Cleveland, Ohio, Anthony on February 3, 1970, and Joe on July 18, 1971, the Russo Brothers began their careers in television, directing episodes for series such as 'Arrested Development' and 'Community.' Their major breakthrough in film came when they directed 'Captain America: The Winter Soldier' (2014), which was highly praised for its action sequences and political intrigue. They continued their success in the MCU with 'Captain America: Civil War' (2016), and later helmed the monumental 'Avengers: Infinity War' (2018) and 'Avengers: Endgame' (2019). 'Endgame' became the highest-grossing film of all time, showcasing their ability to blend complex storytelling with large ensemble casts and epic action scenes. Beyond the MCU, the Russo Brothers have produced and directed several other projects, including the action-thriller 'Extraction' (2020) and the crime drama 'Cherry' (2021). They are also the founders of AGBO, a production company focused on creating innovative and diverse film and television content. Their influence in modern cinema is marked by their skill in crafting compelling narratives and their successful partnership as a dynamic directing duo.",
      "BirthYear": 'Anthony Russo 1970, Joe Russo 1971',
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Avengers: Endgame',
    "Description":
      "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    "Genre": {
      "Name": 'Action',
      "Description": '',
    },
    "Director": {
      "Name": 'Anthony Russo, Joe Russo',
      "Bio": "Anthony Russo and Joe Russo, collectively known as the Russo Brothers, are acclaimed American filmmakers renowned for their significant contributions to the Marvel Cinematic Universe (MCU). Born in Cleveland, Ohio, Anthony on February 3, 1970, and Joe on July 18, 1971, the Russo Brothers began their careers in television, directing episodes for series such as 'Arrested Development' and 'Community.' Their major breakthrough in film came when they directed 'Captain America: The Winter Soldier' (2014), which was highly praised for its action sequences and political intrigue. They continued their success in the MCU with 'Captain America: Civil War' (2016), and later helmed the monumental 'Avengers: Infinity War' (2018) and 'Avengers: Endgame' (2019). 'Endgame' became the highest-grossing film of all time, showcasing their ability to blend complex storytelling with large ensemble casts and epic action scenes. Beyond the MCU, the Russo Brothers have produced and directed several other projects, including the action-thriller 'Extraction' (2020) and the crime drama 'Cherry' (2021). They are also the founders of AGBO, a production company focused on creating innovative and diverse film and television content. Their influence in modern cinema is marked by their skill in crafting compelling narratives and their successful partnership as a dynamic directing duo.",
      "BirthYear": 'Anthony Russo 1970, Joe Russo 1971',
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Avengers: Secret Wars',
    "Description": 'Plot under wraps',
    "Genre": {
      "Name": 'Action',
      "Description": '?',
    },
    "Director": {
      "Name": '?',
      "Bio": '?',
      "BirthYear": '',
    },
    "ImageURL": 'url-to-image',
    "Featured": '',
  },

  {
    "Title": 'Deadpool',
    "Description":
      'A wisecracking mercenary gets experimented on and becomes immortal yet hideously scarred, and sets out to track down the man who ruined his looks.',
    "Genre": {
      "Name": 'Action',
      "Description:": '',
    },
    "Director": {
      "Name": 'Tim Miller',
      "Bio": "Tim Miller is an American filmmaker and visual effects artist best known for his directorial debut with the blockbuster film 'Deadpool' (2016). Born on October 10, 1964, in Fort Washington, Maryland, Miller began his career in visual effects, co-founding the Blur Studio in 1995, which worked on numerous film, television, and video game projects. His direction of 'Deadpool' received widespread acclaim for its unique blend of humor, action, and faithful adaptation of the comic book character, leading to significant box office success and revitalizing the superhero genre with its R-rated approach. Miller has continued to work on high-profile projects, including 'Terminator: Dark Fate' (2019), further establishing his reputation in the film industry.",
      "BirthYear": 1964,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Deadpool 2',
    "Description":
      'Foul-mouthed mutant mercenary Wade Wilson (a.k.a. Deadpool) assembles a team of fellow mutant rogues to protect a young boy with abilities from the brutal, time-traveling cyborg Cable.',
    "Genre": {
      "Name": 'Action',
      "Description": '',
    },
    "Director": {
      "Name": 'David Leitch',
      "Bio": "David Leitch is an American filmmaker, stunt coordinator, and actor known for his work in action cinema. Born on November 16, 1969, in Kohler, Wisconsin, Leitch co-directed the critically acclaimed 'John Wick' (2014) with Chad Stahelski, although he was uncredited for the role. His expertise in choreographing action sequences stems from his extensive background in stunt work, having doubled for actors such as Brad Pitt and Jean-Claude Van Damme.Leitch made his solo directorial debut with 'Atomic Blonde' (2017), starring Charlize Theron, which was praised for its stylish action and intricate fight scenes. He followed this success by directing 'Deadpool 2' (2018), which further cemented his reputation in Hollywood as a top action director. Leitch's other notable work includes 'Fast & Furious Presents: Hobbs & Shaw' (2019), demonstrating his ability to helm big-budget, high-octane projects. Through his production company, 87North, he continues to influence the action genre with innovative and dynamic storytelling.",
      "BirthYear": 1975,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Deadpool & Wolverine',
    "Description":
      'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy.',
    "Genre": {
      "Name": 'Action',
      "Description": '',
    },
    "Director": {
      "Name": 'Shawn Levy',
      "Bio": "Shawn Levy is a Canadian filmmaker, producer, and actor renowned for his work in both film and television. Born on July 23, 1968, in Montreal, Quebec, Levy initially gained recognition as a director with the successful 'Cheaper by the Dozen' (2003) and its sequel. He further established his reputation with the 'Night at the Museum' trilogy, blending humor and adventure, which became a global box office hit. Levy's versatility is evident in his broad range of projects. He directed the family-friendly 'Real Steel' (2011) and the comedy 'The Internship' (2013), showcasing his ability to handle different genres. In addition to his directorial work, Levy has made a significant impact as a producer. He is the executive producer of the critically acclaimed Netflix series 'Stranger Things,' which has won numerous awards and become a cultural phenomenon. Levy's production company, 21 Laps Entertainment, continues to produce popular and diverse content. His knack for balancing heart, humor, and spectacle has made him a prominent figure in Hollywood, known for delivering engaging and entertaining films and television shows.",
      "BirthYear": 1968,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Black Panther',
    "Description":
      "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    "Genre": {
      "Name": 'Action',
      "Description": '',
    },
    "Director": {
      "Name": 'Ryan Coogler',
      "Bio": "Ryan Coogler is an acclaimed American filmmaker and screenwriter, known for his impactful and culturally resonant films. Born on May 23, 1986, in Oakland, California, Coogler first garnered widespread attention with his debut feature film, 'Fruitvale Station' (2013). The film, based on the real-life story of Oscar Grant, received critical acclaim and won several awards, including the Grand Jury Prize and the Audience Award at the Sundance Film Festival. Coogler's talent and vision further shone through in 'Creed' (2015), a successful continuation of the Rocky franchise, which he directed and co-wrote. The film was praised for its fresh take on the classic boxing saga and solidified Coogler's reputation in Hollywood. In 2018, Coogler directed 'Black Panther,' a groundbreaking Marvel superhero film that became a global phenomenon. 'Black Panther' was celebrated for its cultural significance, diverse representation, and powerful storytelling, earning over $1.3 billion worldwide and securing multiple Academy Award nominations, including Best Picture. The film won three Oscars for Best Original Score, Best Costume Design, and Best Production Design. Ryan Coogler's work is characterized by its deep social consciousness, compelling characters, and rich narratives. His contributions to cinema have not only entertained audiences but also sparked important conversations about race, identity, and history. Coogler continues to be a prominent and influential voice in the film industry, with upcoming projects that promise to further his legacy.",
      "BirthYear": 1986,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },

  {
    "Title": 'Black Panther: Wakanda Forever',
    "Description":
      "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    "Genre": {
      "Name": 'Action',
      "Description": '',
    },
    "Director": {
      "Name": 'Ryan Coogler',
      "Bio": "Ryan Coogler is an acclaimed American filmmaker and screenwriter, known for his impactful and culturally resonant films. Born on May 23, 1986, in Oakland, California, Coogler first garnered widespread attention with his debut feature film, 'Fruitvale Station' (2013). The film, based on the real-life story of Oscar Grant, received critical acclaim and won several awards, including the Grand Jury Prize and the Audience Award at the Sundance Film Festival. Coogler's talent and vision further shone through in 'Creed' (2015), a successful continuation of the Rocky franchise, which he directed and co-wrote. The film was praised for its fresh take on the classic boxing saga and solidified Coogler's reputation in Hollywood. In 2018, Coogler directed 'Black Panther,' a groundbreaking Marvel superhero film that became a global phenomenon. 'Black Panther' was celebrated for its cultural significance, diverse representation, and powerful storytelling, earning over $1.3 billion worldwide and securing multiple Academy Award nominations, including Best Picture. The film won three Oscars for Best Original Score, Best Costume Design, and Best Production Design. Ryan Coogler's work is characterized by its deep social consciousness, compelling characters, and rich narratives. His contributions to cinema have not only entertained audiences but also sparked important conversations about race, identity, and history. Coogler continues to be a prominent and influential voice in the film industry, with upcoming projects that promise to further his legacy.",
      "BirthYear": 1986,
    },
    "ImageURL": 'url-to-image',
    "Featured": true,
  },
];

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }

});

// UPDATE
app.put('/users/:id/', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }

});

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
    
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
    
});

// DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
    
});

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
       res.status(200).json(movie);
    }  else {
       res.status(400).send('no such movie')
    }

});

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('no such genre');
    }
  
});

// READ
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('no such director');
    }
  
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
