import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthContextProvider from 'contexts/AuthContext';
import { StickyNotesProvider } from 'contexts/StickyNotesContext';
import { ListsProvider } from 'contexts/ListsContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StickyNotesProvider>
        <ListsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ListsProvider>
      </StickyNotesProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
