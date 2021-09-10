const feed = document.getElementById('feed');
var allFeedList = [];
const fetchFeed = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
};

function showPosition(position) {
    const promises = [];
    const url = new URL('https://api.foursquare.com/v2/venues/search');
    const params = {
        client_id: 'UDWWBD5OW4QJQTUQ0GMMS0LMVEFAHYZSURNJFNS5JGBV0KOO',
        client_secret: '4CIZMCOBJVMBEO0TLL1UCGA3F5DEZSZMUO5I4QEGY445KHBH',
        ll: `${position.coords.latitude},${position.coords.longitude}`,
        radius: '1000',
        v: '20180323',
        limit: 21,
    }
    const filters = ['Italian', 'Chinese', 'Tacos', 'Subway', 'Indian', 'Sushi', 'Seafood', 'Restaurant', 'Coffee', 'Thai'];
    filters.map((item, index) => {
        const latest = {...params, query: item}
        url.search = new URLSearchParams(latest).toString();
        promises.push(fetch(url).then((res) => res.json()));
        return 0;
    });

    Promise.all(promises).then((results) => {
        const feed = results.map((result, index) => ({
            [filters[index]]: result.response.venues,
        }));
        allFeedList = feed;
    });
  }

const filterFeed = (feedType = '') => {
    document.getElementById('dropbtn').innerText = feedType ? `${capitalizeFLetter(feedType)}` : 'Select Type';
    if (feedType) {
        var filterList = allFeedList.filter((item) => {
            return item.hasOwnProperty(feedType);
        })
        const feedHTMLString = filterList[0][feedType].map((item, index) => `
            <li class="card">
            <a id="${item.id}" class="button" >
                <div>
                    <h2 class="card-title">${item.name}</h2>
                    <p class="card-subtitle">Address: ${item.location.formattedAddress[0]}, ${item.location.formattedAddress[1]}, ${item.location.formattedAddress[2]}</p>
                </div>
            </a>
            </li>`).join('');
        feed.innerHTML = feedHTMLString;
    } else {
    feed.innerHTML = '';
    }
};

function capitalizeFLetter(param) { 
  return param[0].toUpperCase() + param.slice(1); 
}

fetchFeed();