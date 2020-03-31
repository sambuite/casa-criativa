const express = require('express');
const nunjucks = require('nunjucks');

const db = require('./db');

const server = express();

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true}));

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


server.delete('/ideias/:id', async (req, res) => {
   const {id} = await req.params;
   console.log('id:::', id)

   db.run(`DELETE FROM ideas WHERE id = ?`, [id], function(err) {
      if (err) {
         console.log(err);
         return res.send("Erro no banco de dados")
      };

      console.log("Deletei", this)
   });

   return res.status(204).send();
})

server.listen(3000);