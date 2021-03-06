import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom"
import {get as getRatingPropositionService} from "../../services/RatingPropositionService"
import {count as countRatingService} from "../../services/RatingServices"
import MovieCard from "../UI/MovieCard"
import Button from "../UI/Form/Button"
import {useSelector} from "react-redux"
import store from "../../store/reducer";
import {BeatLoader} from "react-spinners";

function BatchMovieRating(props) {
    let history = useHistory();
    const [loadingFinished, setLoadingFinished] = useState(false)
    const [propositions, setPropositions] = useState([])
    const ratingCount = useSelector(state => state.ratingCount)

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/"});
        } else {
            getRatingPropositionService().then(res => {
                setPropositions(res.data.propositions)
                countRatingService().then(res => {
                    store.dispatch({type: 'SET_RATING_COUNT', payload: res.data.rating_count})
                    setLoadingFinished(true)
                })
            })
        }
    }, [history]);


    return (
        <div className="h-screen-minus-navbar pb-14 sm:pb-20 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <h1 className="text-3xl font-extrabold text-gray-900 pt-5 sm:mb-3">Let's rate some movies!</h1>
                    <div className="relative pt-1 mb-4">
                        <h2 className="text-md mb-2">We need you to rate at least 20 movies in order to
                            generate accurate recommendations.</h2>

                        <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-pink-200">
                                <div style={{width: `${ratingCount / 20 * 100}%`}}
                                     className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"/>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-1 text-sm">{ratingCount}/20</p>

                    </div>
                    <div className="flex flex-wrap">
                        {propositions.map((proposition, propositionIndex) => {
                            return (
                                <>
                                    <h2 className="font-extrabold text-gray-900 text-2xl">{proposition.name}</h2>
                                    <div
                                        className="grid w-full 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2"
                                        key={propositionIndex}>
                                        {proposition.movies.map((movie, index) => {
                                            return (
                                                <MovieCard title={movie.title ?? movie.name}
                                                           voteAverage={movie.vote_average}
                                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                                           key={index}
                                                           movieId={movie.id}
                                                           showRatingComponent={true}
                                                           hideRatings={true}
                                                           disableLink={true}
                                                />
                                            )
                                        })}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                    <div className="fixed bottom-16 sm:bottom-20 z-10 left-14">
                        <Button label={'Go to Dashboard'} customClass={''} customColor={'bg-pink-500 hover:bg-pink-600'} widthAuto={true} to={'/dashboard'}/>
                    </div>
                </>) :
                <div className="w-full text-center pt-16">
                    <BeatLoader size={30} color={'#3830a3'}/>
                </div>}
        </div>
    )
}

export default BatchMovieRating
