function test(prix, quantite,name, id){
    document.getElementById("prix").value =  prix;
    document.getElementById("name").value =  name;
    document.getElementById("quantite").value =  quantite;
     document.getElementById("form").action = "updateproduit/"+id ;
}; 
 function test1(nom, email,n_telephone, adress,id){
    document.getElementById("nom").value =  nom;
    document.getElementById("email").value =  email;
    document.getElementById("n_telephone").value = n_telephone;
    document.getElementById("adress").value =  adress;
     document.getElementById("form").action = "updateprovider/"+id ;
}; 
function test2(info, type, id){
    document.getElementById("info").value =  info;
    document.getElementById("type").value =  type;
     document.getElementById("form").action = "updateshelves/"+id ;
};