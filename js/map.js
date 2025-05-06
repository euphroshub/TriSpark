// Initialize the map
document.addEventListener('DOMContentLoaded', function() {
    // Coordinates for Saint-Mathieu-du-Parc
    const lat = 46.644268221231066;
    const lng = -72.96212318717028;
    
    // Create the map
    const map = L.map('map', {
        zoomControl: false, // We'll add custom controls
        scrollWheelZoom: false, // Disable scroll zoom
        dragging: true,
        doubleClickZoom: true,
        boxZoom: true,
        touchZoom: true
    }).setView([lat, lng], 15);

    // Add OpenStreetMap tiles with a custom style
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 10
    }).addTo(map);

    // Create a custom icon
    const customIcon = L.icon({
        iconUrl: '/assets/icons/map-marker.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Add a marker with popup
    const marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
    
    // Add popup with address
    marker.bindPopup(`
        <div class="map-popup">
            <strong>VMM - Parc Récréo</strong><br>
            2001 Chemin St François<br>
            Saint-Mathieu-du-Parc, QC G0X 1N0
        </div>
    `).openPopup();

    // Add custom zoom controls
    L.control.zoom({
        position: 'bottomleft',
        zoomInText: '+',
        zoomOutText: '-'
    }).addTo(map);
}); 