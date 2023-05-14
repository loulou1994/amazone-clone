import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSnackbar } from "notistack";

import { useAppContext } from "../context/appContext";
import getError from "../utils/getErrors";
import Layout from "../components/Layout";

import styles from "../styles/register_signin_profile.module.css";
import { IoAlertOutline } from "react-icons/io5";

const Profile = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useAppContext();
  const [profileInputs, setProfileInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPwd: "",
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, []);

  const updateProfileInputs = (e) => {
    setProfileInputs((prevVal) => ({
      ...prevVal,
      [e.target.name]: e.target.value,
    }));
  };

  const resetControlInputs = () => {
    setProfileInputs({
      name: "",
      email: "",
      password: "",
      confirmPwd: "",
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    closeSnackbar();
    if (profileInputs.password !== profileInputs.confirmPwd) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }
    try {
      await axios.put(
        "/api/users/profile",
        {
          id: userInfo._id,
          name: profileInputs.name,
          email: profileInputs.email,
          password: profileInputs.password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      resetControlInputs()
      enqueueSnackbar("Account password updated successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Profile</title>
        <meta name="description" content="re-enter new password for profile " />
      </Head>
      <main className={`${styles["profile-main"]}`}>
        <section className={`${styles["profile"]}`}>
          <h1 className={`${styles.profile__title}`}>Profile</h1>
          <form
            method="post"
            className={`${styles.profile__form}`}
            onSubmit={handleSubmit}
          >
            <label htmlFor="name" className="flex">
              <span>Your name</span>
              <input
                type="text"
                id="name"
                name="name"
                value={profileInputs.name}
                onChange={updateProfileInputs}
                placeholder="First and last name"
                pattern="^[a-zA-Z]{2,20}\s[a-zA-Z]{2,20}$"
                required
              />
            </label>
            <label htmlFor="email" className="flex">
              <span>Mobile number or email</span>
              <input
                type={"email"}
                id="email"
                name="email"
                value={profileInputs.email}
                onChange={updateProfileInputs}
                placeholder="No special characters"
                pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                required
              />
            </label>
            <label htmlFor="password" className="flex">
              <span>Password</span>
              <input
                type={"password"}
                id="password"
                name="password"
                value={profileInputs.password}
                onChange={updateProfileInputs}
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
                type={"password"}
                id="confirmPwd"
                name="confirmPwd"
                value={profileInputs.confirmPwd}
                onChange={updateProfileInputs}
                pattern="[\w\.=-]{8,}"
                required
              />
            </label>
            <button
              type="submit"
              className={`${styles.profile__submit} pointer`}
            >
              Update
            </button>
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default Profile;
