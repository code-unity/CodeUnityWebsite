import React from 'react';
import ReactDOM from 'react-dom';
import {HelmetProvider} from 'react-helmet-async';
import App from './App';

// HelmetProvider is required by react-helmet-async: without it the <Helmet>
// tags in components/SEO.jsx render but are never applied to the document.
ReactDOM.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById('root')
);
