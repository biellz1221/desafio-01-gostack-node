const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = []

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  if(typeof title !== 'string') return response.status(400).json({error: 'Title should be string'})
  if(typeof url !== 'string') return response.status(400).json({error: 'URL should be string'})
  if(!Array.isArray(techs)) return response.status(400).json({error: 'Techs shoul be be an array of strings'})
  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(newRepo);
  response.status(201).json(newRepo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  if(!id) return response.status(400).json({error: "ID is required"})
  if(!isUuid(id)) return response.status(400).json({error: "ID should be UUID"})

  const indexToEdit = repositories.findIndex((repo) => {
    return repo.id === id
  })
  
  if(indexToEdit < 0) return response.status(400).json({ msg: "ID not found"})

  const newRepo = {
    title,
    url,
    techs
  }

  if(!newRepo.title) newRepo.title = repositories[indexToEdit].title;
  if(!newRepo.url) newRepo.url = repositories[indexToEdit].url;
  if(!newRepo.techs) newRepo.techs = repositories[indexToEdit].techs;

  repositories[indexToEdit] = { ...repositories[indexToEdit],...newRepo }

  response.status(200).json(repositories[indexToEdit])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if(!id) return response.status(400).json({error: "ID is required"})
  if(!isUuid(id)) return response.status(400).json({error: "ID should be UUID"})

  const indexToRemove = repositories.findIndex((repo) => {
    return repo.id === id
  })
  
  if(indexToRemove < 0) return response.status(400).json({ msg: "ID not found"})

  repositories.splice(indexToRemove, 1)

  response.status(204).json({msg: 'Repository removed successfully'})

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if(!id) return response.status(400).json({error: "ID is required"})
  if(!isUuid(id)) return response.status(400).json({error: "ID should be UUID"})

  const indexToEdit = repositories.findIndex((repo) => {
    return repo.id === id
  })
  
  if(indexToEdit < 0) return response.status(400).json({ msg: "ID not found"})

  repositories[indexToEdit].likes += 1

  response.status(200).json({likes: repositories[indexToEdit].likes})
});

module.exports = app;
