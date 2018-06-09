import { booksConstants } from '../_constants';
import { booksService } from '../_services';
import { alertActions } from './';
import { userActions } from './';

export const booksActions = {
    getUserBooks,
    getBook,
    downloadBook,
    uploadBook,
    deleteBook,
    sendBook,
    clearCache,
    setArgs
};


// get list of all books that belongs to logged user
function getUserBooks(args) {
    return dispatch => {
        dispatch(request());

        return booksService.getUserBooks(args)
            .then(
                books => {
                    dispatch(success(books, args));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    
                }
            );
    };

    function request() { return { type: booksConstants.GET_BOOKS_REQUEST } }
    function success(books, args) { return { type: booksConstants.GET_BOOKS_SUCCESS, books, args } }
    function failure(error) { return { type: booksConstants.GET_BOOKS_FAILURE, error } }
}


// set arguments that will be used for all next queries
function setArgs(args) {
    return dispatch => {
        dispatch( set(args) );
    };

    function set(args) { return { type: booksConstants.SET_ARGS, args } }
}

// get details of single book
function getBook(bookId) {
    return dispatch => {
        dispatch(request());

        return booksService.getBook(bookId)
            .then(
                book => {
                    dispatch(success(book));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    
                }
            );
    };

    function request() { return { type: booksConstants.GET_BOOK_REQUEST } }
    function success(book) { return { type: booksConstants.GET_BOOK_SUCCESS, book } }
    function failure(error) { return { type: booksConstants.GET_BOOK_FAILURE, error } }
}

// delete single book
function deleteBook(bookId) {
    return dispatch => {
        dispatch(request());
        dispatch(alertActions.waiting("Deleting..."));

        return booksService.deleteBook(bookId)
            .then(
                book => {
                    dispatch(alertActions.success("Book deleted"));
                    dispatch(this.getUserBooks()); // refresh books list after deleting
                    dispatch(this.getBook(book.id)); // refresh book
                    dispatch(success(book));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                    
                }
            );
    };

    function request() { return { type: booksConstants.DELETE_REQUEST } }
    function success(book) { return { type: booksConstants.DELETE_SUCCESS, book } }
    function failure(error) { return { type: booksConstants.DELETE_FAILURE, error } }
}

//clearCache
function clearCache(key){
    console.log("ACTION usuwam kesz")
    return dispatch => {
        console.log(booksCache.get("books"));
        // dispatch({type: "DELETE_CACHE"});
        // return booksService.clearCache(key);
    }
}

// send book
function sendBook(bookId) {
    return dispatch => {
        dispatch(request());
        dispatch(alertActions.waiting("Sending..."));

        return booksService.sendBook(bookId)
            .then(
                response => {
                    dispatch(alertActions.success("Book has been sent"));
                    dispatch(success(response));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request() { return { type: booksConstants.SEND_BOOK_REQUEST } }
    function success(response) { return { type: booksConstants.SEND_BOOK_SUCCESS, response } }
    function failure(error) { return { type: booksConstants.SEND_BOOK_FAILURE, error } }
}


// download book with given ID
function downloadBook(book) {
    return dispatch => {
        dispatch(request());
        dispatch(alertActions.waiting("Downloading..."));

        return booksService.downloadBook(book.id)
            .then((book) => {
                showFile(book);
                dispatch(alertActions.success("Download started"));
            })
    };

    function request() { return { type: booksConstants.DOWNLOAD_BOOK_REQUEST } }
    function success() { return { type: booksConstants.DOWNLOAD_BOOK_SUCCESS, download: "Download started" } }
    function failure(error) { return { type: booksConstants.DOWNLOAD_BOOK_FAILURE, error } }

    
    function showFile(book){
        var link = document.createElement('a');
        link.href = book.url;
        link.download=book.url;
        link.click();

    }
}

function uploadBook(files) {
    return dispatch => {
        dispatch(request({ files }));
        dispatch(alertActions.waiting("Uploading..."));

        return booksService.uploadBook(files)
            .then(
                files => { 
                    dispatch(this.getUserBooks()); // refresh books list
                    dispatch(success(files));
                    dispatch(alertActions.success("Uploaded!"));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(files) { return { type: booksConstants.UPLOAD_REQUEST, files } }
    function success(files) { return { type: booksConstants.UPLOAD_SUCCESS, files } }
    function failure(error) { return { type: booksConstants.UPLOAD_FAILURE, error } }
}

