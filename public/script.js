function test(prix, quantite,name, id){
    document.getElementById("prix").value =  prix;
    document.getElementById("name").value =  name;
    document.getElementById("quantite").value =  quantite;
     document.getElementById("form").action = "updatequote/"+id ;
}; 