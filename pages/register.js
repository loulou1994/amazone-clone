import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppContext } from '../context/appContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

import Layout from '../components/Layout';

import styles from '../styles/register_signin_profile.module.css';
import logo from '../public/images/amazon.png';
import { FaCaretRight } from 'react-icons/fa';
import { IoAlertOutline } from 'react-icons/io5';

import getError from '../utils/getErrors'

const Register = () => {
  const {userInfo, setUserInfo} = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const [registerInputs, setRegisterInputs] = useState({
    name: '',
    email: '',
    password: '',
    confirmPwd: ''
  });
  const router = useRouter();

  useEffect(() => {
    userInfo && router.push('/');
  }, [router, userInfo])

  const updateRegisterInputs = (e) => {
    setRegisterInputs((prevVal) => ({...prevVal, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(registerInputs.password !== registerInputs.confirmPwd) {
      enqueueSnackbar(`Passwords don't match, try again`, { variant: 'error' });
      return
    }
    try {
      const { data } = await axios.post('/api/users/register', registerInputs)
      setUserInfo(() => {
        Cookies.set("userInfo", JSON.stringify(data))
        return data
      });
    }catch(err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  return (
    <Layout>
      <Head>
        <title>Register into Amazon Clone</title>
        <meta name="description" content="register page of amazon clone" />
      </Head>
      <main className={`${styles['register-main']}`}>
        <Image src={logo} alt="amazon clone logo" />
        <section className={`${styles.register}`}>
          <h1 className={`${styles.register__title}`}>Create account</h1>
          <form
            method="post"
            className={`${styles.register__form}`}
            onSubmit={handleSubmit}
          >
            <label htmlFor="name" className="flex">
              <span>Your name</span>
              <input
                type="text"
                id="name"
                name="name"
                value={registerInputs.name}
                onChange={updateRegisterInputs}
                placeholder="First and last name"
                pattern="^[a-zA-Z]{2,20}\s[a-zA-Z]{2,20}$"
                required
              />
            </label>
            <label htmlFor="email" className="flex">
              <span>Mobile number or email</span>
              <input
                type={'email'}
                id="email"
                name="email"
                value={registerInputs.email}
                onChange={updateRegisterInputs}
                placeholder="No special characters"
                pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                required
              />
            </label>
            <label htmlFor="password" className="flex">
              <span>Password</span>
              <input
                type={'password'}
                id="password"
                name="password"
                value={registerInputs.password}
                onChange={updateRegisterInputs}
                placeholder="At least 6 characters"
                pattern="[\w\.=-]{8,}"
                required
              />
              <span className="flex">
                <IoAlertOutline />
                Passwords must be at least 6 characters.
              </span>
            </label>
            <label htmlFor="confirmPwd" className="flex">
              <span>Re-enter password</span>
              <input
                type={'password'}
                id="confirmPwd"
                name="confirmPwd"
                value={registerInputs.confirmPwd}
                onChange={updateRegisterInputs}
                pattern="[\w\.=-]{8,}"
                required
              />
            </label>
            <button
              type="submit"
              className={`${styles.register__submit} pointer`}
            >
              Continue
            </button>
          </form>
          <p className={`${styles['login-paragraph']}`}>
            Already have an account?{' '}
            <Link href="/login">
              Sign in <FaCaretRight />
            </Link>
          </p>
        </section>
      </main>
    </Layout>
  );
};

export default Register;