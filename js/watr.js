$(document).ready(function() {
    //recherce, injection des roles existants, et transformation de l'interface
    displayRoles();
    displayGroups();
    transformFlatUI();
    //remplacement des placeholders
    $("#role div button span.filter-option").text("Role")
    $("#group div button span.filter-option").text("Group");
});

function displayRoles() {
    //prépare la requête solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    request['q'] = "*:*";
    request['facet'] = "true";
    request['facet.field'] = "role";
    request['rows'] = "0";

    //effectue la requête
    $.get(url, request, function(result, status, data) {
        //prend tous les rôles identifiés par la facette
        $("lst[name=role] int", result).each(function(i, data) {
            //récupère l'attribut name
            role = $(data).attr("name");
            //injection dans le select
            $("#role select").append("<option value='" + i + "'>" + role + "</option>");
        });
    });
}

function displayGroups() {
    //prépare la requête solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    request['q'] = "role:image";
    request['facet'] = "true";
    request['facet.field'] = "groupname";
    request['rows'] = "0";

    //effectue la requête
    $.get(url, request, function(result, status, data) {
        //prend tous les rôles identifiés par la facette
        $("lst[name=groupname] int", result).each(function(i, data) {
            //récupère l'attribut name
            group = $(data).attr("name");
            //injection dans le select
            $("#group select").append("<option value='" + i + "'>" + group + "</option>");
        });
    });
}



function transformFlatUI() {
//Méthode transformant les select en selects customs flat-UI
    $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown'});
}


/*
 * Fonction d'affichage des resultats reçu après une requète Solr 
 */
function displayResult(){
	
}


function search(query){
    //nettoyage de la liste des résultats
    $("#results").html("");
    //prépare la requête solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    request['q'] = query;

    //effectue la requête
    $.get(url, request, function(result, status, data) {
        //prend tous les rôles identifiés par la facette
        $("doc", result).each(function(i, data) {
            //récupèreation de l'id
            id = $("str[name=id]", data).text();
            //injection dans le select
            $("#results").append("<tr data-id='"+id+"'>"+"<td>"+ id +"</td>"+"</tr>");
            
        });
    });
}
