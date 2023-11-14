const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();

const filePath = "anecs.json";

app.use(express.static(__dirname + "/public"));


app.get("/categories/:category", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get("/anecs", function (req, res) {
    const content = fs.readFileSync(filePath, "utf8");
    const anecs = JSON.parse(content);

    res.send(anecs);
});

app.get("/anecs/:id", function (req, res) {
    const content = fs.readFileSync(filePath, "utf8");
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

app.get("/anecs/categories/:category", function (req, res) {
    const content = fs.readFileSync(filePath, "utf8");
    const anecs = JSON.parse(content);

    const category = req.params.category;
    const categoryAnecs = anecs.filter(item => item.category === category);

    if (categoryAnecs) {
        res.send(categoryAnecs);
    }
    else {
        res.status(404).send();
    }
});

app.patch("/anecs/:id", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const content = fs.readFileSync(filePath, "utf8");
    const anecs = JSON.parse(content);

    const id = parseInt(req.params.id);
    const anec = anecs.find(p => p.id === id);


    if (anec) {
        anec.likes = req.body.likes;
        data = JSON.stringify(anecs);
        fs.writeFileSync(filePath, data);
        res.json({ likes: anec.likes });
    } else {
        res.status(404).send();
    }

});

app.post("/anecs", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    let anec = { text: req.body.text, likes: req.body.likes };

    let data = fs.readFileSync(filePath, "utf8");
    let anecs = JSON.parse(data);

    const id = Math.max.apply(Math, anecs.map(function (e) { return e.id; }))
    anec.id = id + 1;
    anecs.push(anec);
    data = JSON.stringify(anecs);
    fs.writeFileSync("anecs.json", data);
    res.send(anec);
})

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});