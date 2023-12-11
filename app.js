import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import Datastore from 'nedb';

import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 5,
  message: 'You have exceeded limit!', 
});

const anecStorage = new Datastore({ filename: 'data/anecs.db' });
anecStorage.ensureIndex({ fieldName: 'time' });
const newAnecStorage = new Datastore({ filename: 'data/new_anecs.db' });
anecStorage.loadDatabase();
newAnecStorage.loadDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currData = new Date();


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(__dirname + "/public/views"));
app.use(express.static(__dirname + "/public/styles"));
app.use(express.static(__dirname + "/public/scripts"));
app.use(express.static(__dirname + "/public/images"));

/// получаем html файлы /////////////////


app.get("/admin", (req, res) => {
    res.sendFile(__dirname + '/public/views/admin_validation.html');
})

app.get("/rules", (req, res) => {
    res.sendFile(__dirname + '/public/views/rules.html');
})


app.post("/admin", (req, res) => {
    if (req.body.password === '12345') {
        res.sendFile(__dirname + '/private/admin.html');
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

    anecStorage.find({})
        .sort({ time: -1 })
        .skip(startIndex)
        .limit(pageSize)
        .exec((err, anecs) => {
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
    const change = parseInt(req.body.change);

    if (isNaN(change)) {
        res.status(404).send();
    }

    if (Math.abs(change) != 1) {
        res.status(404).send();
    }

    anecStorage.update({ _id: id }, { $inc: { likes: change } }, {}, (err) => {
        res.json({ change: change });
    });


});

app.post("/anecs", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const anec = { text: req.body.text, likes: req.body.likes, time: currData.getTime() };
    anecStorage.insert(anec);

    res.send(anec);
})

app.delete("/anecs/:id", (req, res) => {
    const id = req.params.id;

    anecStorage.remove({ _id: id }, function (err, count) {
        if (err || count != 1) {
            return res.status(404).send();
        }
        else {
            res.status(200).send(id);
        }
    });

});

/// для работы с предложенными пользователями анекдотами ///////////////

// получение всех предложенных пользователем анекдотов
app.get("/new_anecs", (req, res) => {
    newAnecStorage.find({}, (err, anecs) => {
        res.send(anecs);
    });
});

// добавление предложенного пользователем анекдота в предложку
app.post("/new_anecs",  rateLimiter, (req, res) => {
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