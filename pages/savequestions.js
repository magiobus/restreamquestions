import Layout from '../components/layout'
import React, { useEffect } from 'react'

import {useAuth} from '../lib/auth'


const SaveQuestions = props => {
  const {isAuthenticated, logout} = useAuth()

  // useEffect(() => {
  // }, [isAuthenticated])

  return (
    <Layout>
    {isAuthenticated ? (
      <p>Savequestions page</p>
    ):(
      <>
        <p>Sorry, you can't touch this.</p>
        <p>Please sign in</p>
      </>
    )}
    </Layout>
  )
}

export default SaveQuestions;
