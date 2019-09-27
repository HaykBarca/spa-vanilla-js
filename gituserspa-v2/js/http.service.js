export let fetchedData;

export class HTTPservice {
    sendRequest(page, textVal, parentObj) { // Send request to github to fetch users
        const value = textVal;
        let url = `https://api.github.com/search/users?q=${value}&page=${page || 1}&per_page=20`;
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              fetchedData = JSON.parse(xhr.responseText);
              parentObj.renderList();
              parentObj.renderPagination(fetchedData, parentObj);
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xhr.send(null);
    }
}