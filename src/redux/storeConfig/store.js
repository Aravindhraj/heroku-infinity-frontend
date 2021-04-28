import { createStore, applyMiddleware, compose } from "redux"
import createDebounce from "redux-debounced"
import thunk from "redux-thunk"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from "../reducers/rootReducer"

const middlewares = [thunk, createDebounce()]

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth', 'customizer']
};


if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
)
const persistor = persistStore(store)

export { store, persistor }
