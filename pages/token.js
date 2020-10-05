import React, { useEffect } from 'react'
import { useRouter} from 'next/router'
import axios from "axios"; //We use axios for http requests
import fetch from "isomorphic-fetch"; //fetch for checkSession request
import qs from 'querystring'
import Cookies from 'js-cookie'

//AUTH MODULE, for context and auth functions
import {useAuth} from '../lib/auth'

const apiUrl = process.env.NEXT_PUBLIC_API_URL+"api"

//COMPONENT
const Token = props => {
  const { pathname, events } = useRouter()
  const {token, setToken} = useAuth()

  const router = useRouter()

  useEffect(()=>{
    if(props.token === null){
      Cookies.remove("token");
      setToken(null);
      router.push('/tokenerror')
    } else {
      Cookies.set("token", props.token, {expires: 60 });
      setToken(props.token);
      router.push('/savequestions')
    }

  }, [props])


   return ( <div><h1>Loading....</h1></div> )
}

//-------------  SERVER SIDE CODE----------------------
export async function getServerSideProps(context) {
  //context gets the url with params code
  let code = context.query.code

  const data = qs.stringify({
    grant_type: 'authorization_code',
    redirect_uri:process.env.NEXT_PUBLIC_RESTREAM_REDIRECT_URI,
    code: code,
    client_id: process.env.NEXT_PUBLIC_RESTREAM_CLIENT_ID,
    client_secret: process.env.RESTREAM_CLIENT_SECRET_ID,
    user: `${process.env.NEXT_PUBLIC_RESTREAM_CLIENT_ID}:${process.env.RESTREAM_CLIENT_SECRET_ID}`
  })

  let responseData = {token: null}
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
  try {
    let response = await axios.post('https://api.restream.io/oauth/token', data, headers)
    responseData.token = response.data
  } catch (e) {}


  return {
    props: {token: responseData.token}, // will be passed to the page component as props
  }
}

export default Token
