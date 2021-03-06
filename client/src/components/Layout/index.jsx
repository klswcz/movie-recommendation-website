import {useEffect} from 'react'
import Navbar from "../Navbar"
import Footer from "../Footer"
import {Route, Switch, useHistory, useLocation, withRouter} from "react-router-dom"
import Home from "../Home"
import Login from "../Login"
import Register from "../Register"
import Dashboard from "../Dashboard"
import Movie from "../Movie"
import Alert from "../UI/Alert"
import Account from '../Account'
import Wishlist from '../Wishlist'
import RatedMovies from "../RatedMovies"
import BatchMovieRating from '../BatchMovieRating'
import Tutorial from '../Tutorial'
import store from '../../store/reducer'
import {useSelector} from "react-redux"
import FlashMessage from "../UI/FlashMessage"
import Recommendations from "../Recommendations";

function Layout() {
    const location = useLocation();
    const alert = useSelector(state => state.alert)
    const flashMessage = useSelector(state => state.flashMessage)
    const history = useHistory()

    useEffect(() => {
        return history.listen((location) => {
            store.dispatch({type: 'HIDE_ALERT'});
            store.dispatch({type: 'HIDE_FLASH_MESSAGE'});
        })
    }, [history])

    return (
        <div id="app" className="relative h-screen-minus-navbar">
            <div id="content-wrap" className="pb-14">
                {location.pathname !== '/' &&
                <Navbar/>
                }
                {alert.isVisible &&
                <Alert/>
                }
                {flashMessage.isVisible &&
                <FlashMessage/>
                }
                <Switch>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/tutorial" exact component={Tutorial}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                    <Route path="/account/settings" exact component={Account}/>
                    <Route path="/account/ratings" exact component={RatedMovies}/>
                    <Route path="/account/wishlist" exact component={Wishlist}/>
                    <Route path="/movies/rate" exact component={BatchMovieRating}/>
                    <Route path="/movies/:id" component={Movie}/>
                    <Route path="/recommendations/more" exact component={Recommendations}/>
                    <Route path="/" component={Home}/>
                </Switch>
            </div>
            <Footer/>
        </div>
    )
}


export default withRouter(Layout)
