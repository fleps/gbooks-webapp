//First we declare our search function
function doSearch(searchTerm) {
    var apiURL = 'https://www.googleapis.com/books/v1/volumes?langRestrict=pt&maxResults=20&filter=ebooks&orderBy=relevance&q=' + searchTerm ;
    var searchResult = $('#searchResult');
    var myInput = $('.form-control');
    myInput.addClass('loading');//Simple UI loading element for user feedback

    // Ajjax request
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: apiURL,
        success: function (data) {
            myInput.removeClass('loading'); //clear the loadding if he exists
            if (data.totalItems == 0) { //let's check if the search have results, if not, print a message
                    searchResult.empty().append('<div class="searchInfo">Ops, infelizmente sua busca por <span>'+searchTerm+'</span> não obteve resultados! Tente fazer uma nova busca com outro termo =)</div>');
            } else {//ok we have results, lets do the magic and handle the response data 
                searchResult.empty().append('<div class="searchInfo">Sua busca por <span>'+searchTerm+'</span> retornou <span>'+data.items.length+'</span> livro(s):</div>'); // showing the search term and how many results to the user
                $.each(data.items, function (i, book) {//I like to save the data i'm using to variables so the append code below looks cleaner
                    myBooks = JSON.parse(localStorage.getItem('myBooks')) == null ? myBooks=[] : JSON.parse(localStorage.getItem('myBooks'));
                    var bookID = book.id;
                    if(bookID == myBooks.filter(function(item){return item === bookID})){ var hClass = 'fa-heart'} else {var hClass = 'fa-heart-o'}
                    var bookName = book.volumeInfo.title;
                    var bookImg = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.smallThumbnail : "" ;
                    var bookAuthor = book.volumeInfo.authors;
                    var bookSnippet = book.searchInfo ? book.searchInfo.textSnippet : "Descrição não disponível";
                    var bookPages = book.volumeInfo.pageCount ? book.volumeInfo.pageCount : "N/D";
                    var bookPrice = book.saleInfo.retailPrice ? book.saleInfo.retailPrice.amount.toString().replace('.', ',') : "N/D";
                    var bookPreviewLink = book.accessInfo.webReaderLink;
                    var theResult = '<div class="book">' +
                        '<div class="myFav">' +
                            '<a onclick="bookFav(\''+bookID+'\')"><i class="fa '+hClass+'" aria-hidden="true"></i></a>' + 
                        '</div>' +
                        '<div class="row no-gutters">' +
                            '<div class="col-3 col-md-2"><img class="img-fluid img-thumbnail" src="'+bookImg+'"></div>' +
                            '<div class="col">' +
                                '<h3>'+bookName+'</h3>' +
                                '<span class="text-muted">Por: '+bookAuthor+'</span><br>' +
                                '<p>'+bookSnippet+'</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row no-gutters text-center">' +
                            '<div class="col">' +
                                '<strong>R$ '+bookPrice+'</strong>' +
                            '</div>' +
                            '<div class="col">' +
                                'Páginas: '+bookPages+
                            '</div>' +
                            '<div class="col">' +
                                '<a href="#1" onclick="openPreview(\''+bookName+'\', \''+bookPreviewLink+'\')">Preview</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                    searchResult.append(theResult).fadeIn();//ok print the results to the user with a nice effect
                });
            }
        }, 
        error: function(jqHXR, textStatus, error){//if there is an error, log it and show a message to the user
            console.log(jqHXR);
            console.log(textStatus);
            console.log(error);
            myInput.removeClass('loading');
            searchResult.empty().append('<div class="alert alert-warning text-center" role="alert">Oh snap! Ocorreu algum erro ao requisitar dados ao Google. Tente novamente!</div>').fadeIn();
        }
    });
}

//And now we capture the input 'enter' event to call our search function
$('#searchTerm').keypress(function (e){
    if(e.which == 13 && $(this).val() !=""){
        doSearch($(this).val());
        $(this).blur();
    }
});

//Function to open the Preview Modal
function openPreview(name, url){
    console.log(name, url);
    var modal = '<div class="modal fade" id="bookPreview" tabindex="-1" role="dialog" aria-labelledby="bookPreviewLabel" aria-hidden="true">' +
    '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
            '<h5 class="modal-title" id="bookPreviewLabel">'+ name +'</h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
        '</div>' +
        '<div class="modal-body">' +
            '<iframe src="'+ url +'&output=embed" frameborder="0">' +
            '</iframe>' +
        '</div>' +
        '</div>' +
    '</div>' +
    '</div>';
    $('body').prepend(modal);
    $('#bookPreview').modal('show');
    $('#bookPreview').on('hidden.bs.modal', function(e){
        $('#bookPreview').remove();
    });
}

//Function to add/remove a book from favorites using localStorage
function bookFav(id){
    if(id != myBooks.filter(function(item){return item === id})){
        //if the book is not already on localStorage save it and change the fav icon/class
        myBooks.push(id);
        localStorage.setItem('myBooks', JSON.stringify(myBooks));
        $(event.target).removeClass('fa-heart-o').addClass('fa-heart');
    } else {
        //if the book IS already on localStorage then remove it and fhange the fav icon/class
        myBooks = myBooks.filter(function(e){return e !== id});
        localStorage.setItem('myBooks', JSON.stringify(myBooks));
        $(event.target).removeClass('fa-heart').addClass('fa-heart-o');
    }
    console.log(JSON.parse(localStorage.getItem('myBooks')));
}