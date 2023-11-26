import express, { static as expressStatic } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { adminPassword } from './const_vals.js';
import { readFileSync, writeFileSync } from "fs";
import Datastore from 'nedb';

const anecStorage = new Datastore({ filename: 'data/anecs.db' });
const newAnecStorage = new Datastore({ filename: 'data/new_anecs.db' });
anecStorage.loadDatabase();
newAnecStorage.loadDatabase();

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



// function utilInsert() {
//     const anecsFile = "anecs.json";
//     const content = readFileSync(anecsFile, "utf8");
//     const anecs = JSON.parse(content);
//     anecs.forEach(async (anec) => {
//         const response = await fetch("http://localhost:3000/anecs", {
//             method: "POST",
//             headers: { "Accept": "application/json", "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 text: anec.text,
//                 likes: anec.likes
//             })
//         });
//         console.log(anec);

//     });
// }

/// получаем html файлы /////////////////


app.get("/admin", (req, res) => {
    res.sendFile(__dirname + '/public/views/admin_validation.html');
})

app.get("/rules", (req, res) => {
    res.sendFile(__dirname + '/public/views/rules.html');
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
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;

    let totalPages = 1;
    anecStorage.count({}, (err, count) => {
        totalPages = Math.ceil(count / pageSize);
    });

    const startIndex = (page - 1) * pageSize;

    anecStorage.find({}).skip(startIndex).limit(pageSize).exec((err, anecs) => {
        res.send({ anecs: anecs, totalPages: totalPages });
    });
});


app.get("/anecs/:id", (req, res) => {
    const id = req.params.id;

    anecStorage.findOne({ _id: id }, (err, anec) => {
        if (anec) {
            res.send(anec).send();
        } else {
            res.status(404).send();
        }
    });


});


// для изменения количества лайков под анекдотом 
app.patch("/anecs/:id", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const id = req.params.id;

    anecStorage.findOne({ _id: id }, (err, anec) => {
        if (anec) {
            anecStorage.update({ _id: id }, { $set: { likes: req.body.likes } }, {}, (err) => {
                res.json({ likes: req.body.likes });
            });
        } else {
            res.status(404).send();
        }
    });


});

app.post("/anecs", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const anec = { text: req.body.text, likes: req.body.likes };
    anecStorage.insert(anec);

    res.send(anec);
})

/// для работы с предложенными пользователями анекдотами ///////////////

// получение всех предложенных пользователем анекдотов
app.get("/new_anecs", (req, res) => {
    newAnecStorage.find({}, (err, anecs) => {
        res.send(anecs);
    });
});

// добавление предложенного пользователем анекдота в предложку
app.post("/new_anecs", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const anec = { text: req.body.text };
    newAnecStorage.insert(anec);

    res.send(anec);
})

// удаление предложенного пользователем анекдота
app.delete("/new_anecs/:id", (req, res) => {
    const id = req.params.id;

    newAnecStorage.remove({ _id: id }, function (err, count) {
        if (err || count != 1) {
            return res.status(404).send();;
        }
        else {
            res.status(200).send(id);
        }
    });

});

////////////////////////////////

app.listen(3000, () => {
    console.log("Сервер ожидает подключения...");
});
