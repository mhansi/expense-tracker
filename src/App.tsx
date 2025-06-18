import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ExpenseTracker } from './pages/expensesTracker';
import './App.css';

export default () => (
  <Provider store={store}>
    <ExpenseTracker />
  </Provider>
);
