 // This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () { 
    const btnSearch = /** @type {HTMLElement} */ (document.getElementById('search'));  
    btnSearch.addEventListener('click', function(e) {
        e.target.innerText = "Hello my people"; 
    });
})();