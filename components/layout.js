// components/layout.js

import Head from 'next/head';
import Header from '../components/header';
import {Flex} from "@chakra-ui/core";


const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Next Auth App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <flex width="100%" align="center" >
        {children}
      </flex>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }
       
      `}</style>
    </>
  )
};

export default Layout;
