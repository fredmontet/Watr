var filters="";

$(document).ready(function() {
    //recherce, injection des roles existants, et transformation de l'interface
    displayRoles();
    displayGroups();
    transformFlatUI();
    //remplacement des placeholders
    $("#role div button span.filter-option").text("Role");
    $("#group div button span.filter-option").text("Group");
    //remplissage de la page de base
    search();
    //mise ne place de l'écouteur du champ de recherche
    $("#search").keyup(function(){
        console.log(filters);
        search();
    });
    //mise en place de l'ecouteur du select Roles
    $("#role").change(function(){filterChange();});
    $("#group").change(function(){filterChange();});

});

function filterChange(){
    //reset filtres
    filters="";
    //-------------------- check des filtrs roles --------------------
    var selectedRoles = $("#role option:selected");
    //si une option est s�lectionn�e
    if(selectedRoles.size()>0){
        //si il n'y a QUE une option s�lectionn�e
        if(selectedRoles.size()===1){
            filters=filters+" AND role:"+$("#role option:selected").text();
        }
        //si il y a PLUSIEURS actions s�lectionn�es
        else{
            $("option:selected").each(function(i){
                if(i===0){
                    filters=filters+" AND (role:"+$(this).text();
                }
                else{
                    filters=filters+" OR role:"+$(this).text();
                }
            });
            filters=filters+")";
        }
    }
    console.log("CHECK LES FILTRES: "+filters);

    //-------------------- check des filtres groupe --------------------
    var selectedGroups = $("#group option:selected");
    //si une option est s�lectionn�e
    if(selectedGroups.size()>0){
        //si il n'y a QUE une option s�lectionn�e
        if(selectedGroups.size()===1){
            filters=filters+" AND groupname:"+$("#group option:selected").text();
        }
        //si il y a PLUSIEURS actions s�lectionn�es
        else{
            $("option:selected").each(function(i){
                if(i===0){
                    filters=filters+" AND (groupname:"+$(this).text();
                }
                else{
                    filters=filters+" OR groupname:"+$(this).text();
                }
            });
            filters=filters+")";
        }
    }
    search();
}

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

function search(){
    console.log("Methode search");
    //nettoyage de la liste des résultats
    $("#results").html("");
    //récupération de la query
    var query = $("#search").val();
    //sécurité pour ne pas faire de requête vide
    if (query.length === 0) {
        query = "*:*";
    }
    //ajout des filtres à la query
    query=query+filters;
    //prépare la requête solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};
    console.log(filters.length);
    console.log(query);
    if(query==="*:*"&&filters.length===0){
        request['rows']=0;
    }
    request['q'] = query;
    //effectue la requête
    $.get(url, request, function(result, status, data) {
        //prend tous les rôles identifiés par la facette
        $("doc", result).each(function(i, data) {
            //récupèreation de l'id
            id = $("str[name=id]", data).text();
            //r�cup�re l'ensemble des noeuds

            var ligne = ("<tr data-id='" + id+ "'>"+"<td>"+"<p>"+"<a class='bouton'>" + id +
                "</a>"+"</p>"+"<p>"+"</p>"+
                "<ul class='detail' style='display:none'>"+"</ul>"+"</td>"+"</tr>");



            $("*[name!=id]", result).each(function(j, noeud){

                $(".detail").append("<li>"+ "test" +"</li>");

            });
            console.log (ligne);
            //injection dans le select
            $("#results").append(ligne);
        });
        $(document).ready(function(){
            $(".bouton").click(function(){
                $(this).parent().nextAll('.detail').first().toggle('slow');
            });
        });
    });
}