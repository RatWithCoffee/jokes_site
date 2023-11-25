import express, { json, static as expressStatic } from "express";
import { readFileSync, writeFileSync } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import {adminPassword} from './const_vals.js';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/admin.html", (req, res) => {
    res.status(404).send();
})

app.use(expressStatic(__dirname + "/public/views"));
app.use(expressStatic(__dirname + "/public/styles"));
app.use(expressStatic(__dirname + "/public/scripts"));
app.use(expressStatic(__dirname + "/public/images"));

const anecsFile = "anecs.json";
const newAnecsFile = 'new_anecs.json';

/// получаем html файлы /////////////////
 

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + '/public/views/admin_validation.html');
})


app.post("/admin", (req, res) => {
    if (req.body.password === adminPassword) {
        res.sendFile(__dirname + '/public/views/admin.html');
    } else {
        res.sendFile(__dirname + '/public/views/no_password.html');
    }

})

app.get("/add", (req, res) => {
    res.sendFile(__dirname + '/public/views/add.html');
})

app.get("/about", (req, res) => {
    res.sendFile(__dirname + '/public/views/about.html');
})




/// для работы с общим списков анедотов //////////

app.get("/anecs", (req, res) => {
    const content = readFileSync(anecsFile, "utf8");
    const anecs = JSON.parse(content);

    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedAnecs = anecs.slice(startIndex, endIndex);
    const totalPages = Math.ceil(anecs.length / pageSize);


    res.send({ anecs: paginatedAnecs, totalPages: totalPages });
});


app.get("/anecs/:id", (req, res) => {
    const content = readFileSync(anecsFile, "utf8");
    const anecs = JSON.parse(content);

    const id = parseInt(req.params.id);
    const anec = anecs.find(item => item.id === id);

    if (anec) {
        res.send(anec);
    }
    else {
        res.status(404).send();
    }
});


// для изменения количества лайков под анекдотом 
app.patch("/anecs/:id", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const content = readFileSync(anecsFile, "utf8");
    const anecs = JSON.parse(content);

    const id = parseInt(req.params.id);
    const anec = anecs.find(p => p.id === id);


    if (anec) {
        anec.likes = req.body.likes;
        const data = JSON.stringify(anecs);
        writeFileSync(anecsFile, data);
        res.json({ likes: anec.likes });
    } else {
        res.status(404).send();
    }

});

app.post("/anecs", (req, res) => {

    if (!req.body) return res.sendStatus(400);

    let data = readFileSync(anecsFile, "utf8");
    let anecs = JSON.parse(data);

    const id = Math.max.apply(Math, anecs.map(function (e) { return e.id; }))
    let anec = { id: id + 1, text: req.body.text, likes: req.body.likes, category: req.body.category };

    anecs.push(anec);
    data = JSON.stringify(anecs);
    writeFileSync(anecsFile, data);
    res.send(anec);
})

/// для работы с предложенными пользователями анекдотами ///////////////

// получение всех предложенных пользователем анекдотов
app.get("/new_anecs", (req, res) => {
    const content = readFileSync(newAnecsFile, "utf8");
    const anecs = JSON.parse(content);

    res.send(anecs);
});

// добавление предложенного пользователем анекдота к остальным анекдотам
app.post("/new_anecs", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    let data = readFileSync(newAnecsFile, "utf8");
    let id, anecs;
    if (data === '' || data === '[]' ) {
        console.log('sdg');
        id = 0;
        anecs = [];
    } else {
        anecs = JSON.parse(data);
        id = Math.max.apply(Math, anecs.map(function (e) { return e.id; }));
    }

    const anec = { id: id + 1, text: req.body.text };

    anecs.push(anec);
    data = JSON.stringify(anecs);
    writeFileSync(newAnecsFile, data);
    res.send(anec);
})

// удаление предложенного пользователем анекдота
app.delete("/new_anecs/:id", (req, res) => {
    const content = readFileSync(newAnecsFile, "utf8");
    const anecs = JSON.parse(content);

    const id = parseInt(req.params.id);

    let index = -1;
    for (let i = 0; i < anecs.length; i++) {
        if (anecs[i].id === id) {
            index = i;
            break;
        }
    }


    if (index !== -1) {
        const anec = anecs.splice(index, 1)[0];
        const data = JSON.stringify(anecs);
        writeFileSync(newAnecsFile, data);
        res.send(anec);
    } else {
        res.status(404).send();
    }

});

////////////////////////////////

app.listen(3000, () => {
    console.log("Сервер ожидает подключения...");
});