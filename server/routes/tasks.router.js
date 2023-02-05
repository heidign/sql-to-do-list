const express = require("express");
const router = express.Router();

const pool = require("../modules/pool");




// DB CONNECTION

// GET
router.get("/", (req, res) => {
  let queryText = `SELECT * FROM "todo"
  ORDER BY id ASC;`;
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error making queryText: ${queryText}`, err);
      res.sendStatus(500);
    });
});

// POST
router.post('/', (req, res) => {

    const newTask = req.body;
    const queryText = `
        INSERT INTO "todo" ("task", "isComplete")
        VALUES ($1, $2);
    `;
    const queryParams = [
        newTask.task,
        newTask.completed
    ]
    pool.query(queryText, queryParams)
        .then((result) => {
            console.log("Insert result:", result);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making query ${queryText}`, error);
            res.sendStatus(500);
        })
});

// PUT isComplete //
router.put('/:id', (req, res) => {
    const queryText = `
    UPDATE todo 
    SET "isComplete"= $1
    WHERE id=$2;
    `;
    const queryParams = [req.body.completed, req.params.id];
    pool.query(queryText, queryParams)
    .then((dbRes) => {
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('PUT /todo/:id failed', error)
    });
});

// PUT edit //
router.put('/edit/:id', (req, res) => {
    const queryText = `
    UPDATE todo 
    SET "task"= $2
    WHERE id=$1;
    `;
    const queryParams = 
    [req.params.id,
        req.body.task,
        // req.body.completed
    ];
    pool.query(queryText, queryParams)
    .then((dbRes) => {
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('PUT /todo/edit/:id failed', error)
    });
});

// DELETE //
router.delete('/:id', (req, res) => {
    let query = `
    DELETE FROM "todo"
    WHERE "id"=$1;
    `;
    let params=([req.params.id]);

    pool.query(query, params)    
    .then((dbRes) => {
        res.sendStatus(204);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
