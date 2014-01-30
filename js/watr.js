$(document).ready(function() {
    //recherce, injection des roles existants, et transformation de l'interface
    displayRoles();
    displayGroups();
    transformFlatUI();
    //remplacement des placeholders
    $("#role div button span.filter-option").text("Role");
    $("#group div button span.filter-option").text("Group");
    
    $("#search").keyup(function(){
       console.log($("#search").val());
        search($("#search").val());
    });
    
});

function displayRoles() {
    //pr�pare la requ�te solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    request['q'] = "*:*";
    request['facet'] = "true";
    request['facet.field'] = "role";
    request['rows'] = "0";

    //effectue la requ�te
    $.get(url, request, function(result, status, data) {
        //prend tous les r�les identifi�s par la facette
        $("lst[name=role] int", result).each(function(i, data) {
            //r�cup�re l'attribut name
            role = $(data).attr("name");
            //injection dans le select
            $("#role select").append("<option value='" + i + "'>" + role + "</option>");
        });
    });
}

function displayGroups() {
    //pr�pare la requ�te solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    request['q'] = "role:image";
    request['facet'] = "true";
    request['facet.field'] = "groupname";
    request['rows'] = "0";

    //effectue la requ�te
    $.get(url, request, function(result, status, data) {
        //prend tous les r�les identifi�s par la facette
        $("lst[name=groupname] int", result).each(function(i, data) {
            //r�cup�re l'attribut name
            group = $(data).attr("name");
            //injection dans le select
            $("#group select").append("<option value='" + i + "'>" + group + "</option>");
        });
    });
}



function transformFlatUI() {
//M�thode transformant les select en selects customs flat-UI
    $("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown'});
}

function search(query){
    //nettoyage de la liste des r�sultats
    $("#results").html("");
    //pr�pare la requ�te solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    request['q'] = query+"~";

    //effectue la requ�te
    $.get(url, request, function(result, status, data) {
        //prend tous les r�les identifi�s par la facette
        $("doc", result).each(function(i, data) {
            //r�cup�reation de l'id
            id = $("str[name=id]", data).text();
            //injection dans le select
            $("#results").append("<tr data-id='"+id+"'>"+"<td>"+ id +"</td>"+"</tr>");
            
        });
    });
}