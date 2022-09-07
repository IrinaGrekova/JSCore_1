const input = document.querySelector("input");
const inputContainer = document.querySelector(".searchForm-container");
const selected = document.querySelector(".selected");

selected.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) return;

    target.parentElement.remove();
});

inputContainer.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("searchForm-content")) {
        return;
    }
    addChosen(target);
    input.value = "";
    removePredictions();
});

function removePredictions() {
    inputContainer.innerHTML = "";
}

function showPredictions(repositories) {
    let dropdownPredictions = document.querySelectorAll(".searchForm-container");
    removePredictions();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
        let name = repositories.items[repositoryIndex].name;
        let owner = repositories.items[repositoryIndex].owner.login;
        let stars = repositories.items[repositoryIndex].stargazers_count;

        let searchContent = `<div class="searchForm-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
        inputContainer.innerHTML += searchContent;
    }
}

function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;

    selected.innerHTML += `<div class="select">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
}

async function getPredictions() {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesList = input.value;
    if (repositoriesList == "") {
        removePredictions();
        return;
    }

    urlSearchRepositories.searchParams.append("q", repositoriesList)
    try {
        let response = await fetch(urlSearchRepositories);
        if (response.ok) {
            let repositories = await response.json();
            showPredictions(repositories);
        }
        else return null;
    } catch(error) {
        return null;
    }
}

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(
                () => resolve(fn(...args)),
                timeout,
            );
        });
    };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
input.addEventListener("input", getPredictionsDebounce);