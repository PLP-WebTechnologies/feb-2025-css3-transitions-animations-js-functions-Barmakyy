// Sample gallery data
const galleryData = [
    { id: 1, title: "Mountain Sunrise", category: "nature", url: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 2, title: "City Skyline", category: "city", url: "https://images.pexels.com/photos/421927/pexels-photo-421927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { id: 3, title: "Ocean Waves", category: "nature", url: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 4, title: "Urban Street", category: "city", url: "https://images.pexels.com/photos/904289/pexels-photo-904289.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 5, title: "Forest Path", category: "nature", url: "https://images.pexels.com/photos/397096/pexels-photo-397096.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 6, title: "Metropolis", category: "city", url: "https://images.pexels.com/photos/3254729/pexels-photo-3254729.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 7, title: "Waterfall", category: "nature", url: "https://images.pexels.com/photos/2843402/pexels-photo-2843402.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 8, title: "Downtown", category: "city", url: "https://images.pexels.com/photos/137611/pexels-photo-137611.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

// DOM Elements
const galleryGrid = document.querySelector('.gallery-grid');
const themeBtns = document.querySelectorAll('.theme-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal-image');
const modalInfo = document.querySelector('.modal-info');
const closeModal = document.querySelector('.close-modal');

// Initialize gallery
function initGallery() {
    // Load saved theme
    const savedTheme = localStorage.getItem('galleryTheme') || 'light';
    document.body.classList.add(`${savedTheme}-theme`);
    document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`).classList.add('active');
    
    // Load favorites
    const favorites = JSON.parse(localStorage.getItem('galleryFavorites')) || [];
    
    // Render gallery
    renderGallery(galleryData);
    
    // Set up event listeners
    setupEventListeners();
}

// Render gallery items
function renderGallery(items) {
    galleryGrid.innerHTML = '';
    
    const favorites = JSON.parse(localStorage.getItem('galleryFavorites')) || [];
    
    items.forEach(item => {
        const isFavorite = favorites.includes(item.id);
        
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.category}`;
        galleryItem.dataset.id = item.id;
        
        galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" class="gallery-img">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}">
                <i class="fas fa-heart"></i>
            </button>
            <div class="gallery-info">
                <h3 class="gallery-title">${item.title}</h3>
                <span class="gallery-category">${item.category}</span>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Filter gallery items
function filterGallery(category) {
    const favorites = JSON.parse(localStorage.getItem('galleryFavorites')) || [];
    
    if (category === 'all') {
        renderGallery(galleryData);
    } else if (category === 'favorites') {
        const favoriteItems = galleryData.filter(item => favorites.includes(item.id));
        renderGallery(favoriteItems);
    } else {
        const filteredItems = galleryData.filter(item => item.category === category);
        renderGallery(filteredItems);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Theme switcher
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.dataset.theme;
            document.body.className = `${theme}-theme`;
            localStorage.setItem('galleryTheme', theme);
            
            // Add pulse animation to theme button
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 1500);
        });
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterGallery(filter);
        });
    });
    
    // Gallery item clicks
    galleryGrid.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        const favoriteBtn = e.target.closest('.favorite-btn');
        
        if (favoriteBtn) {
            e.preventDefault();
            toggleFavorite(galleryItem.dataset.id, favoriteBtn);
        } else if (galleryItem) {
            openModal(galleryItem.dataset.id);
        }
    });
    
    // Modal close
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
}

// Toggle favorite status
function toggleFavorite(id, btn) {
    const favorites = JSON.parse(localStorage.getItem('galleryFavorites')) || [];
    const itemId = parseInt(id);
    
    if (favorites.includes(itemId)) {
        // Remove from favorites
        const index = favorites.indexOf(itemId);
        favorites.splice(index, 1);
        btn.classList.remove('active');
    } else {
        // Add to favorites
        favorites.push(itemId);
        btn.classList.add('active');
    }
    
    localStorage.setItem('galleryFavorites', JSON.stringify(favorites));
    
    // Heart animation
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 1000);
}

// Open modal with enlarged image
function openModal(id) {
    const item = galleryData.find(item => item.id === parseInt(id));
    
    modalImage.src = item.url;
    modalImage.alt = item.title;
    modalInfo.innerHTML = `
        <h2>${item.title}</h2>
        <p>Category: ${item.category}</p>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModalHandler() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);