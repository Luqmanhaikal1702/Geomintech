// Ambil tarikh dan masa
function updateTime() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString();
  document.getElementById('time').textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);

// Geolocation
navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude.toFixed(5);
  const lon = pos.coords.longitude.toFixed(5);
  document.getElementById('coords').textContent = `${lat}, ${lon}`;

  // Guna reverse geocoding
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('location').textContent = data.display_name;
    });

  // Paparkan peta
  const map = L.map('map').setView([lat, lon], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([lat, lon]).addTo(map);
});

// Kompas (Heading)
window.addEventListener('deviceorientationabsolute', (event) => {
  let heading = event.alpha;
  if (typeof heading === 'number') {
    document.getElementById('heading').textContent = heading.toFixed(0);
    document.getElementById('compass-img').style.transform = `rotate(${heading}deg)`;
  }
}, true);

// Strike & Dip Angle – (Dummy, akan diganti dengan logik sebenar)
document.getElementById('strike').textContent = '45';  // Contoh
document.getElementById('dip').textContent = '25';     // Contoh

// Ambil gambar
const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

document.getElementById('capture').addEventListener('click', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Cetak teks data dalam gambar
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Masa: " + document.getElementById('time').textContent, 10, 30);
  ctx.fillText("Tarikh: " + document.getElementById('date').textContent, 10, 60);
  ctx.fillText("Lokasi: " + document.getElementById('location').textContent, 10, 90);
  ctx.fillText("Koordinat: " + document.getElementById('coords').textContent, 10, 120);
  ctx.fillText("Strike: " + document.getElementById('strike').textContent + "°", 10, 150);
  ctx.fillText("Dip: " + document.getElementById('dip').textContent + "°", 10, 180);
  ctx.fillText("Kompas: " + document.getElementById('heading').textContent + "°", 10, 210);

  // Simpan atau preview
  const link = document.createElement('a');
  link.download = 'geomintech_capture.png';
  link.href = canvas.toDataURL();
  link.click();
});
