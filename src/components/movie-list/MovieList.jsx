import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import './MovieList.scss';
import tmdbApi, { category } from '../../api/tmdbApi';
import MovieCard from '../movie-card/MovieCard';
MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

function MovieList(props) {
    SwiperCore.use([Autoplay]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
            let res = null;
            const params = {};

            if(props.type !== 'similar') {
                switch (props.category) {
                    case category.movie:
                        res = await tmdbApi.getMoviesList(props.type, {params});
                        break;
                
                    default:
                        res = await tmdbApi.getTvList(props.type, {params});
                        break;
                }
            } else {
                res = await tmdbApi.similar(props.category, props.id)
            }
            
            setItems(res.results);
        }

        getList();
    },[])
    return (
        <div className="movie-list">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
                autoplay={props.autoPlay ? {delay: 5000} : 0}
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            {/* <img src={apiConfig.w500Image(item.poster_path)} alt="movie"/> */}
                            <MovieCard item={item} category={props.category} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

export default MovieList;