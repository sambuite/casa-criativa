const express = require('express');
const nunjucks = require('nunjucks');

const db = require('./db');

const server = express();

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true}));

/*
const ideas = [
   {
      img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
      title: "Curso de Programação",
      category: "Estudo",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At commodi magnam tenetur culpa aspernatur",
      url: "http://github.com/sambuite/",
   },
   {
      img: "https://image.flaticon.com/icons/svg/2729/2729018.svg",
      title: "Videoaula no Youtube",
      category: "Estudo",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At commodi magnam tenetur culpa aspernatur",
      url: "http://github.com/sambuite/",
   },
   {
      img: "https://image.flaticon.com/icons/svg/2728/2728995.svg",
      title: "Ideias para Home Office",
      category: "Trabalho",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At commodi magnam tenetur culpa aspernatur",
      url: "http://github.com/sambuite/",
   },
   {
      img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
      title: "Meditação",
      category: "Mentalidade",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At commodi magnam tenetur culpa aspernatur",
      url: "http://github.com/sambuite/",
   },
];
*/
nunjucks.configure("views", {
   express: server,
   noCache: true,
});

server.get('/', (req, res) => {

   db.all(`SELECT * FROM ideas`, function(err, rows) {
      if (err) {
         console.log(err);
         return res.send("Erro no banco de dados")
      };

      const reversedIdeas = [...rows].reverse();

      let lastIdeas = [];
      for (idea of reversedIdeas){
         if(lastIdeas.length < 3) {
            lastIdeas.push(idea);
         }
      }

      return res.render("index.html", { ideas: lastIdeas })
   });

});
server.post('/', (req,res) => {
   const { title, category, image, description, link } = req.body; 

   const query = `
   INSERT INTO ideas(
      image,
      title,
      category,
      description,
      link
   ) VALUES (?,?,?,?,?);`;

   const values = [
      image,
      title,
      category,
      description,
      link
   ]

   db.run(query, values, function(err) {
      if (err) {
         console.log(err);
         return res.send("Erro no banco de dados")
      };

      return res.redirect('/ideias');
   });
   
});

server.get('/ideias', (req, res) => {

   db.all(`SELECT * FROM ideas`, function(err, rows) {
      if (err) {
         console.log(err);
         return res.send("Erro no banco de dados")
      };

      const reversedIdeas = [...rows].reverse();

      return res.render("ideias.html", { ideas: reversedIdeas })
   })
});

server.listen(3000);