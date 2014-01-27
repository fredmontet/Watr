$(document).ready(
        
    );







function displayDocument(document) {
  $('#documents').append('<li><a href="http://comem.trucmu.ch/mrm/medias/' + document.groupname + '/' + document.role + '/' + document.filename + '">' + document.id + '</a></li>');
}

function displayDocuments() {
  var url = "http://localhost:8983/solr/select";
  var request = {};
  request['q'] = "role:audio role:video role:text role:image";
  request['sort'] = "id asc";
  request['rows'] = "200";
  request['wt'] = "json";
  $.getJSON(url, request, function(result, status, data) {
    var documents = result.response.docs;
    for ( var i = 0; i < documents.length; i++) {
      displayDocument(documents[i]);
    }
  });
}

//Méthode transformant les select en selects customs flat-UI
$("select").selectpicker({style: 'btn-hg btn-primary', menuStyle: 'dropdown'});

//remplacement des placeholders
$("#role div button span.filter-option").text("Role");
$("#group div button span.filter-option").text("Group");