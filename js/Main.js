class MainExtremadura {
    constructor() {
        $(document).ready(function() {
            $("ul li:not(:first-child)").hide();
            function mostrarSiguiente() {
                $("ul li:visible").fadeOut(500, function() {
                    $(this).next().fadeIn(500);
                });
                if ($("ul li:visible").last().is(":last-child")) {
                    $("ul").first().children().first().fadeIn(500);
                }
            }
            setInterval(mostrarSiguiente, 3000);
        });
    }

    generateWeather(){
        var extremaduraMain = $('main').first();
        let weatherSection = document.createElement("section");
        let title = document.createElement("h2")
        title.innerHTML = 'El tiempo en directo de Mérida'
        weatherSection.appendChild(title)
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&lat=38.91611&lon=-6.34366&appid=d07a588b07c3e2e259fd41b46668f561',
            dataType: 'json',
            async: false,
            success: function (data) {
                weatherSection.appendChild(document.createTextNode(`Actualmente en Mérica hacen ${data['main']['temp']}ºC con un día ${data['weather'][0]['description']}`))
            }
        });
        extremaduraMain.append(weatherSection);
    }

    generateNews(){
        function loadData(callback){
            return $.ajax({
                url: 'https://gnews.io/api/v4/search?q="Mérida"&lang=es&country=es&max=10&apikey=3ecd3758bc5ea5c2ce04cb722641bf04',
                dataType: 'json',
                async: false,
                success: function (data) {
                    callback(data["articles"])
                }
            });
        }

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

    generateLastModified(){
        var extremaduraMain = $('main').first();
        let lastModifiedSection = document.createElement("section");
        let title = document.createElement("h2")
        title.innerHTML = 'Última modificación'
        let lastModified = document.createTextNode(document.lastModified)
        lastModifiedSection.appendChild(title)
        lastModifiedSection.appendChild(lastModified)
        extremaduraMain.append(lastModifiedSection);
    }


}

let main = new MainExtremadura()
main.generateWeather()
main.generateNews()
main.generateLastModified()