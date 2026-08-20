(function () {
    // Free vector tiles via OpenFreeMap (no API key, no usage limits) — light "positron" style.
    const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

    function pinEl(color) {
        const el = document.createElement('div');
        el.className = 'trad-pin';
        el.innerHTML = `<span class="trad-pin-dot" style="background:${color}"></span>`;
        return el;
    }

    function popupHTML(title, place, date) {
        return `<strong>${title}</strong><br><span style="color:#6b5a30">${place}</span>${date ? `<br><em style="font-size:0.85em">${date}</em>` : ''}`;
    }

    function initTradizioni() {
        const el = document.getElementById('tradizioni-map');
        if (!el || el.dataset.init === '1' || typeof maplibregl === 'undefined') return;
        el.dataset.init = '1';

        const events = [
            { type: 'event', name: 'Palio dei Somari', place: 'Torrita di Siena', date: 'Marzo — domenica vicina al 19 (San Giuseppe)', coords: [43.1683, 11.7747] },
            { type: 'event', name: 'Festa del Barbarossa', place: "San Quirico d'Orcia", date: 'Giugno — terzo fine settimana', coords: [43.0599, 11.6037] },
            { type: 'event', name: 'Maggiolata Lucignanese', place: 'Lucignano', date: 'Maggio — ultime due domeniche', coords: [43.2756, 11.7458] },
            { type: 'event', name: 'Carnevale di Foiano', place: 'Foiano della Chiana', date: 'Febbraio — quattro domeniche di carnevale', coords: [43.2533, 11.8147] },
            { type: 'food', name: 'Sagra della Bistecca', place: 'Cortona', date: 'Agosto', coords: [43.2748, 11.9876] },
            { type: 'food', name: 'Sagra dei Pici', place: 'Celle sul Rigo (Siena)', date: 'Maggio', coords: [42.8736, 11.8636] },
            { type: 'food', name: 'Benvenuto Brunello', place: 'Montalcino', date: 'Febbraio', coords: [43.0573, 11.4892] },
            { type: 'food', name: 'Anteprima Vino Nobile', place: 'Montepulciano', date: 'Febbraio', coords: [43.0941, 11.7806] },
            { type: 'food', name: 'Sagra della Porchetta', place: 'Monte San Savino', date: 'Settembre', coords: [43.3325, 11.7264] },
            { type: 'food', name: "Festa dell'Olio Nuovo", place: 'Crete Senesi', date: 'Novembre', coords: [43.1842, 11.5497] },
            { type: 'food', name: 'Sagra del Cinghiale', place: 'Suvereto (Maremma)', date: 'Dicembre', coords: [43.0789, 10.6786] },
            { type: 'food', name: 'Festa del Pesce', place: 'Lago Trasimeno', date: 'Giugno', coords: [43.1356, 12.1003] }
        ];

        const map = new maplibregl.Map({
            container: el,
            style: MAP_STYLE,
            center: [11.75, 43.15],
            zoom: 8.5,
            scrollZoom: false,
            attributionControl: true
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        const COLOR = { event: '#8B1A1A', food: '#C4A24E' };
        const bounds = new maplibregl.LngLatBounds();
        events.forEach(e => {
            const lngLat = [e.coords[1], e.coords[0]];
            new maplibregl.Marker({ element: pinEl(COLOR[e.type]), anchor: 'center' })
                .setLngLat(lngLat)
                .setPopup(new maplibregl.Popup({ offset: 14 }).setHTML(popupHTML(e.name, e.place, e.date)))
                .addTo(map);
            bounds.extend(lngLat);
        });
        map.on('load', () => map.fitBounds(bounds, { padding: 50, duration: 0 }));
    }

    function initArcheo() {
        const el = document.getElementById('archeo-map');
        if (!el || el.dataset.init === '1' || typeof maplibregl === 'undefined') return;
        el.dataset.init = '1';

        const LIVING = '#00BCD4';
        const DEAD   = '#FFD600';

        const sites = [
            { name: 'Chiusi',            place: 'Museo Etrusco · Labirinto di Porsenna',                         coords: [43.0167, 11.9483], color: LIVING },
            { name: 'Cortona',           place: 'Accademia Etrusca · MAEC',                                      coords: [43.2748, 11.9876], color: LIVING },
            { name: 'Chianciano Terme',  place: 'Museo Archeologico',                                            coords: [43.0594, 11.8253], color: LIVING },
            { name: 'Sarteano',          place: 'Tomba della Quadriga Infernale',                                 coords: [42.9908, 11.8689], color: LIVING },
            { name: 'Volterra',          place: 'Museo Guarnacci · Anfiteatro Romano',                            coords: [43.4011, 10.8606], color: LIVING },
            { name: 'Perugia',           place: 'Perugia Sotterranea · Museo Archeologico',                       coords: [43.1107, 12.3908], color: LIVING },
            { name: 'Orvieto',           place: 'Necropoli del Crocifisso del Tufo · Museo Faina',                coords: [42.7185, 12.1127], color: LIVING },
            { name: 'Arezzo',            place: 'Anfiteatro romano · Museo Archeologico · Chimera',               coords: [43.4633, 11.8797], color: LIVING },
            { name: 'Fiesole',           place: 'Area archeologica · Teatro romano · Tempio etrusco',             coords: [43.8064, 11.2936], color: LIVING },
            { name: 'Spoleto',           place: 'Teatro romano · Arco di Druso · Ponte delle Torri',              coords: [42.7314, 12.7375], color: LIVING },
            { name: 'Todi',              place: 'Cisterne romane · Tempio di Marte · Nicchioni',                  coords: [42.7819, 12.4067], color: LIVING },
            { name: 'Populonia',         place: 'Acropoli etrusca · Necropoli di San Cerbone',                    coords: [42.9892, 10.4908], color: DEAD },
            { name: 'Vetulonia',         place: 'Città etrusca · Necropoli · Mura dell\'Arce',                    coords: [42.8558, 11.0250], color: DEAD },
            { name: 'Vulci',             place: 'Parco archeologico · Necropoli · Ponte dell\'Abbadia',           coords: [42.4167, 11.6333], color: DEAD },
            { name: 'Tarquinia',         place: 'Necropoli dipinta · Museo Nazionale Etrusco',                    coords: [42.2500, 11.7500], color: DEAD },
            { name: 'Cerveteri',         place: 'Necropoli della Banditaccia · Museo Nazionale Cerite',           coords: [41.9992, 12.1006], color: DEAD },
            { name: 'Veio',              place: 'Santuario di Portonaccio · Apollo di Veii',                      coords: [42.0217, 12.4014], color: DEAD },
            { name: 'Roselle',           place: 'Città etrusco-romana · Anfiteatro · Mura ciclopiche',            coords: [42.7883, 11.1611], color: DEAD },
            { name: 'Cosa',              place: 'Colonia romana · Foro · Capitolium · Porto',                     coords: [42.4097, 11.2886], color: DEAD },
            { name: 'Sovana',            place: 'Vie cave · Necropoli etrusca · Tomba Ildebranda',                coords: [42.6597, 11.6439], color: DEAD },
            { name: 'Saturnia',          place: 'Mura etrusche · Porta Romana · Necropoli',                       coords: [42.6542, 11.5117], color: DEAD },
            { name: 'Carsulae',          place: 'Città romana morta · Foro · Arco di San Damiano · Basilica',     coords: [42.6308, 12.5558], color: DEAD }
        ];

        const map = new maplibregl.Map({
            container: el,
            style: MAP_STYLE,
            center: [11.7, 43.15],
            zoom: 7.5,
            scrollZoom: false,
            attributionControl: true
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        const bounds = new maplibregl.LngLatBounds();
        sites.forEach(function (s) {
            var lngLat = [s.coords[1], s.coords[0]];
            var dot = document.createElement('div');
            dot.className = 'trad-pin';
            dot.innerHTML = '<span class="trad-pin-dot" style="background:' + s.color + '"></span>';
            new maplibregl.Marker({ element: dot, anchor: 'center' })
                .setLngLat(lngLat)
                .setPopup(new maplibregl.Popup({ offset: 14 }).setHTML(popupHTML(s.name, s.place)))
                .addTo(map);
            bounds.extend(lngLat);
        });
        map.on('load', function () { map.fitBounds(bounds, { padding: 50, duration: 0 }); });
    }

    function init() { initTradizioni(); initArcheo(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
