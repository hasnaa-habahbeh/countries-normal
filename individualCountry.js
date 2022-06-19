/**
 * GETs the chosen country data
 * It gets the chosen country name from the local storage
 */
async function newCountry() {
    let mode = localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    let name = localStorage.getItem('country');
    let data;
    try {
        let response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
        if(response.status === 404) {
            response = await fetch(`https://restcountries.com/v3.1/alpha/${name}`);
        }
        data = await response.json();
    } catch (error) {
        console.log('an error has occurred', error);
        data = [];
    } finally {
        showData(data);
    }
}

/**
 * Renderers the data of the chosen country
 * @param {array} data
 */
function showData(data) {
    let country = data[0];
    document.title = country.name.common;
    let languages = [];
    for (language in country.languages) {
        languages.push(language);
    }
    languages = languages.join(', ');
    let currencies = [];
    for (currency in country.currencies) {
        currencies.push(currency);
    }
    currencies = currencies.join(', ');
    let borderCountries = '';
    country.borders ? country.borders.forEach(borderCountry => {
        borderCountries += `<button class='border-country-button' onclick='openCountry("${borderCountry}")'>${borderCountry}</button> &nbsp;`
    }) : borderCountries = 'unregistered';
    let nativeName = country.name.nativeName[Object.keys(country.name.nativeName)[0]].official;
    let html = `<img class='country-flag' src='${country.flags.png}' alt='${country.name.official}'s flag'
    width='50%' />
    <div class='info'>
    <div class='info-container'>
    <div class='country-info1'>
    <h1 class='country-name'>${country.name.common}</h1>
    <p class='country-native-name'><span class='category'>Native Name:</span> ${nativeName}</p>
    <p class='country-population'><span class='category'>Population:</span>
    ${country.population.toLocaleString('en-US')}</p>
    <p class='country-region'><span class='category'>Region:</span> ${country.region}</p>
    <p class='country-sub-region'><span class='category'>Sub Region:</span> ${country.subregion}</p>
    <p class='country-capital'><span class='category'>Capital:</span> ${country.capital}</p>
    </div>
    <div class='country-info2'>
    <p class='country-region'><span class='category'>Top Level Domain:</span> ${country.tld}</p>
    <div class='country-capital'><span class='category'>Currencies:</span> ${currencies}</div>
    <div class='country-capital'><span class='category'>Languages:</span> ${languages}</div>
    </div>
    </div>
    <div class='border-countries-container'>
    <p class='category'>Border Countries:</p>
    <div class='border-countries-buttons'>${borderCountries}</div>
    </div>
    </div> `;
    document.getElementById("individualCountry").insertAdjacentHTML('afterbegin', html);
}

/**
 * opens a new page of the chosen border country
 * @param {string} countryCode
 */
function openCountry(countryCode) {
    localStorage.setItem('country', countryCode);
    location.href = './individualCountry.html';
}

newCountry();
