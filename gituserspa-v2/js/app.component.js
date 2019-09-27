import { fetchedData, HTTPservice } from './http.service.js';
import { Pagination } from './paginaton.component.js';

export { AppComp };


class AppComp extends Pagination {
    constructor(selector) {
        super();
        const self = this;
        self.selector = selector;
        self.validate();
    }

    validate() { // Simple selector validation
        const element = document.getElementById(this.selector);
        if (!element) {
            throw 'Wrong selector: Selector must be elements ID';
        }
        return this;
    }

    render() { // Constructs the page and assigns listeners
        const self = this;
        const element = document.getElementById(self.selector);
        const body = '<div id="spa-container"><div class="header"><input type="text" class="search-value"><button id="search-button">Search</button>' + 
        '</div><div class="body"><div class="list"></div><div class="pagination"></div></div></div>';

        element.innerHTML = body; //Constructing body

        //Event listeners
        document.getElementById('search-button').addEventListener("click", function() {
            const inputVal = document.getElementsByClassName('search-value')[0].value;
            window.sessionStorage.setItem('inputVal', inputVal);
            window.sessionStorage.setItem('currentPage', 1);

            //Sending request and binding it to this object
            self.sendRequest.call(self, undefined, inputVal);
        });

        //For pressing enter on input field
        document.getElementsByClassName('search-value')[0].onkeypress = function(e) {
            if (!e) e = window.event;
            const keyCode = e.keyCode || e.which;

            if (keyCode == '13'){ 
                const inputVal = document.getElementsByClassName('search-value')[0].value;
                window.sessionStorage.setItem('inputVal', inputVal);
                window.sessionStorage.setItem('currentPage', 1);
                self.sendRequest.call(self, undefined, inputVal);
            }
        }

        //Checks if we have active search
        const inputVal = window.sessionStorage.getItem('inputVal');
        const currentPage = window.sessionStorage.getItem('currentPage');
        if (inputVal) {
            self.sendRequest.call(self, currentPage, inputVal);
        }
    }

    sendRequest(page, textVal) {
        const service = new HTTPservice();
        service.sendRequest(page, textVal, this);
    }

    renderList() { //constructs the list with fetched data
        const listCont = document.getElementsByClassName('list')[0];
        listCont.innerHTML = "";
        fetchedData.items.map(item => {
            const nodeCont = document.createElement("DIV");
            const dataStructure = `<img src="${item.avatar_url}" alt="avatar"><div class="info">Login: ${item.login}</div>`;
            nodeCont.innerHTML = dataStructure;
            listCont.appendChild(nodeCont);
        });
    }
}
