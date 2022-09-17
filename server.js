/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Jason Ting Hey Chu 
 * Student ID: 147985212 
 * Date: September 16, 2021
 * Cyclic Link: https://dull-sarong-dog.cyclic.app/
 *
 ***********************************************************************************/

 const express = require("express");
 const app = express();

 app.get("/", (req, res)=>{
    res.json({ msg: "API Listening" });
 });

 const cors = require("cors");
 app.use(cors());

 require("dotenv").config();

 app.use(express.json());

 const MoviesDB = require("./modules/moviesDB.js");
 const db = new MoviesDB();
 
 const HTTP_PORT = process.env.PORT || 8080;

 //body parser - ie. req.body
 app.use(express.urlencoded({ extended: false }));
 
 app.post("/api/movies", (req, res)=>{
    db.addNewMovie(req.body).then((data)=>{
        res.status(201).json(data);
    }).catch((err)=>{
       res.json({ message: err });
    });
 });
 
 app.get("/api/movies", (req, res)=>{
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.status(404).json({ message: err });
    });
 });
 
 app.get("/api/movies/:id", (req, res)=>{
    const id = req.params.id;
    db.getMovieById(id).then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        const msg = `Cannot find Movie id: ${id} in the database. ERROR: ${err}`;
        console.log(msg);
        res.status(204).json(msg);
    });
 });
 
 app.put("/api/movies/:id", (req, res)=>{
   const id = req.params.id;
    db.updateMovieById(req.body, id).then(()=>{
       res.send(`${req.body.title} updated.`);
    }).catch((err)=>{
       res.status(500).send(`Cannot update Movie. ERROR: ${err}`);
    });
 });
 
 app.delete("/api/movies/:id", (req, res)=>{
    const id = req.params.id;
    db.deleteMovieById(id).then(()=>{
       res.send(`Movie id: ${id} deleted`);
    }).catch((err)=>{
       res.status(204).send(`Cannot find Movie id: ${id} in the database. ERROR: ${err}`);
    });
 });
 
 db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
        app.listen(HTTP_PORT, ()=>{
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err)=>{
     console.log(err);
    });
