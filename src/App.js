import 'swiper/css';
import './assets/boxicons-2.0.7/css/boxicons.min.css'
import './App.scss';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';

import RoutesConfig from './config/RoutesConfig'
function App() {
  return (
      <>
        <Header/>
        <RoutesConfig/>
        <Footer/>
      </>
  );
}

export default App;
