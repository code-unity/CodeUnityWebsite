import {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AOS from "aos";
import NavScrollTop from './components/NavScrollTop';
import HomeOne from './pages/HomeOne';
import HomeTwo from './pages/HomeTwo';
import HomeThree from './pages/HomeThree';
import About from './pages/About';
import Service from './pages/Service';
import Work from './pages/Work';
import WorkDetails from './pages/WorkDetails';
import BlogGrid from './pages/BlogGrid';
import BlogClassic from './pages/BlogClassic';
import BlogDetails from './pages/BlogDetails';
import BlogCategories from './pages/BlogCategories';
import BlogTag from './pages/BlogTag';
import Contact from './pages/Contact';

// CSS File Here
import "aos/dist/aos.css";
import 'react-modal-video/scss/modal-video.scss';
import './assets/scss/style.scss';


function App() {
  useEffect(() => {
    AOS.init({
        offset: 80,
        duration: 1000,
        once: true,
        easing: 'ease',
    });
    AOS.refresh();
    
  }, [])
  return (
      <Router>
        <NavScrollTop>
            <Routes>
              <Route path={`${process.env.PUBLIC_URL + "/"}`} element={<HomeOne/>}/>
              <Route path={`${process.env.PUBLIC_URL + "/home-one"}`} element={<HomeOne/>}/>
              <Route path={`${process.env.PUBLIC_URL + "/home-two"}`} element={<HomeTwo/>}/>
              <Route path={`${process.env.PUBLIC_URL + "/home-three"}`} element={<HomeThree/>}/>
              <Route path={`${process.env.PUBLIC_URL + "/about"}`} element={<About />} />
              <Route path={`${process.env.PUBLIC_URL + "/service"}`} element={<Service />} />
              <Route path={`${process.env.PUBLIC_URL + "/work"}`} element={<Work />} />
              <Route path={`${process.env.PUBLIC_URL + "/work-details/:id"}`} element={<WorkDetails />} />
              <Route path={`${process.env.PUBLIC_URL + "/blog-grid"}`} element={<BlogGrid />} />
              <Route path={`${process.env.PUBLIC_URL + "/blog-classic"}`} element={<BlogClassic />} />
              <Route path={`${process.env.PUBLIC_URL + "/tag/:slug"}`} element={<BlogTag />} />
              <Route path={`${process.env.PUBLIC_URL + "/category/:slug"}`} element={<BlogCategories />} />
              <Route path={`${process.env.PUBLIC_URL + "/blog-details/:id"}`} element={<BlogDetails />} />
              <Route path={`${process.env.PUBLIC_URL + "/contact"}`} element={<Contact />} />
              {/* <Route element={<NotFound />} /> */}
            </Routes>
          </NavScrollTop>
      </Router>
  );
}

export default App;
