import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'

import Header from './Header'
import Footer from './Footer'
import Loading from './Loading'

const Layout = ({children}) => {
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsChanging(true);
    };
    const handleRouteComplete = () => {
      setIsChanging(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  });

  return (
    <>
      <Header />
        {isChanging && <Loading/>}
        {children}
      <Footer />
    </>
  );
}
export default Layout