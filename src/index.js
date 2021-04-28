import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProviderWrapper } from "./utility/context/Internationalization";
import { Layout } from "./utility/context/Layout";
import * as serviceWorker from "./serviceWorker";
import { store, persistor } from "./redux/storeConfig/store";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";
import "./index.scss";
import { ToastContainer } from "react-toastify";

const LazyApp = lazy(() => import("./App"));

// configureDatabase()

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <Suspense fallback={<Spinner />}>
        <Layout>
          <IntlProviderWrapper>
            <LazyApp />
            <ToastContainer
              autoClose={2000}
              pauseOnHover
              hideProgressBar={true}
            />
          </IntlProviderWrapper>
        </Layout>
      </Suspense>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
