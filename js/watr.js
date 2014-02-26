var filters="";

$(document).ready(function() {
    //recherce, injection des roles existants, et transformation de l'interface
    displayRoles();
    displayGroups();
    transformFlatUI();
    //remplacement des placeholders
    $("#role div button span.filter-option").text("Role");
    $("#group div button span.filter-option").text("Group");

    //mise ne place de l'écouteur du champ de recherche
    $("#search").keyup(function(){
        console.log(filters);
		sessionStorage.setItem("start", 0);
        search(sessionStorage.start);
    });
    
    //mise en place de l'ecouteur du select Roles
    $("#role").change(function(){filterChange();});
    $("#group").change(function(){filterChange();});
    
    //set des sessionStorage de pagination
    sessionStorage.setItem("rows", 30);
    sessionStorage.setItem("start", 0);
    
    //remplissage de la page de base avant keyup de requete
    search(0);    
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

function search(start){
    console.log("Methode search");
 
    //Set de la valeur de départ à 0 si elle n'est pas donnée et sinon la set à la valeur indiquée
    if(start === null){
		sessionStorage.setItem("start", 0);
	}else{
		sessionStorage.setItem("start", start);
	}
	
    //nettoyage de la liste des résultats
    $("#results").html("");
    
    //récupération de la query
    var query = $("#search").val();
    
    //sécurité pour ne pas faire de requête vide
    if (query.length === 0) {
        query = "*:*";
    }
    //ajout des filtres à la query
    query = query+filters;
    
    //prépare la requête solr
    var url = "http://localhost:8983/solr/select?indent=on&version=2.2";
    var request = {};

    console.log(filters.length);
    console.log(query);

    if(query==="*:*"&&filters.length===0){
        request['rows']=parseInt(sessionStorage.rows);
    } 
    
    request['rows']=parseInt(sessionStorage.rows);
    request['start']=parseInt(sessionStorage.start);
    request['q'] = query;
    
    //effectue la requête
    $.get(url, request, function(result, status, data) {
        
        //récupèration du nombre total de résultat 
        	numFound = $("result" ,result).attr("numFound");
			sessionStorage.setItem("numFound",numFound);
			console.log("Nb de résultats = "+sessionStorage.numFound);
        
        //prend tous les rôles identifiés par la facette
        $("doc", result).each(function(i, data) {
			
			//récupèration de l'id
            id = $("str[name=id]", data).text();

            //crée la liste à remplir d'attributs
            var liste = $("<ul>");
            //pour chaque noeud enfant du noeud courant sauf ID
            $("*[name!=id][name!=hobby][name!=language]", data).each(function(j, noeud){
                //on jaoute des infos dans la liste
                liste.append("<li>"+"<b>"+$(this).attr("name")+": "+"</b>"+$(this).text()+"</li>");
            });
            //création de la ligne ( avec dedans la liste créé précédemment)
            var ligne = ("<tr data-id='" + id+ "'>"+"<td>"+"<p>"+"<a class='bouton'>" + id +
                "</a>"+"</p>"+"<p>"+"</p>"+
                "<span class='detail' style='display:none'>"+liste.html()+"</span>"+"</td>"+"</tr>");
            //injection dans le select
            $("#results").append(ligne);
        });
        $(document).ready(function(){
            $(".bouton").click(function(){
                $(this).parent().nextAll('.detail').first().toggle('slow');
            });

        });
        pagination(start);
    });
}

function nextPage(){
	console.log("next Page");
	
	//Calcul du prochain start
	nextStart = parseInt(sessionStorage.start)+parseInt(sessionStorage.rows);
	console.log("nextStart supposée: "+nextStart);
	
	//Effectue la recherche au start suivant ou alert l'utilisateur qu'il se trouve déjà à la dernière page
	if(nextStart <= parseInt(sessionStorage.numFound)){
		sessionStorage.setItem("start", nextStart);
		console.log("start actuel= "+parseInt(sessionStorage.start));
		search(nextStart);	
	}else{
		alert("Ceci est la dernière page");
	}
}

function addNextPage(){
	$(".page:first-of-type").remove()
	$(".page:last-of-type").after("<li class=\"page active\" onclick=\"openSpecificPage("+(page+1)+");\"><a>"+(page+1)+"</a></li>");
}

function previousPage(){
	console.log("previous");
	
	//Calcul du start précédent
	previousStart = parseInt(sessionStorage.start)-parseInt(sessionStorage.rows);
	console.log("previousStart supposé: "+previousStart);
	
	//Effectue la recherche au start précédent ou alert l'utilisateur qu'il se trouve déjà à la première page
	if(previousStart >= 0){
		sessionStorage.setItem("start", previousStart);
		console.log("previousStart actuel= "+parseInt(sessionStorage.start));
		search(previousStart);
	}else{
		alert("Vous êtes déjà à la première page.");
	}
}

function removePreviousPage(){
	
}

function pagination(start){
	
	//calcul du nb total de page
	nbPage = Math.ceil(parseInt(sessionStorage.numFound)/parseInt(sessionStorage.rows));
	if(nbPage === 0){
		nbPage = 1;
	}
	console.log("nbPage = "+nbPage);
	
	//efface les page en trop lors d'une nouvelle requete
	$(".page").remove();
	
	//calcul de la page courante
	currentPage = (parseInt(sessionStorage.start)+parseInt(sessionStorage.rows))/parseInt(sessionStorage.rows);
	console.log("currentPage = "+currentPage);
	
	//Check et ajoute les pages en consequence
		for(var page=0;(page+1)<=nbPage;page++){
				if((page+1)===currentPage || nbPage === 1){
					$(".pagination .next").before("<li class=\"page active\" onclick=\"openSpecificPage("+(page+1)+");\"><a>"+(page+1)+"</a></li>");
				}else if(page >= 10){			
					break;
				}else{
					$(".pagination .next").before("<li class=\"page\" onclick=\"openSpecificPage("+(page+1)+");\"><a>"+(page+1)+"</a></li>");
				}
		}	
}


function openSpecificPage(page){
	console.log("openSpecificPage");
	
	//défini le start pour effectuer la recherche correspondante à la page	
	var start = (page-1)*parseInt(sessionStorage.rows);
	console.log("specificStart = "+start);

	//effectue la recherche avec le bon start
	search(start);	
}
