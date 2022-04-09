const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25716113-67bf4389395841c6d6521744f';


function fetchGallery (searchQuery, page) {
    return fetch(
        `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    ).then(response => {
            if (response.ok) {
                return response.json();
        }
        
            return Promise.reject(new Error(`Nothing found for your search ${searchQuery}`));
    });
}

const api = {fetchGallery};
export default api;