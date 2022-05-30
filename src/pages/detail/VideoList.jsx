import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import tmdbApi from '../../api/tmdbApi';

function VideoList(props) {
    const {category} = useParams();
    const [videos, setvideos] = useState([]);

    useEffect(() => {
        const getCredits = async () => {
            const res = await tmdbApi.getVideos(category, props.id);
            
            setvideos(res.results.slice(0, 5));
        }

        getCredits();
    }, [category, props.id])
    return (
        <>
            {
                videos.map((item, index) => (
                    <Video key={index} item={item} />
                ))
            }
        </>
    );
}

const Video = props => {
    const { item } = props;
    const iframeRef = useRef(null);

    useEffect(() => {
        const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
        iframeRef.current.setAttribute('height', height);
    }, [])
    return (
        <div className="video">
            <div className="video__title">
                <h2>{item.name}</h2>
            </div>
            <iframe 
                src={`https://www.youtube.com/embed/${item.key}`}
                ref={iframeRef}
                width="100%"
                title="video"
            ></iframe>
        </div>
    )
}
export default VideoList;