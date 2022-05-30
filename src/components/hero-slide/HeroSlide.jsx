import React, { useEffect, useRef, useState } from 'react';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button, { OutlineButton } from '../button/Button'
import Modal, { ModalContent } from '../modal/Modal'
import tmdbApi, {category, movieType } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import './HeroSlide.scss';
import { useNavigate } from 'react-router-dom';
function HeroSlide(props) {
    SwiperCore.use([Autoplay]);
    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getMovies = async () => {
            const params = {page: 1}
            
            try {
                const reponse = await tmdbApi.getMoviesList(movieType.popular, {params});
                setMovieItems(reponse.results.slice(0,6));
            } catch {
                console.log('error');
            }
        }
        getMovies();
    }, [])
    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{delay: 5000}}
                speed={2000}
                loop={true}
            >
                {
                    movieItems.map((item, i) => (
                        <SwiperSlide key={i}>
                            {({ isActive }) => (
                                // <img src={apiConfig.originalImage(item.backdrop_path)} alt="slide"/>
                                <HeroSlideItem item={item} className={`${isActive ? 'active' : ''}`} />
                            )}
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            {
                movieItems.map((item, index) => <TrailerModal key={index} item={item} />)
            }
        </div>
    );
}

const HeroSlideItem = props => {
    const navigate = useNavigate();
    const item = props.item;
    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);

    const setModalActive = async () => {
        
        
        const modal = document.querySelector(`#modal_${item.id}`);
        const videos = await tmdbApi.getVideos(category.movie, item.id);

        if (videos.results.length > 0) {
            const videoSrc = 'https://www.youtube.com/embed/' + videos.results[0].key;
            
            modal.querySelector('.modal__content > iframe').setAttribute('src', videoSrc);
        } else {
            modal.querySelector('.modal__content').innerHTML = 'No trailer';
        }

        modal.classList.toggle('active');
    }

    return (
        <div 
            className={`hero-slide__item ${props.className}`}
            style={{backgroundImage: `url(${background})`}}
        >
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={() => navigate("/movie/" + item.id)}>
                            Watch now
                        </Button>
                        <OutlineButton onClick={setModalActive} >
                            Watch trailer
                        </OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt=""/>
                </div>
            </div>
        </div>
    )
}

const TrailerModal = props => {
    const item = props.item;
    const iframeRef = useRef(null);

    const onClose = () => iframeRef.current.setAttribute('src','');

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe src={iframeRef} width='100%' height="500px" title="trailer"></iframe>
            </ModalContent>
        </Modal>
    )
}
export default HeroSlide;