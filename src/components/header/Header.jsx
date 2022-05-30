import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';

import './Header.scss';
import Input from "../input/Input";

import logo from '../../assets/tmovie.png'
import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import { OutlineButton } from '../button/Button';
import OutsideClick from "../ClickOutSide";

const headerNav = [
    {
        display: 'Home',
        path: '/'
    },
    {
        display:'Movies',
        path: '/movie'
    },
    {
        display:'TV series',
        path:'/tv'
    }
]
function Header() {
    const { pathname } = useLocation();
    const headerRef = useRef(null);
    const active = headerNav.findIndex(item => item.path === pathname);
    const [keyword, setKeyword] = useState('');
    const [visible, setVisible] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink');
            } else {
                headerRef.current.classList.remove('shrink');
            }
        }

        window.addEventListener('scroll', shrinkHeader);
        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        }
    }, [])

    useEffect(() => {
        const eventEnter = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                debounceDropDown(e.target.value);
            }
        }
        document.addEventListener("keyup", eventEnter);

        return () => {
            document.removeEventListener("keyup", eventEnter)
        }
    },[keyword])

    const openDropdown = (e) => {
        // setVisible(true);
        debounceDropDown(e.target.value);
    }

    const fetchDropdownOptions = async (key) => {
        let res = null;
        
        const params = {
            query: key
        }

        res = await tmdbApi.search("abc", {params});
        
        setDropdownOptions(res.results);
        setTotalPage(res.total_pages);
        setVisible(true);
    }

    const handleLoadmore = async () => {
        let res = null;
        
            const params = {
                page: page + 1,
                query: keyword
            }

        res = await tmdbApi.search("abc", {params});
        setDropdownOptions([...dropdownOptions, ...res.results]);
        setPage(page + 1)
    }

    const debounceDropDown = useCallback(_.debounce((nextValue) => fetchDropdownOptions(nextValue), 1000), [])

    const handleSearch = (e) => {
        e.preventDefault();
        
        setKeyword(e.target.value);
        debounceDropDown(e.target.value);
    }
    return (
        <div ref={headerRef} className="header">
            <div className="header__wrap container">
                <div className="logo">
                    <img src={logo} alt="logo"/>
                    <Link to="/">Movie</Link>
                </div>
                <ul className="header__nav">
                    {
                        headerNav.map((item, index) => (
                        <li key={index} className={`${index === active ? 'active' : ''}`}>
                            <Link to={item.path}>
                            {item.display}
                            </Link>
                        </li>
                        ))
                    }
                </ul>
                <div className="header__search">
                    <Input
                        type="text"
                        placeholder="Enter keyword"
                        value={keyword}
                        onChange={handleSearch}
                        onClick={openDropdown}
                    />
                    <OutsideClick onClickOutside={() => {setVisible(false)}}>
                        <div style={{display: visible ? 'grid' : 'none'}} className="header__search__dropdown">
                            {
                                visible && dropdownOptions.length > 0 ?
                                dropdownOptions.map((item, index) => (
                                        <Link to={'/' + item.media_type + '/' + item.id} className="header__search__dropdown__item" key={index}>
                                            <div className="card movie-card" style={{backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path || item.profile_path)})`}}>
                                            </div>
                                            <h3>{item.title || item.name}</h3>
                                        </Link>
                                )) : 
                                (
                                    <div className="header__search__dropdown__item">
                                        No result
                                    </div>
                                )
                            }
                            {
                                page < totalPage ? (
                                    <div className="header__search__dropdown__item movie-grid__loadmore">
                                        <OutlineButton style={{color: '#ff0000'}} className="small" onClick={handleLoadmore}>Load more</OutlineButton>
                                    </div>
                                ) : null
                            }
                        </div>
                    </OutsideClick>
                </div>
            </div>
        </div>
    );
}

export default Header;