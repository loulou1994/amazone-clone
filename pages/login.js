import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import {useRouter} from 'next/router'
import { useAppContext } from "../context/appContext" 
import { useSnackbar } from 'notistack';

import Layout from "../components/Layout"

import styles from '../styles/register_signin_profile.module.css'
import logo from '../public/images/amazon.png';

import getError from '../utils/getErrors';
import Cookies from "js-cookie"

const Login = () => {
  const { setUserInfo, userInfo } = useAppContext();
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();
  const [inputs, setInputs] = useState({  
    email: '',
    password: ''
  })
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    userInfo && router.push('/'); 
  }, [userInfo])

  const submitHandler = async (e) => {    
    e.preventDefault();
    if(!isFetching){
      try {
        setIsFetching(true)
        const { data } = await axios.post('/api/users/login', inputs)
        setUserInfo(() => {
          Cookies.set("userInfo", JSON.stringify(data))
          return data
        });
      }catch(err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
      setIsFetching(false);
    }
  }

  const updateInputs = (input) => {
    setInputs((prevValue) => ({...prevValue, [input.name]: input.value}))
  }
  
  return (
    <Layout>
      <Head>
        <meta name="description" content="login page of Amazon Clone" />
        <title>Login to Amazon Clone</title>
      </Head>
      <main className={`${styles['login-main']}`}>
        <Image src={logo} alt="amazon clone logo" />
        <section className={`${styles.login}`}>
          <h1 className={`${styles.login__title}`}>Sign in</h1>
          <form method="post" className={`${styles.login__form}`} onSubmit={submitHandler}>
            <label htmlFor="email" className="flex">
              <span>Enter your email</span>
              <input type="email" name="email" id="email" value={inputs.email} onChange={(e) =>{updateInputs(e.target)}}/>
            </label>
            <label htmlFor="password" className="flex">
              <span>Enter your password</span>
              <input type="password" name="password" id="password" value={inputs.password} onChange={(e) =>{updateInputs(e.target)}}/>
            </label>
            <button type="submit" className={`${styles.login__submit} pointer`}>Continue</button>
          </form>
        </section>
        <div className={`${styles['goto-register']}`}>
          <h2>New to Amazon clone?</h2>
          <Link href="/register">Create your Amazon clone account</Link>
        </div>
      </main>
    </Layout>
  );
}

export default Login