// import App from 'next/app'
import { ThemeProvider, CSSReset} from "@chakra-ui/core";
import { AuthProvider } from '../lib/auth'

const MyApp = ({Component, pageProps}) => {

  return (
    <AuthProvider>
      <ThemeProvider>
        <CSSReset/>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  )
}


export default MyApp
