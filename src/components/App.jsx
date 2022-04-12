import { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import fetchGallery from '../services/imagesApi';
import api from 'services/imagesApi';


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [page, setPage] = useState(1);
  const [visibleButton, setVisibleButton] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    setLoading(true);
    setVisibleButton(false);

    api.fetchGallery(searchQuery, page)
      .then(newImages => {
        if (newImages.total === 0) {
          setVisibleButton(false);
          toast.warn('Nothing was found on your request');
        }
        if (newImages) {
          setImages([...images, ...newImages.hits]);
        }
        if (page > 1) {
          window.scrollTo({
            top: document.body.clientHeight,
            behavior: 'smooth',
          });
        }

        if (newImages.total - page * 12 < 12) {
          setVisibleButton(false);
        } else {
          setVisibleButton(true);
        }
      })
      .catch(error => toast.error('Oops, something went wrong'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const getLargeImageForModal = data => {
    toggleModal();
    setLargeImg(data);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleFormSubmit = data => {
    setSearchQuery(data);
    setImages([]);
    setPage(1);
    setVisibleButton(true);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };


  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      {images.length !== 0 && (
        <ImageGallery images={images} toggleModal={toggleModal} modalImageLoad={getLargeImageForModal}/>
      )} 
      {loading && <Loader />}      
      {visibleButton && <Button onClick={handleLoadMore} />}
      {showModal && <Modal onClickModal={toggleModal} image={largeImg} />}
      <ToastContainer autoClose={3000} theme={'colored'} />
    </>
  )
};

export default App;

