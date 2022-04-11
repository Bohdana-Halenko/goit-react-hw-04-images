import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SearchBar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleNameChange = event => {
    setSearchQuery(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (searchQuery.trim() === '') {
      toast.info('Enter your request.');
    } else {
      onSubmit(searchQuery);
      setSearchQuery('');
    }
  };
    
    return (
        <header className='Searchbar'>
            <form
                className='SearchForm'
                onSubmit={handleSubmit}
            >
                <button type="submit" className='SearchForm-button'>
                </button>

                <input
                    className='SearchForm-input'
                    type="text"
                     value={searchQuery}
                    onChange={handleNameChange}
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                />
            </form>
            <ToastContainer autoClose={3000} theme={'colored'} />
        </header>
    );
};

export default SearchBar;