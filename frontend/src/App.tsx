import {Suspense, lazy, JSX} from 'react';
import {Routes, Route} from 'react-router-dom';

const Home = lazy(() => import('./pages/Home.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const Loader = lazy(() => import("./components/Loaders/Loader.tsx"));
const Layout = lazy(() => import("./components/Layout/Layout.tsx"))

function App(): JSX.Element {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
