import express, { json, static as expressStatic } from "express";
import { readFileSync, writeFileSync } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const jsonParser = json();

const anecsFile = "anecs.json";

app.use(expressStatic(__dirname + "/public/views"));
app.use(expressStatic(__dirname + "/public/styles"));
app.use(expressStatic(__dirname + "/public/scripts"));



app.get("/admin_validation", (req, res) => {
    res.sendFile(__dirname + '/public/views/admin_validation.html');
})

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + '/public/views/admin.html');
})

app.get("/add", (req, res) => {
    res.sendFile(__dirname + '/public/views/add.html');
})

app.get("/anecs", function (req, res) {
    const content = readFileSync(anecsFile, "utf8");
    const anecs = JSON.parse(content);

    res.send(anecs);
});

app.get("/new_anecs", function (req, res) {
    const content = readFileSync(anecsFile, "utf8");
    const anecs = JSON.parse(content);

    res.send(anecs);
});

app.get("/anecs/:id", function (req, res) {
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

app.delete("/new_anecs/:id", function (req, res) {
    const content = readFileSync(anecsFile, "utf8");
    const anecs = JSON.parse(content);

    const id = parseInt(req.params.id);

    let index = -1;
    for (let i=0; i < anecs.length; i++) {
        if (anecs[i].id === id) {
            index = i;
            break;
        }
    }


    if (index !== -1)  {
        
        const anec = anecs.splice(index, 1)[0];
        const data = JSON.stringify(anecs);
        writeFileSyn(anecsFile, data);
        res.send(anec);
        
    } else {
        res.status(404).send();
    }

});


app.patch("/anecs/:id", jsonParser, function (req, res) {
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

app.post("/anecs", jsonParser, function (req, res) {

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

app.post("/new_anecs", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);


    let data = readFileSync(anecsFile, "utf8");
    let anecs = JSON.parse(data);

    const id = Math.max.apply(Math, anecs.map(function (e) { return e.id; }))
    let anec = { id: id + 1, text: req.body.text};

    anecs.push(anec);
    data = JSON.stringify(anecs);
    writeFileSync(anecsFile, data);
    res.send(anec);
})

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});