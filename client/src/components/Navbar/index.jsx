import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from 'react';
import {search as searchMovieService} from "../../services/MovieServices";

function Navbar() {
    let dispatch = useDispatch()
    let history = useHistory()
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        return history.listen((location) => {
            setSearchResults([])
            document.getElementById('movie_search').value = '';
        })
    }, [history])

    const logout = () => {
        dispatch({type: 'LOGOUT'})
        localStorage.setItem('token', null)
        history.push('/')
    }

    const movieSearch = (query) => {
        if (query.length > 0) {
            searchMovieService({query: query}).then(res => {
                setSearchResults(res.data.results)
            })
        } else {
            setSearchResults([])
        }
    }

    const hideSearchResults = () => {
        setTimeout(() => {
            setSearchResults([])
        }, 100)
    }

    useEffect(() => {
        let menuToggle = document.getElementById('menu-toggle');
        let mobileMenu = document.getElementById('mobile-menu');

        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });

        history.listen((location) => {
            mobileMenu.classList.add('hidden');
        })
    }, [history]);

    return (
        <nav className="bg-gray-800 fixed w-full z-40 top-0">
            <div className=" mx-auto px-4 sm:pr-6 lg:pr-8">
                <div className="flex items-center h-16">
                    <div className="flex items-center w-full">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-white">MovieDig</Link>
                        </div>
                        <div className="hidden sm:block w-full">
                            {localStorage.getItem('token') !== "null" &&
                            <div className="ml-10 flex items-baseline">
                                <Link to="/dashboard"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <div className="w-1/3 md:w-1/2 absolute pl-2 left-0 right-0 ml-auto mr-auto">
                                    <input id="movie_search" name="movie_search" type="text"
                                           autoComplete="off"
                                           onChange={event => movieSearch(event.target.value)}
                                           onFocus={event => movieSearch(event.target.value)}
                                           onBlur={() => hideSearchResults()}
                                           className="appearance-none rounded-md relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                           placeholder="Search movies by title..."/>
                                    {searchResults.length > 0 &&
                                    <div className="bg-white rounded-md border border-gray-300 pt-2">
                                        {searchResults.splice(0, 7).map((movie, index) => {
                                            return (
                                                <Link to={{pathname: '/movie', search: `?id=${movie.id}`}}
                                                      className="py-2 px-3 block hover:bg-purple-500 hover:text-white border-b"
                                                      key={index}>
                                                    {movie.poster_path ?
                                                        <img src={'https://image.tmdb.org/t/p/w45' + movie.poster_path}
                                                             alt=""
                                                             className="rounded-md align-top sm:align-middle inline-block mr-3"/>
                                                        :
                                                        <img src={'https://dummyimage.com/45x68/cccccc/ffffff&text=No+poster'}
                                                             alt=""
                                                             className="rounded-md align-top sm:align-middle inline-block mr-3"/>
                                                    }
                                                    {movie.title}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    }
                                </div>
                                <Link to="/account"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Settings</Link>
                                <Link to="/wishlist"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Wish
                                    list</Link>
                                <button onClick={logout}
                                        className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Log
                                    out
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                    <div className="mr-2 flex sm:hidden">
                        <button
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none"
                            aria-controls="mobile-menu" aria-expanded="false" id="menu-toggle">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="sm:hidden hidden px-2 pt-2 pb-3 space-y-1" id="mobile-menu">
                {localStorage.getItem('token') !== "null" &&
                <div>
                    <Link to="/dashboard"
                          className="block text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/account"
                          className="block text-white px-3 py-2 rounded-md text-sm font-medium">Settings</Link>
                    <Link to="/wishlist"
                          className="block text-white px-3 py-2 rounded-md text-sm font-medium">Wish list</Link>
                    <hr/>
                    <button onClick={logout}
                            className="block text-white px-3 py-2 rounded-md text-sm font-medium">Log out
                    </button>
                </div>
                }
            </div>
        </nav>
    )
}

export default Navbar;
