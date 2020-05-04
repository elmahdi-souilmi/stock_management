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
//our_product page
app.get('/our_product', (req, res)=>{
    var produit,rayon;
    db.query('SELECT fourniseur_ref FROM fourniseur', (err, result, fields) => {
        if (err) throw err;
        fourni = result;
    });
    var produit,rayon;
    db.query('SELECT code_rayon FROM rayon', (err, result, fields) => {
        if (err) throw err;
        rayon = result;
    });
    db.query('SELECT produit.* , rayon.type , fourniseur.nom FROM produit INNER JOIN rayon ON produit.code_rayon = rayon.code_rayon INNER JOIN fourniseur ON produit.fourniseur_ref = fourniseur.fourniseur_ref ', (err, result, fields) => {
        if (err) throw err;
        produit = result;
        res.render("our_product", {
            produit:produit,
            fourni:fourni,
            rayon:rayon
        }) 
        console.log(produit)
    });
}) 
// app.get('/our_product', (req, res)=>{
//     db.query('SELECT prodiseur.fourniseur_ref ', (err, result, fields) => {
//         if (err) throw err;
//         produit = result;
//         res.render("our_product", {
//             produit:produit,
//             fourni:fourni,
//             rayon:rayon
//         }) 
//     });
// }) 
app.post('/addproduit', (req, res) => {
    var newproduit = req.body;
    let sql = `INSERT INTO produit ( quantite, prix, fourniseur_ref, code_rayon, name) VALUES ("${newproduit.quantite}", "${newproduit.prix}", "${newproduit.fourniseur_ref}", "${newproduit.code_rayon}", "${newproduit.name}")` 
   db.query(sql,(err, result) => {
        if (err) throw err;
        res.redirect('/our_product')  

    }) 
});
app.get('/deleteproduit/:id', (req, res) => {
    let sql = `DELETE FROM produit  WHERE code_produit = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/our_product')
    })
}) 
app.post('/updateproduit/:id', (req, res) => {
    var newproduit = req.body;
    var id = req.params.id;
    let sql = `UPDATE produit SET quantite = "${newproduit.quantite}", prix = '${newproduit.prix}', name = '${newproduit.name}' WHERE code_produit = ${id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/our_product')
    })
})
//our_providers page
app.get('/our_providers', (req, res)=>{
    db.query(' SELECT * FROM fourniseur', (err, result, fields) => {
        if (err) throw err;
        fourniseur= result;
        res.render("our_providers", {
            fourniseur:fourniseur
        }) 
        console.log(fourniseur)
    });
}) 
app.post('/addprovider', (req, res) => {
    var newprovider = req.body;
    let sql = `INSERT INTO fourniseur set ?` 
   db.query(sql,newprovider,(err, result) => {
        if (err) throw err;
        res.redirect('/our_providers')  

    }) 
}) 
app.get('/deletefourniseur/:id', (req, res) => {
    let sql = `DELETE FROM fourniseur  WHERE fourniseur_ref = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/our_providers')
    })
}) 
app.post('/updateprovider/:id', (req, res) => {
    var newprovider = req.body;
    var id = req.params.id;
    let sql = `UPDATE fourniseur SET nom = "${newprovider.name}", email = '${newprovider.email}', n_telephone = '${newprovider.n_telephone}', adress = '${newprovider.adress}' WHERE fourniseur_ref = ${id}` ;
     db.query(sql,(err, result) => {
        if (err) throw err;
        res.redirect('/our_providers') 
         
    })
})
//our_shelves page
app.get('/our_shelves', (req, res)=>{
    db.query(' SELECT * FROM rayon', (err, result, fields) => {
        if (err) throw err;
        shelves= result;
        res.render("our_shelves", {
            shelves:shelves
        }) 
        console.log(shelves)
    });
}) 
app.post('/addshelve', (req, res) => {
    var newpshelve = req.body;
    let sql = `INSERT INTO rayon set ?` 
   db.query(sql,newpshelve,(err, result) => {
        if (err) throw err;
        res.redirect('/our_shelves')  

    })
 })
 app.get('/deleteshelves/:id', (req, res) => {
    let sql = `DELETE FROM rayon  WHERE code_rayon = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/our_shelves')
    })
}) 
app.post('/updateshelves/:id', (req, res) => {
    var newshelves = req.body;
    var id = req.params.id;
    let sql = `UPDATE rayon SET type = "${newshelves.type}", info_rayon = '${newshelves.info_rayon}' WHERE code_rayon = ${id}` ;
     db.query(sql,(err, result) => {
        if (err) throw err;
        res.redirect('/our_shelves') 
        
    })
})
app.listen(port, () => console.log(`it work in 2020!`))