class MeteorologiaExtremadura {
    constructor() {

    }

    generate7DaysWeather(){
        function loadData(callback){
            return $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es&lat=38.91611&lon=-6.34366&appid=d07a588b07c3e2e259fd41b46668f561',
                dataType: 'json',
                async: false,
                success: function (data) {
                    callback(data['list'])
                }
            });
        }
        var extremaduraMain = $('main').first();
        let weatherSection = document.createElement("section");
        let title = document.createElement("h2")
        title.innerHTML = 'El tiempo en directo de Mérida'
        weatherSection.appendChild(title)
        let forecasts = document.createElement("dl")

        loadData((articles)=> articles.map(a => {
            let forecastTitle = document.createElement("dt");
            let forecastContent = document.createElement("dd");
            console.log(a)
            forecastTitle.innerHTML = a['dt_txt']
            let textDescription = a['weather'][0]['description']
            let temp = a['main']['temp']
            forecastContent.innerHTML = `Va a haber ${temp}ºC y estará ${textDescription}`

            forecasts.appendChild(forecastTitle)
            forecasts.appendChild(forecastContent)
        }))
        weatherSection.appendChild(forecasts)
        extremaduraMain.append(weatherSection);
    }

    generateNews(){


        let extremaduraMain = $('main').first();
        let newsSection = document.createElement("section");
        let title = document.createElement("h2")
        title.innerHTML = 'Últimas noticias en Mérida'
        newsSection.appendChild(title)
        let articles = document.createElement("dl")
        loadData((articles)=> articles.map(a => {
            let articleTitle = document.createElement("dt");
            let articleContent = document.createElement("dd");
            articleTitle.innerHTML = a['title'] + " - " + (new Date(Date.parse(a['publishedAt']))).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
            articleContent.innerHTML = a['description']
            newsSection.appendChild(articleTitle)
            newsSection.appendChild(articleContent)
        }))
        newsSection.appendChild(articles)
        extremaduraMain.append(newsSection);
    }
}
let main = new MeteorologiaExtremadura()
main.generate7DaysWeather()

