// components/header.js
import Link from 'next/link';
import { Box, Heading, Flex, Text, Button} from "@chakra-ui/core";

//AUTH MODULE, for context and auth functions
import {useAuth} from '../lib/auth'
import {restreamUrl} from '../lib/auth'


const Header = () => {
  const {isAuthenticated, token, logout} = useAuth()

  return (
    <header>
      <nav>
        <Link href="/">
          <a className="logo">
            <span style={{ color: '#f06292' }}>Restream</span>
            <span style={{ color: '#29b6f6' }}> Questions</span>
          </a>
        </Link>

        {isAuthenticated ? (
          <p>
           <a onClick={() => { logout() }}>
             <Link href="/">
               <Button variantColor="pink" size="sm" border="1px">
                 Log Out
               </Button>
             </Link>
           </a>
           </p>
         ):(
           <p>
           <Link href={restreamUrl}>
           <button className="signInButton">Sign in</button>
           </Link>
           </p>
         )}
      </nav>

      <style jsx>{`
        header {
          border-bottom: 1px solid #ccc;
        }
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 42rem;
          margin: 0 auto;
          padding: 0.2rem 1.25rem;
        }
        .logo {
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .signInButton {
          background-color: #1eb1fc;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          padding: 0.5rem 1rem;
        }
        .signInButton:hover {
          background-color: #1b9fe2;
        }
      `}</style>
    </header>
  );
};


export default Header;
