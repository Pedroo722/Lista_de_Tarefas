import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import NavBar from './components/NavBar';
// import Footer from './components/Footer';
import Home from './pages/Home';


const App: React.FC = () => {
  const appContentStyle: React.CSSProperties = {
    paddingTop: '3rem',
  };

  return (
    <Router>
      {/* <NavBar /> */}
      <div style={appContentStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;