import Connector from './connector';
import invariant from 'invariant';
import isFunction from '../utils/isFunction';
import {createStore, applyMiddleware} from 'redux';

export default function ngReduxProvider() {
  let _reducer = undefined;
  let _middlewares = [];
  let _storeEnhancer = undefined;

  this.createStoreWith = (reducer, middlewares, storeEnhancer) => {
  	  invariant(
        isFunction(reducer),
        'The reducer parameter passed to createStoreWith must be a Function. Instead received %s.',
        typeof reducer
      );

      invariant(
        !storeEnhancer || isFunction(storeEnhancer),
        'The storeEnhancer parameter passed to createStoreWith must be a Function. Instead received %s.',
        typeof storeEnhancer
      );

      _reducer = reducer;
      _storeEnhancer = storeEnhancer || createStore;
      _middlewares = middlewares;
  };

  this.$get = ($injector) => {
  	let resolvedMiddleware = [];
  	for(let middleware of _middlewares) {
  		if(typeof middleware === 'string') {
  			resolvedMiddleware.push($injector.get(middleware));
  		} else {
  			resolvedMiddleware.push(middleware);
  		}
  	}

  	return Connector(applyMiddleware(...resolvedMiddleware)(_storeEnhancer)(_reducer));
  }
}
