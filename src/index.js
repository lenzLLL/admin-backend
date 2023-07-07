import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { initialeState } from './scenes/context/InitialeState';
import reducer from './scenes/context/Reducer';
import { StateProvider } from './scenes/context/StateProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<BrowserRouter>
<StateProvider initialeState={initialeState} reducer ={reducer}>
    <App />
</StateProvider>
</BrowserRouter>

);


