const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.listen(3000, () => console.log('Server está rodando na porta 3000'));

app.use(bodyParser.json());


app.post('/teams', (req, res) => {
  const { name, initials, country } = req.body;

  const validateName = name.length > 5;

  const validateCountry = country.length > 3;

  const count = [...initials].reduce((acc, letter) => {
    return letter === letter.toUpperCase() ? acc + 1 : acc;
  }, 0);

  if (validateName && validateCountry && count <= 3) {

    const saved = fs.readFileSync('./teams.txt', 'utf-8') || '[]';
    const teams = JSON.parse(saved);
    teams.push(req.body)

    fs.writeFileSync('./teams.txt', JSON.stringify(teams));
    return res.status(200).json(req.body);

  } else {
    return res.status(400).json({ "message": "invalid data" });
  }
});

app.get('/teams', (_req, res) => {
  
  const teams = fs.readFileSync('./teams.txt', 'utf-8') || '{ "teams": [] }';

  res.status(200).json(JSON.parse(teams));

});