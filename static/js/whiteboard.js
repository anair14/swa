// Initialize the Fabric.js canvas
const canvas = new fabric.Canvas('whiteboard', {
  backgroundColor: '#ffffff',
  width: window.innerWidth * 0.8,
  height: window.innerHeight * 0.8,
});

// Default pen color
let penColor = '#000000';

// Enable free drawing mode and set initial properties
canvas.isDrawingMode = true; // Enable drawing mode
canvas.freeDrawingBrush.color = penColor; // Set initial pen color
canvas.freeDrawingBrush.width = 5; // Set initial pen width (brush size)

console.log("Canvas initialized and drawing mode enabled");

// Update pen color when the user selects a new color
const colorPicker = document.getElementById('pen-color');
colorPicker.addEventListener('input', (event) => {
  penColor = event.target.value;
  canvas.freeDrawingBrush.color = penColor;
  console.log(`Pen color changed to ${penColor}`);
});

// Connect to the WebSocket server
const socket = io();

// Broadcast drawing events to the server when mouse actions occur
canvas.on('path:created', (event) => {
  console.log("Path created on canvas");
  const data = canvas.toJSON();
  socket.emit('draw', data); // Emit drawing data to the server
});

// Listen for drawing data from the server and update the canvas
socket.on('broadcast_draw', (data) => {
  console.log("Received drawing data from server");
  canvas.loadFromJSON(data);
});

// Clear the canvas
document.getElementById('clear').addEventListener('click', () => {
  console.log("Canvas cleared");
  canvas.clear().setBackgroundColor('#ffffff');
  socket.emit('draw', canvas.toJSON());
});

// Save the canvas as an image
document.getElementById('save').addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'whiteboard.png';
  link.click();
  console.log("Canvas saved as an image");
});

// Adjust canvas size dynamically on window resize
window.addEventListener('resize', () => {
  canvas.setWidth(window.innerWidth * 0.8);
  canvas.setHeight(window.innerHeight * 0.8);
  canvas.renderAll(); // Redraw the canvas
  console.log("Canvas resized");
});

