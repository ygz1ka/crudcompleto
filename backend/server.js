// Express abre as páginas. JSON Server faz o CRUD em db.json.
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());
app.use(jsonServer.bodyParser);
app.use(router); // GET, POST, PUT e DELETE em /pessoas

app.listen(3000, () => {
    console.log('Abra http://localhost:3000');
});
