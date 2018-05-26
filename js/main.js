var map;
var infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow({
        map: map,
        maxWidth: 200
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                setMarkers(map);

                function setMarkers(map) {
                    var image = {
                        url: 'alfinete.png'
                    };
                    var shape = {
                        coords: [1, 1, 1, 20, 18, 20, 18, 1],
                        type: 'poly'
                    };
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: 'Você está aqui!!',
                        icon: image
                    });
                }

                map.setCenter(pos);
                infoWindow = new google.maps.InfoWindow({
                    maxWidth: 200
                });

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: pos,
                    radius: 4000,
                    type: ['gym'],
                    placeId: map.place_id
                }, callback);

                function callback(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }
                    }
                }

                function createMarker(place) {
                    var placeLoc = place.geometry.location;
                    var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        service.getDetails(place, function (details, status) {
                            if (status === google.maps.places.PlacesServiceStatus
                                .OK) {
                                infoWindow.setContent('<div><strong>' + details.name +
                                    '</strong><br><button type="button" class="btn btn-link btn-sm">More Info</button>'
                                );
                                // localStorage.setItem('nome', details.name);
                                // localStorage.setItem('endereco', details.formatted_address);
                                // localStorage.setItem('telefone', details.formatted_phone_number);
                                var btnInfo = document.querySelector("button.btn");
                                btnInfo.addEventListener('click', function (e) {
                                    var table = document.querySelector('table');
                                    table.innerHTML = '<tr><td><strong>Nome</strong></td> <td>' + details.name + '</td> </tr><tr><td><strong>Endereço</strong></td> <td>' + details.formatted_address + '</td> </tr><tr><td><strong>Telefone</strong></td> <td>' + details.formatted_phone_number + '</td></tr>' + details.opening_hours + '</td></tr>' + '<button type="button" class="btn btn-primary btn-sm add">Adicionar à Lista</button>';
                                    localStorage.setItem('id', details.place_id);
                                    add(document.querySelector(".add"));
                                });

                                // if (document.querySelector('body').innerHTML.indexOf('<button type="button" class="btn btn-primary btn-sm add">Adicionar à Lista</button>') != -1) {
                                   function add (e) {
                                    e.addEventListener('click', function (e) {
                                        if(localStorage.getItem('academias') != null) {
                                            if (localStorage.getItem('academias').indexOf(localStorage.getItem('id')) === -1) {
                                                Persistencia.adiciona(
                                                    'academias', {
                                                        id: details.place_id ,
                                                        nome:  details.name ,
                                                        endereco:  details.formatted_address ,
                                                        telefone:  details.formatted_phone_number 
                                                    });
                                                // document.querySelector('tr:nth-child(1)').textContent = localStorage.getItem('nome');
                                            } 
                                        }else {
                                            Persistencia.adiciona(
                                                'academias', {
                                                    id: details.place_id ,
                                                    nome:  details.name ,
                                                    endereco:  details.formatted_address ,
                                                    telefone:  details.formatted_phone_number 
                                                });
                                        }
                                    });
                                   }
                                // }
                            }
                        });
                        infoWindow.open(map, this);
                    });
                }
            },
            function () {
                handleLocationError(true, infoWindow, map.getCenter());
            }, {
                enableHighAccuracy: true,
                maximumAge: 20000,
                timeout: 20000
            });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}