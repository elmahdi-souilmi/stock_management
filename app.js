const express = require('express');
const ejs = require('ejs');
const app = express();
const fs = require('fs');
const port = 2020; 
const mysql = require('mysql');
 // CREATE connection
 const db = mysql.createConnection({
    host: 'localhost',
    user: 'souilmi',
    password: 'ELMAHDI',
    database: 'shopstore'
});
// CONNECT
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('MYSQL connected.....')
});
// make you read the body req
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
//to read file from the pubic folder
app.use(express.static("public"));
//to not use .ejs everytime
app.set("view engine", "ejs");
//router
//home page 
app.get('/home', (req, res) => {
    var stockval,n_produit,top_produit,n_rayon,n_fourni,less_produit;
     db.query('SELECT SUM(prix) as stockval FROM produit ', (err, result, fields) => {
        if (err) throw err;
        stockval= result;
    });
    db.query('SELECT COUNT(*) as n_produit FROM produit', (err, result, fields) => {
        if (err) throw err;
        n_produit = result;
    });
    db.query('SELECT COUNT(*) as n_rayon FROM rayon', (err, result, fields) => {
        if (err) throw err;
        n_rayon = result;
    });
    db.query('SELECT COUNT(*) as n_fourni FROM fourniseur', (err, result, fields) => {
        if (err) throw err;
        n_fourni = result;
    });
    db.query('SELECT name,quantite FROM produit ORDER BY quantite ASC LIMIT 1', (err, result, fields) => {
        if (err) throw err;
        less_produit = result;
    });
    db.query('SELECT name,quantite FROM produit ORDER BY quantite DESC LIMIT 3', (err, result, fields) => {
        if (err) throw err;
        top_produit = result;
        res.render("home", {
            n_produit: n_produit,
            stockval: stockval,
            top_produit: top_produit,
            n_rayon:n_rayon,
            n_fourni:n_fourni,
            less_produit:less_produit
        })  
    });
});
app.get('/our_product', (req, res)=>{
    var produit;
    db.query('SELECT produit.* , rayon.type , fourniseur.nom FROM produit INNER JOIN rayon ON produit.code_rayon = rayon.code_rayon INNER JOIN fourniseur ON produit.fourniseur_ref = fourniseur.fourniseur_ref ', (err, result, fields) => {
        if (err) throw err;
        produit = result;
        res.render("our_product", {
            produit:produit
            
        }) 
         console.log(produit)
    });
    
})

app.listen(port, () => console.log(`it work in 2020!`))