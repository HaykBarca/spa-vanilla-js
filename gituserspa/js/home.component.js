(function(global) {
    // Starting with IIFE for safe code and passing 1 argument, the global object,
    // and turning into strict mode for not creating global variables accidentally
    "use strict";
    
    // HomeComp is a function that returns new object.init with same properties
    const HomeComp = function(selector) {
        return new HomeComp.init(selector);
    };
    
    // Variables with safe values that couldn't be mutate from outside of IIFE
    const body = '<div id="container"><div class="header"><input type="text" class="search-value"><button id="search-button">Search</button>' + 
        '</div><div class="body"><div class="list"></div><div class="pagination"></div></div></div>';

    let fetchedData;
    
    // The methods that is saved in prototype for saving the memory space, each new
    // object will inherit this methods and will not copy this
    HomeComp.prototype = {
        validate: function() { // Simple selector validation
            const element = document.getElementById(this.selector);
            if (!element) {
                throw 'Wrong selector: Selector must be elements ID';
            }
            return this;
        },
        render: function() { // Constructs the page and assigns listeners
            const self = this;
            const element = document.getElementById(this.selector);
            element.innerHTML = body;
            document.getElementById('search-button').addEventListener("click", function() {
                const inputVal = document.getElementsByClassName('search-value')[0].value;
                global.sessionStorage.setItem('inputVal', inputVal);
                global.sessionStorage.setItem('currentPage', 1);
                self.sendRequest.call(self, undefined, inputVal);
            });
            //For pressing enter on input field
            document.getElementsByClassName('search-value')[0].onkeypress = function(e){
                if (!e) e = window.event;
                const keyCode = e.keyCode || e.which;
                if (keyCode == '13'){
                    const inputVal = document.getElementsByClassName('search-value')[0].value;
                    global.sessionStorage.setItem('inputVal', inputVal);
                    global.sessionStorage.setItem('currentPage', 1);
                    self.sendRequest.call(self, undefined, inputVal);
                }
            }

            //Checks if we have active search
            const inputVal = global.sessionStorage.getItem('inputVal');
            const currentPage = global.sessionStorage.getItem('currentPage');
            if (inputVal) {
                self.sendRequest.call(self, currentPage, inputVal);
            }
        },
        sendRequest: function(page, textVal) { // Send request to github to fetch users
            const self = this;
            const value = textVal;
            let url = `https://api.github.com/search/users?q=${value}&page=${page || 1}&per_page=20`;
            console.log(url);
            const xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.onload = function (e) {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  fetchedData = JSON.parse(xhr.responseText);
                  self.renderList();
                  self.renderPagination();
                } else {
                  console.error(xhr.statusText);
                }
              }
            };
            xhr.onerror = function (e) {
              console.error(xhr.statusText);
            };
            xhr.send(null);
        },
        renderList: function() { //constructs the list with fetched data
            const listCont = document.getElementsByClassName('list')[0];
            listCont.innerHTML = "";
            fetchedData.items.map(item => {
                const nodeCont = document.createElement("DIV");
                const dataStructure = `<img src="${item.avatar_url}" alt="avatar"><div class="info">Login: ${item.login}</div>`;
                nodeCont.innerHTML = dataStructure;
                listCont.appendChild(nodeCont);
            });
        },
        renderPagination: function() {
            const self = this;
            const count = Math.ceil(fetchedData.total_count / 20);
            let textVal;

            //Checking for inputs
            if (document.getElementsByClassName('search-value')[0].value !== '') {
                textVal = document.getElementsByClassName('search-value')[0].value
            } else {
                textVal = global.sessionStorage.getItem('inputVal');
            }
            
            //Fetching current page info from local storage
            let currentPage = parseInt(global.sessionStorage.getItem('currentPage') || 1);

            const paginationCont = document.getElementsByClassName('pagination')[0];
            const buttonLeft = document.createElement("DIV");
            const buttonLeftText = document.createTextNode("Prev");
            const buttonRight = document.createElement("DIV");
            const buttonRighText = document.createTextNode("Next");

            buttonLeft.appendChild(buttonLeftText);

            //Checking current page for adding active class
            if (currentPage !== 1) {
                buttonLeft.className = 'active';
            } else {
                buttonLeft.className = '';
            }

            buttonLeft.addEventListener('click', function() {
                if (currentPage !== 1) {
                    currentPage -= 1;
                    global.sessionStorage.setItem('currentPage', currentPage);
                    textVal ? self.sendRequest(currentPage, textVal) : false;
                }
            });

            buttonRight.appendChild(buttonRighText);

            //Checking current page for adding active class
            if (currentPage !== count) {
                buttonRight.className = 'active';
            } else {
                buttonRight.className = '';
            }

            buttonRight.addEventListener('click', function() {
                if (currentPage !== count) {
                    currentPage += 1;
                    global.sessionStorage.setItem('currentPage', currentPage);
                    textVal ? self.sendRequest(currentPage, textVal) : false;
                }
            });

            paginationCont.innerHTML = ""; //Removing pagination buttons

            paginationCont.appendChild(buttonLeft);
            paginationCont.appendChild(buttonRight);
        }
    };
    
    // HomeComp.init is a function constructor therefor we are assigning its arguments to its
    // object and setting default values
    HomeComp.init = function(selector) {
        const self = this;
        self.selector = selector;
        this.validate();
    };
    
    // Setting the same prototype for both
    HomeComp.init.prototype = HomeComp.prototype;
    
    // Assigning HomeComp to global object
    global.HomeComp = global.H$ = HomeComp;
    
})(typeof(window) !== 'undefined' ? window : this);
    