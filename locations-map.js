(function () {
  'use strict';

  var locations = [
    { id: 'bethel-park', name: 'Bethel Park', address: '5189 Library Road Bethel Park, PA 15102', phone: '(412) 887-6642', lat: 40.3338856, lng: -80.0228448, image: 'https://tendercarelc.org/wp-content/uploads/2023/09/bethel_park_front.jpg' },
    { id: 'cranberry', name: 'Cranberry', address: '102 Teddy Bear Lane Mars, PA 16046', phone: '(724) 702-3337', lat: 40.6721155, lng: -80.099145, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/Attachment-2-1024x768.jpg' },
    { id: 'green-tree', name: 'Green Tree', address: 'Foster Plaza III 601 Holiday Drive Pittsburgh, PA 15220', phone: '(412) 883-5547', lat: 40.4221191, lng: -80.0595094, image: 'https://tendercarelc.org/wp-content/uploads/2023/07/greentree_front-1024x768.jpg' },
    { id: 'hampton', name: 'Hampton', address: '2852 Oxford Boulevard Allison Park, PA 15101', phone: '(412) 900-7991', lat: 40.5914608, lng: -79.9503333, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG-6117-1-1024x768.jpeg' },
    { id: 'hermitage', name: 'Hermitage', address: '1475 N. Hermitage Road Hermitage, PA 16148', phone: '(724) 702-3889', lat: 41.2539478, lng: -80.4515408, image: 'https://tendercarelc.org/wp-content/uploads/2023/03/IMG_3175-e1679677128689.jpg' },
    { id: 'jefferson', name: 'Jefferson', address: '550 Coal Valley Road Clairton, PA 15025', phone: '(412) 203-9990', lat: 40.3180147, lng: -79.9042175, image: 'https://tendercarelc.org/wp-content/uploads/2023/07/jefferson_front-1024x768.jpg' },
    { id: 'lower-burrell', name: 'Lower Burrell', address: 'Town Hall Center 2400 Leechburg Road New Kensington, PA 15068', phone: '(724) 702-3373', lat: 40.586852, lng: -79.749212, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG_5549-1024x768.jpeg' },
    { id: 'mccandless', name: 'McCandless', address: '8413 Perry Highway Pittsburgh, PA 15237', phone: '(412) 361-9669', lat: 40.5546584, lng: -80.0386359, image: 'https://tendercarelc.org/wp-content/uploads/2026/02/IMG_5312-1024x768.jpeg' },
    { id: 'meadowlands', name: 'Meadowlands', address: '2000 Park Place Drive, Suite 201 Washington, PA 15301', phone: '(724) 221-9880', lat: 40.212574, lng: -80.1926092, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/meadowlands_exterior-1024x768.jpg' },
    { id: 'monroeville', name: 'Monroeville', address: '4420 Old Wm. Penn Highway Monroeville, PA 15146', phone: '(412) 379-6868', lat: 40.445719, lng: -79.764008, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG_5540-1024x768.jpeg' },
    { id: 'moon-township', name: 'Moon Township', address: '1005 Beaver Grade Road Coraopolis, PA 15108', phone: '(412) 903-3888', lat: 40.505482, lng: -80.2054789, image: 'https://tendercarelc.org/wp-content/uploads/2025/02/IMG_6682-1024x768.jpeg' },
    { id: 'mt-lebanon', name: 'Mt. Lebanon', address: '2220 Swallow Hill Road Pittsburgh, PA 15220', phone: '(412) 899-1313', lat: 40.391907, lng: -80.0760831, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/IMG_6714-1024x768.jpg' },
    { id: 'murrysville', name: 'Murrysville', address: '4490 Old William Penn Highway Murrysville, PA 15668', phone: '(724) 551-8009', lat: 40.4274861, lng: -79.6750506, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/murrysville_exterior-1-1024x768.jpg' },
    { id: 'new-castle', name: 'New Castle', address: '2002 Wilmington Road New Castle, PA 16105', phone: '(724) 670-3055', lat: 41.0126654, lng: -80.3506847, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/NEW-Front-of-Building-2-1024x768.jpg' },
    { id: 'pierpont', name: 'Pierpont', address: '600 Fort Pierpont Drive, Morgantown, WV 26508', phone: '(304) 249-9599', lat: 39.6485717, lng: -79.8915698, image: 'https://tendercarelc.org/wp-content/uploads/2023/10/DSC_0098-1024x768.jpg' },
    { id: 'robinson', name: 'Robinson', address: '200 Cedar Ridge Drive, Suite 213 Pittsburgh, PA 15205', phone: '(412) 435-4331', lat: 40.4477462, lng: -80.107548, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/IMG-4892-1024x768.jpg' },
    { id: 'ross-township', name: 'Ross Township', address: '4721 McKnight Road Suite 210 Pittsburgh, PA 15237', phone: '(412) 899-1314', lat: 40.4945482, lng: -80.0117899, image: 'https://tendercarelc.org/wp-content/uploads/2023/07/IMG_6399.jpg' },
    { id: 'shadyside', name: 'Shadyside', address: '5425 Baum Blvd Pittsburgh, PA 15232', phone: '(412) 226-4452', lat: 40.4569398, lng: -79.9382406, image: 'https://tendercarelc.org/wp-content/uploads/2026/05/Shadyside-pic-for-website.png' },
    { id: 'wexford', name: 'Wexford', address: '10 North Meadows Drive Wexford, PA 15090', phone: '(724) 952-3337', lat: 40.6123802, lng: -80.0544012, image: 'https://tendercarelc.org/wp-content/uploads/2023/08/Attachment-7-1024x768.jpg' },
    { id: 'whitehall', name: 'Whitehall', address: '300 Weyman Plaza, Suite 100 Pittsburgh, PA 15236', phone: '(412) 883-8898', lat: 40.3604077, lng: -79.9998433, image: 'https://tendercarelc.org/wp-content/uploads/2023/03/IMG_7205.jpg' }
  ];

  var finder = document.querySelector('[data-location-finder]');
  if (!finder) return;

  var results = finder.querySelector('[data-location-results]');
  var search = finder.querySelector('[data-location-search]');
  var clear = finder.querySelector('[data-location-clear]');
  var status = finder.querySelector('[data-location-status]');
  var previewImage = finder.querySelector('[data-location-image]');
  var previewName = finder.querySelector('[data-location-name]');
  var previewAddress = finder.querySelector('[data-location-address]');
  var previewPage = finder.querySelector('[data-location-page]');
  var previewDirections = finder.querySelector('[data-location-directions]');
  var map = null;
  var markerLayer = null;
  var markers = {};
  var activeId = locations[0].id;

  function directionsUrl(location) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location.address);
  }

  function markerIcon(isActive) {
    return window.L.divIcon({
      className: 'location-marker-wrap',
      html: '<span class="location-marker' + (isActive ? ' is-active' : '') + '"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span>',
      iconSize: [44, 52],
      iconAnchor: [22, 48]
    });
  }

  function setActive(location, moveMap) {
    activeId = location.id;
    previewImage.src = location.image;
    previewImage.alt = 'Tender Care ' + location.name;
    previewName.textContent = location.name;
    previewAddress.textContent = location.address + ' · ' + location.phone;
    previewPage.href = 'locations/' + location.id + '.html';
    previewDirections.href = directionsUrl(location);

    results.querySelectorAll('[data-location-id]').forEach(function (button) {
      var selected = button.dataset.locationId === location.id;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    Object.keys(markers).forEach(function (id) {
      markers[id].setIcon(markerIcon(id === location.id));
      markers[id].setZIndexOffset(id === location.id ? 1000 : 0);
    });

    if (map && moveMap) {
      if (markerLayer && markerLayer.zoomToShowLayer) {
        markerLayer.zoomToShowLayer(markers[location.id], function () {
          map.flyTo([location.lat, location.lng], 14, { duration: 0.65 });
        });
      } else {
        map.flyTo([location.lat, location.lng], 14, { duration: 0.65 });
      }
    }
  }

  function renderList(list) {
    results.innerHTML = '';
    list.forEach(function (location) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'location-result';
      button.dataset.locationId = location.id;
      button.setAttribute('aria-pressed', String(location.id === activeId));
      button.innerHTML = '<span><b>' + location.name + '</b><small>' + location.address + '</small></span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
      if (location.id === activeId) button.classList.add('is-active');
      button.addEventListener('click', function () { setActive(location, true); });
      results.appendChild(button);
    });
  }

  function filterLocations() {
    var query = search.value.trim().toLowerCase();
    var matches = locations.filter(function (location) {
      return (location.name + ' ' + location.address).toLowerCase().indexOf(query) !== -1;
    });
    clear.hidden = !query;
    status.textContent = query ? matches.length + (matches.length === 1 ? ' location found' : ' locations found') : 'Showing all 20 locations';
    renderList(matches);
    if (matches.length && query) setActive(matches[0], true);
  }

  renderList(locations);

  search.addEventListener('input', filterLocations);
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && search.value) {
      search.value = '';
      filterLocations();
    }
  });
  clear.addEventListener('click', function () {
    search.value = '';
    filterLocations();
    search.focus();
  });

  if (!window.L) {
    document.getElementById('locations-map').innerHTML = '<p class="location-map__fallback">The map could not load. Choose a center from the list to view its details.</p>';
    return;
  }

  map = window.L.map('locations-map', { scrollWheelZoom: false, zoomControl: true }).setView([40.55, -80.05], 8);
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var bounds = [];
  markerLayer = window.L.markerClusterGroup ? window.L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 44, spiderfyOnMaxZoom: true }) : window.L.layerGroup();
  locations.forEach(function (location) {
    var marker = window.L.marker([location.lat, location.lng], { icon: markerIcon(location.id === activeId), title: location.name });
    marker.on('click', function () {
      if (search.value) {
        search.value = '';
        clear.hidden = true;
        status.textContent = 'Showing all 20 locations';
        renderList(locations);
      }
      setActive(location, false);
    });
    markerLayer.addLayer(marker);
    markers[location.id] = marker;
    bounds.push([location.lat, location.lng]);
  });
  markerLayer.addTo(map);
  map.fitBounds(bounds, { padding: [34, 34] });
  setActive(locations[0], false);
})();
