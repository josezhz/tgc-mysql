const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')
require('dotenv').config()
const mysql2 = require('mysql2/promise')

const app = express()
app.set('view engine', 'hbs')
wax.on(hbs.handlebars)
wax.setLayoutPath('./views/layouts')

app.use(express.urlencoded({
    'extended': false
}))

async function main() {
    const connection = await mysql2.createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
    })

    app.get('/actors', async function (req, res) {
        let [actors] = await connection.execute("select * from actor")
        // equivalent to
        // const results = await connection.execute("select * from actor")
        // const actors = results[0]
        res.render('actors', {
            actors
        })
    })

    app.get('/search', async function (req, res) {
        let query = "select * from actor where 1"
        let bindings = []

        if (req.query.first_name) {
            query += ` and first_name like ?`
            bindings.push("%" + req.query.first_name + "%")
        }
        if (req.query.last_name) {
            query += ` and last_name like ?`
            bindings.push("%" + req.query.last_name + "%")
        }

        let [actors] = await connection.execute(query, bindings)
        res.render('search', {
            actors
        })
    })

    app.get('/actors/create', function (req, res) {
        res.render("create_actor")
    })

    app.post('/actors/create', async function (req, res) {
        const query = "insert into actor (first_name, last_name) values (?, ?)"
        const bindings = [req.body.first_name, req.body.last_name]
        await connection.execute(query, bindings)
        res.redirect('/actors')
    })

    app.get('/actors/update/:actor_id', async function (req, res) {
        const query = "select * from actor where actor_id = ?"
        const [actors] = await connection.execute(query, [req.params.actor_id])
        const actorToUpdate = actors[0]
        res.render('update_actor', {
            actor: actorToUpdate
        })
    })

    app.post('/actors/update/:actor_id', async function (req, res) {
        const query = "update actor set first_name = ?, last_name = ? where actor_id = ?"
        const bindings = [req.body.first_name, req.body.last_name, parseInt(req.params.actor_id)]
        await connection.execute(query, bindings)
        res.redirect('/actors')
    })

    app.post('/actors/delete/:actor_id', async function (req, res) {
        const query = "delete from actor where actor_id = ?"
        const bindings = [parseInt(req.params.actor_id)]
        await connection.execute(query, bindings)
        res.redirect('/actors')
    })
}
main()

app.listen(3000, function () {
    console.log("Server started")
})