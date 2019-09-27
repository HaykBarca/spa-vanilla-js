export class Pagination {
    renderPagination(fetchedData, parentObj) {
        const count = Math.ceil(fetchedData.total_count / 20);
        let textVal;

        //Checking for inputs
        if (document.getElementsByClassName('search-value')[0].value !== '') {
            textVal = document.getElementsByClassName('search-value')[0].value
        } else {
            textVal = window.sessionStorage.getItem('inputVal');
        }
        
        //Fetching current page info from local storage
        let currentPage = parseInt(window.sessionStorage.getItem('currentPage') || 1);

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
                window.sessionStorage.setItem('currentPage', currentPage);
                textVal ? parentObj.sendRequest(currentPage, textVal) : false;
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
                window.sessionStorage.setItem('currentPage', currentPage);
                textVal ? parentObj.sendRequest(currentPage, textVal) : false;
            }
        });

        paginationCont.innerHTML = ""; //Removing pagination buttons

        paginationCont.appendChild(buttonLeft);
        paginationCont.appendChild(buttonRight);
    }
}