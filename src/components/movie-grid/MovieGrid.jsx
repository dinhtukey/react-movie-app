import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import tmdbApi, { category, movieType, tvType } from '../../api/tmdbApi';
import Button, { OutlineButton } from '../button/Button';
import MovieCard from '../movie-card/MovieCard';
import Input from "../input/Input";
import "./MovieGrid.scss"
function MovieGrid(props) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const { keyword } = useParams();
    

    useEffect(() => {
        const getList = async () => {
            let res = null;
            if (keyword === undefined) {
                const params = {};
                switch (props.category) {
                    case category.movie:
                        res = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                        break;
                
                    default:
                        res = await tmdbApi.getTvList(tvType.popular, {params});
                        break;
                }
            } else {
                const params = {
                    query: keyword
                }

                res = await tmdbApi.search(props.category, {params});
            }
            setItems(res.results);
            setTotalPage(res.total_pages);
        }

        getList();
    }, [props.category, keyword])

    const handleLoadmore = async () => {
        let res = null;
        if (keyword === undefined) {
            const params = {
                page: page + 1
            };
            switch (props.category) {
                case category.movie:
                    res = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                    break;
            
                default:
                    res = await tmdbApi.getTvList(tvType.popular, {params});
                    break;
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword
            }

            res = await tmdbApi.search(props.category, {params});
        }
        setItems([...items, ...res.results]);
        setPage(page + 1)
    }
    return (
        <>
            {/* <div className="movie-search-container section mb-3">
                <MovieSearch category={props.category} keyword={keyword} />
            </div> */}
            <div className="movie-grid">
                {
                    items.map((item,index) => (
                        (item.poster_path || item.backdrop_path) ? <MovieCard category={props.category} item={item} key={index}/> : null
                    ))
                }
            </div>
            {
                page < totalPage ? (
                    <div className="movie-grid__loadmore">
                        <OutlineButton className="small" onClick={handleLoadmore}>Load more</OutlineButton>
                    </div>
                ) : null
            }
        </>
    );
}

const MovieSearch = props => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '')

    const goToSearch = useCallback(
        () => {
            if(keyword.trim().length > 0) {
                navigate(`/${category[props.category]}/search/${keyword}`);
                
            }
        }
    ,[keyword, props.category, navigate])

    useEffect(() => {
        const eventEnter = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch();
            }
        }
        document.addEventListener("keyup", eventEnter);

        return () => {
            document.removeEventListener("keyup", eventEnter)
        }
    },[keyword, goToSearch])
    return (
        <div className="movie-search">
            <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button className="small" onClick={goToSearch}>Search</Button>
        </div>
    )
}

export default MovieGrid;