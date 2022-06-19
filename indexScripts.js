let select = 'closed';

/**
 * renders an array of countries to the page
 * @param {Array} countriesList
 */
function showCountries(countriesList) {
    document.getElementById('countries').innerHTML = '';
    let html = countriesList.map(country =>
        `<div class='country-div' onclick='openCountry("${country.name.official}")'>
        <img class='country-flag' src='${country.flags.png}' alt='${country.name.official}/'s flag' width='100%'/>
        <h2 class='country-name'>${country.name.common}</h2>
        <p class='country-population'><span class='category'>Population:</span> ${country.population.toLocaleString('en-US')}</p>
        <p class='country-region'><span class='category'>Region:</span> ${country.region}</p>
        <p class='country-capital'><span class='category'>Capital:</span> ${country.capital}</p>
        </div>`
    ).join('');
    document.getElementById('countries').insertAdjacentHTML('afterbegin', html);
}

/**
 * GETs all the countries from the API and calls showCountries() to render them
 * note: the function is called each time the page is rendered, therefore, it checks the
 * stored mode value from the localStorage
 */
async function showAll() {
    let mode = localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    let data;
    try {
        let response = await fetch('https://restcountries.com/v3.1/all');
        data = await response.json();
    } catch (error) {
        console.log('an error has occurred', error);
        data = [];
    }
    finally {
        showCountries(data);
        console.log('all length is', data.length);
    }
}

/**
 * filters the countries by the selected region
 * closes the select dropdown when a region is chosen
 * @param {object} event
 */
async function filterByRegion(event) {
    let data;
    let region = event.target.innerText;
    try {
        let response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        data = await response.json();
    } catch (error) {
        console.log('an error has occurred', error);
        data = [];
    }
    finally {
        showCountries(data);
        document.getElementById('selected-option').innerHTML = region;
        document.getElementById('dropdown-list').style = 'visibility: hidden;';
    }
}

/**
 * filters the countries by the input provided by the user
 * if the input was correct, it will send a GET request to the API
 * if the input was empty (case of clearing the search box), it will call showAll()
 * @param {string} name
 */
async function filterByName(name) {
    name = name.toLowerCase();
    if (name === '') {
        showAll();
        return;
    }
    let data;
    try {
        let response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
        data = await response.json();
    } catch (error) {
        console.log('an error has occurred', error);
        data = [];
    } finally {
        if (data.status === 404) {
            document.getElementById('countries').innerHTML = "";
            let html = '<div class="not-found-div"><p class="not-found-paragraph">not found</p></div>';
            document.getElementById('countries').insertAdjacentHTML('afterbegin', html);
        }
        showCountries(data);
    }
}

/**
 * stores the chosen country in the local storage and opens the html page to render it
 * @param {string} name
 */
function openCountry(name) {
    localStorage.setItem('country', name);
    location.href = './individualCountry.html';
}

/**
 * opens/closes the select dropdown
 */
function openSelect() {
    select = select === 'closed' ? 'opened' : 'closed';
    if (select === 'opened') document.getElementById('dropdown-list').style = 'visibility: visible;'
    else document.getElementById('dropdown-list').style = 'visibility: hidden;';
}

// hide the dropdown when clicking anywhere on the screen:
document.addEventListener('mouseup', function (e) {
    let dropdown = document.getElementById('dropdown');
    if (!dropdown.contains(e.target)) document.getElementById('dropdown-list').style = 'visibility: hidden;';
});

showAll();
