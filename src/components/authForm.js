import { useState, useContext } from "react";
import Link from "next/link";
import Router from "next/router";
import { Form, Formik } from "formik";
import { object, string, ref } from "yup";
import { Button, makeStyles, FormGroup, Typography } from "@material-ui/core";
import { CurrentUserContext } from "../libs/contexts/currentUser";
import userApi from "../libs/api/user";
import useLocalStorage from "../libs/hooks/useLocalStorage";
import BackendErrorMessages from "./backendErrorMessages";
import MyTextField from "./myTextField";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "20px 30px",
    boxShadow: "0 0 6px 0 rgba(0, 0, 0, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.06)",
  },
  subheader: {
    marginBottom: theme.spacing(1.3),
  },
  form: {
    "& > *": {
      marginBottom: theme.spacing(1.1),
    },
  },
}));

export default ({ login, signup }) => {
  const classes = useStyles();
  const [, setToken] = useLocalStorage("token");
  const [, setSubmitting] = useState(false);
  const [, dispatch] = useContext(CurrentUserContext);
  const [errors, setErrors] = useState();

  let title = "Login",
    subheader = "Don't have an account?",
    link = "Sign Up",
    button = "Log In";

  if (signup === true) {
    title = "Register";
    subheader = "Already have an account?";
    link = "Log In";
    button = "Sign In";
  }

  const initialValues = login
    ? {
        email: "",
        password: "",
      }
    : {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

  const validationSchema = login
    ? object({
        email: string()
          .required("Это поле обязательно")
          .email("Некорректно введен Email"),
        password: string().required("Это поле обязательно"),
      })
    : object({
        username: string()
          .required("Это поле обязательно")
          .min(3, "Введите минимум 3 символа"),
        email: string()
          .required("Это поле обязательно")
          .email("Некорректно введен Email"),
        password: string()
          .required("Это поле обязательно")
          .min(8, "Пароль должен содежрать минимум 8 символов"),
        confirmPassword: string()
          .required("Это поле обязательно")
          .oneOf([ref("password")], "Пароли должны совпадать"),
      });

  const handleSubmit = async (data) => {
    const user = { ...data };
    if (signup) {
      delete user.confirmPassword;
    }

    const method = login ? userApi.login : userApi.register;
    setSubmitting(true);

    try {
      const { data, status } = await method(user);
      if (status !== 200) {
        setErrors(data.errors);
        return;
      } else {
        setToken(data.user.token);
        dispatch({ type: "SET_AUTHORIZED", payload: data.user });
        Router.push("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={classes.root}>
      <Typography gutterBottom variant="h5" component="h3">
        {title}
      </Typography>
      <p className={classes.subheader}>
        {subheader}{" "}
        <Link href={login ? "/signup" : "/login"}>
          <a>{link}</a>
        </Link>
      </p>
      {errors && <BackendErrorMessages backendErrors={errors} />}
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValidating }) => (
          <Form className={classes.form}>
            {signup && (
              <FormGroup>
                <MyTextField name="username" label="Nickname" />
              </FormGroup>
            )}
            <FormGroup>
              <MyTextField name="email" label="Email" />
            </FormGroup>
            <FormGroup>
              <MyTextField name="password" label="Password" type="password" />
            </FormGroup>
            {signup && (
              <FormGroup>
                <MyTextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                />
              </FormGroup>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isValidating}
              style={{ margin: "0 auto", display: "table" }}
            >
              {button}
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
};
