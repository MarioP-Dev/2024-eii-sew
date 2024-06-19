
class RutasLoader {
    constructor(xmlPath) {
        this.routes = []
        this.loadXmlFile(xmlPath, (r) => this.routes.push(r))
    }

    generateSection() {
        var rutasContainer = $('main').first();
        rutasContainer.empty();
        this.routes.map(r => {
            rutasContainer.append(r.generateSection());

        })
    }

    loadXmlFile(xmlPath, callback) {
        return $.ajax({
            url: xmlPath,
            dataType: 'xml',
            async: false,
            success: function (data) {
                 $(data).find('ruta').map((_, routeXml) => callback(new Ruta(routeXml)));
            }
        });

    }
}

class Ruta {
    constructor(routeXml) {
        this.nombre = $(routeXml).find('nombre').first().text();
        this.tipo = $(routeXml).find('tipo').text()
        this.transporte =  $(routeXml).find('transporte').text()
        this.hitos = $(routeXml).find('hitos');
        this.transporte = $(routeXml).find('transporte').text();
        this.fechaInicio = $(routeXml).find('fechaInicio').text();
        this.horaInicio = $(routeXml).find('horaInicio').text();
        this.duracion = $(routeXml).find('duracion').text();
        this.agencia = $(routeXml).find('agencia').text();
        this.descripcion = $(routeXml).find('descripcion').text();
        this.personasAdecuadas = $(routeXml).find('personasAdecuadas').text();
        this.lugarInicio = $(routeXml).find('lugarInicio').text();
        this.direccionInicio = $(routeXml).find('direccionInicio').text();
        this.longitudInicio = $(routeXml).find('coordenadasInicio').find('longitud').text();
        this.latitudInicio = $(routeXml).find('coordenadasInicio').find('latitud').text();
        this.altitudInicio = $(routeXml).find('coordenadasInicio').find('altitud').text();
        this.referencias = $(routeXml).find('referencias referencia').map(() => $(this).text()).get().join(', ');
        this.recomendacion = $(routeXml).find('recomendacion').text();
    }

    generateAltimetry() {
        const hitos = [];
        this.hitos.find('hito').each(function() {
            const nombre = $(this).find('nombre').text();
            const distancia = parseFloat($(this).find('distancia').text());
            const altitud = parseFloat($(this).find('coordenadasHito > altitud').text());
            hitos.push({ nombre, distancia, altitud });
        });
        if (hitos.length === 0) {
            console.error("No se encontraron hitos en los datos proporcionados.");
        }
        const width = 400;
        const height = 200;
        const padding = 70;
        const maxDistancia = Math.max(...hitos.map(hito => hito.distancia));
        const maxAltitud = Math.max(...hitos.map(hito => hito.altitud));
        const minAltitud = Math.min(...hitos.map(hito => hito.altitud));
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        const escalaX = (distance) => padding + (distance / maxDistancia) * (width - 2 * padding);
        const escalaY = (altitude) => height - padding - ((altitude - minAltitud) / (maxAltitud - minAltitud)) * (height - 2 * padding);
        const path = document.createElementNS(svgNS, "path");
        let d = `M ${escalaX(hitos[0].distancia)} ${escalaY(hitos[0].altitud)}`;
        for (let i = 1; i < hitos.length; i++) {
            d += ` L ${escalaX(hitos[i].distancia)} ${escalaY(hitos[i].altitud)}`;
        }
        path.setAttribute("d", d);
        path.setAttribute("stroke", "blue");
        path.setAttribute("stroke-width", 2);
        path.setAttribute("fill", "none");
        svg.appendChild(path);
        hitos.forEach(hito => {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", escalaX(hito.distancia));
            circle.setAttribute("cy", escalaY(hito.altitud));
            circle.setAttribute("r", 4);
            circle.setAttribute("fill", "red");
            svg.appendChild(circle);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", escalaX(hito.distancia));
            text.setAttribute("y", escalaY(hito.altitud) - 10);
            text.setAttribute("font-size", "12");
            text.setAttribute("text-anchor", "middle");
            text.textContent = hito.nombre;
            svg.appendChild(text);
        });
        const ejeX = document.createElementNS(svgNS, "line");
        ejeX.setAttribute("x1", padding);
        ejeX.setAttribute("y1", height - padding);
        ejeX.setAttribute("x2", width - padding);
        ejeX.setAttribute("y2", height - padding);
        ejeX.setAttribute("stroke", "black");
        svg.appendChild(ejeX);

        const ejeY = document.createElementNS(svgNS, "line");
        ejeY.setAttribute("x1", padding);
        ejeY.setAttribute("y1", padding);
        ejeY.setAttribute("x2", padding);
        ejeY.setAttribute("y2", height - padding);
        ejeY.setAttribute("stroke", "black");
        svg.appendChild(ejeY);
        const etiquetaX = document.createElementNS(svgNS, "text");
        etiquetaX.setAttribute("x", width / 2);
        etiquetaX.setAttribute("y", height - 10);
        etiquetaX.setAttribute("text-anchor", "middle");
        etiquetaX.textContent = "Distancia (km)";
        svg.appendChild(etiquetaX);

        const etiquetaY = document.createElementNS(svgNS, "text");
        etiquetaY.setAttribute("x", 20);
        etiquetaY.setAttribute("y", height / 2);
        etiquetaY.setAttribute("text-anchor", "middle");
        etiquetaY.setAttribute("transform", `rotate(-90, 20, ${height / 2})`);
        etiquetaY.textContent = "Altitud (m)";
        svg.appendChild(etiquetaY);
        const numDivisiones = 5;
        for (let i = 0; i <= numDivisiones; i++) {
            // Valores en el eje X
            const valorX = (i * maxDistancia) / numDivisiones;
            const x = escalaX(valorX);
            const textX = document.createElementNS(svgNS, "text");
            textX.setAttribute("x", x);
            textX.setAttribute("y", height - padding + 20);
            textX.setAttribute("font-size", "12");
            textX.setAttribute("text-anchor", "middle");
            textX.textContent = valorX.toFixed(1);
            svg.appendChild(textX);
            const valorY = minAltitud + (i * (maxAltitud - minAltitud)) / numDivisiones;
            const y = escalaY(valorY);
            const textY = document.createElementNS(svgNS, "text");
            textY.setAttribute("x", padding - 10);
            textY.setAttribute("y", y + 5);
            textY.setAttribute("font-size", "12");
            textY.setAttribute("text-anchor", "end");
            textY.textContent = valorY.toFixed(0);
            svg.appendChild(textY);
        }
        return svg;
    }


    generateKML() {
        let kmlString = `<?xml version="1.0" encoding="UTF-8"?>
                            <kml xmlns="http://www.opengis.net/kml/2.2">
                                <Document>
                                    <name>${this.nombre}.kml</name>
                                    <description>
                                        <![CDATA[
                                            <p><strong>Tipo:</strong> ${this.tipo}</p>
                                            <p><strong>Transporte:</strong> ${this.transporte}</p>
                                            <p><strong>Fecha de Inicio:</strong> ${this.fechaInicio}</p>
                                            <p><strong>Hora de Inicio:</strong> ${this.horaInicio}</p>
                                            <p><strong>Duración:</strong> ${this.duracion}</p>
                                            <p><strong>Agencia:</strong> ${this.agencia}</p>
                                            <p><strong>Descripción:</strong> ${this.descripcion}</p>
                                            <p><strong>Personas Adecuadas:</strong> ${this.personasAdecuadas}</p>
                                            <p><strong>Lugar de Inicio:</strong> ${this.lugarInicio}</p>
                                            <p><strong>Dirección de Inicio:</strong> ${this.direccionInicio}</p>
                                            <p><strong>Coordenadas de Inicio:</strong> Longitud ${this.longitudInicio}, Latitud ${this.latitudInicio}, Altitud ${this.altitudInicio}</p>
                                            <p><strong>Referencias:</strong> ${this.referencias}</p>
                                            <p><strong>Recomendación:</strong> ${this.recomendacion}</p>
                                        ]]>
                                    </description>
                                    
                                    <!-- Punto de inicio -->
                                    <Placemark>
                                        <name>Punto de inicio</name>
                                        <Point>
                                            <coordinates>${this.longitudInicio},${this.latitudInicio},${this.altitudInicio}</coordinates>
                                        </Point>
                                    </Placemark>
                                    
                                    <!-- Hitos -->
                                `
        this.hitos.find("hito").map((index, hito) => {
            let coords = $(hito).find('coordenadasHito')
            kmlString += `
                                    <Placemark>
                                        <name>Hito ${index + 1}</name>
                                        <Point>
                                            <coordinates>${coords.find("longitud").text()},${coords.find("latitud").text()},${coords.find("altitud").text()}</coordinates>
                                        </Point>
                                    </Placemark>
                                    `})
        kmlString += '</Document></kml>'

        return kmlString;
    }

    downloadKml(kmlData) {
        const blob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.nombre}.kml`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    generateDownloadKml(){
        const element = document.createElement("button");
        element.onclick = () => {
            let generatedKml = this.generateKML()
            this.downloadKml(generatedKml)
        }
        element.innerHTML = "Descargar KML"
        return element
    }

    parseKML(kmlString) {
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlString, "text/xml");
        const placemarks = kmlDoc.querySelectorAll("Placemark");
        const puntos = [];
        placemarks.forEach(placemark => {
            const name = placemark.querySelector("name").textContent.trim();
            const coordinates = placemark.querySelector("coordinates").textContent.trim();
            const [lng, lat, alt] = coordinates.split(",").map(coord => parseFloat(coord));
            puntos.push({ nombre: name, longitud: lng, latitud: lat, altitud: alt });
        });
        return puntos;
    }

    async initMap() {
        const { Map, Marker } = await google.maps.importLibrary("maps");
        let name = `map-${this.nombre}`
        name = name.replace(/\s+/g, '-').toLowerCase()
        let map_element = document.getElementById(name)
        
        const map = new Map(map_element, {
            center: { lat: 39.151884, lng: -5.925764 },
            zoom: 6,
            mapId: "SEW_MAP_ID"
        });
        const puntos = this.parseKML(this.generateKML());
        puntos.forEach(punto => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: { lat: punto.latitud, lng: punto.longitud },
            title: punto.nombre,
            });
        });
        const polyline = new google.maps.Polyline({
            path: puntos.map(punto => ({ lat: punto.latitud, lng: punto.longitud })),
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

// Agregar la polilínea al mapa
polyline.setMap(map);
    }

    generatePlanimetry(){
        let mapSection = document.createElement("div");
        let name = `map-${this.nombre}`
        name = name.replace(/\s+/g, '-').toLowerCase()
        mapSection.id = name
        return mapSection
    }

    generateSection() {
        let rutaSection = document.createElement("section");
        var rutaHtml = `
                            <h2>${this.nombre}</h2>
                            <table>
                                <tr><td>Tipo:</td><td>${this.tipo}</td></tr>
                                <tr><td>Transporte:</td><td>${this.transporte}</td></tr>
                                <tr><td>Fecha de Inicio:</td><td>${this.fechaInicio}</td></tr>
                                <tr><td>Hora de Inicio:</td><td>${this.horaInicio}</td></tr>
                                <tr><td>Duración:</td><td>${this.duracion}</td></tr>
                                <tr><td>Agencia:</td><td>${this.agencia}</td></tr>
                                <tr><td>Descripción:</td><td>${this.descripcion}</td></tr>
                                <tr><td>Personas Adecuadas:</td><td>${this.personasAdecuadas}</td></tr>
                                <tr><td>Lugar de Inicio:</td><td>${this.lugarInicio}</td></tr>
                                <tr><td>Dirección de Inicio:</td><td>${this.direccionInicio}</td></tr>
                                <tr><td>Coordenadas de Inicio:</td><td>Longitud ${this.longitudInicio}, Latitud ${this.latitudInicio}, Altitud ${this.altitudInicio}</td></tr>
                                <tr><td>Referencias:</td><td>${this.referencias}</td></tr>
                                <tr><td>Recomendación:</td><td>${this.recomendacion}</td></tr>
                        </table>
                        `;
        rutaSection.innerHTML = rutaHtml;
        rutaSection.append(this.generateAltimetry())
        rutaSection.append(this.generatePlanimetry())
        rutaSection.append(this.generateDownloadKml())
        return rutaSection;
    }
}

let loader = new RutasLoader('xml/rutas.xml')
loader.generateSection();
window.addEventListener("load", async (event) => {
    await loader.routes.forEach(async (r) => await r.initMap())
});
