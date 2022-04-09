import { Component } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Error from './Error';
import Modal from './Modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import fetchGallery from '../services/imagesApi';
import api from 'services/imagesApi';

const status = {
  IDLE: 'idle',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

export default class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    images: [],
    error: null,
    status: status.IDLE,
    showModal: false,
    bigImage: '',
    totalHits: 1,
  };

  toggleModal = largeImageURL => {
    this.setState(({ showModal, bigImage }) => ({
      showModal: !showModal,
      bigImage: largeImageURL,
    }));
  };


  handelFormSubmit = searchQuery => {
    this.setState({
      searchQuery,
      page: 1,
    });
  };

  onLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    const prevImages = prevState.searchQuery;
    const nextImages = this.state.searchQuery;

    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevImages !== nextImages) {
      this.setState({
        status: status.PENDING, page: 1, images: [],
      });
      this.fetchGallery(nextImages, nextPage);
    }

    // Загружаем больше картинок
    if (prevPage !== nextPage && nextPage !== 1) {
      this.fetchGallery(nextImages, nextPage);
    }
  }

  fetchGallery(nextImages, nextPage) {
    api.fetchGallery(nextImages, nextPage)
      .then(data => {
        this.setState(prevState => {
          return {
            prevState, status: status.RESOLVED,
            images: [...prevState.images, ...data.hits],
            searchQuery: nextImages,
            totalHits: data.totalHits,
          };
        });
      })
      .catch(error => this.setState({ error, status: status.REJECTED }));
  }


  render() {
    const { images, bigImage, status, error } = this.state;

    if (status === 'idle') {
      return (
        <>
          <Searchbar onSubmit={this.handelFormSubmit} />
          <ToastContainer autoClose={4000} theme={'colored'} />
        </>);
    }

    if (status === 'pending') {
      return <Loader />
    }

    if (status === 'rejected') {
      return (
        <>
          <Error message={error.message} />
          <ToastContainer autoClose={4000} theme={'colored'} />
        </>)
    }

    if (status === 'resolved') {
      return (
        <div>
          <Searchbar onSubmit={this.handelFormSubmit} />
          <ImageGallery images={images} toggleModal={this.toggleModal} />
          {this.state.showModal && (<Modal image={bigImage} onClickModal={this.toggleModal} />)}
          {this.state.images.length !==this.state.totalHits && (<Button onClick={this.onLoadMore} />)}
          <ToastContainer autoClose={4000} theme={'colored'} />
        </div>
      );
    }
  }
};
