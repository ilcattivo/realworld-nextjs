import { useState, useEffect, useContext } from "react";
import Router from "next/router";
import { FormGroup, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { CurrentUserContext } from "../libs/contexts/currentUser";
import userApi from "../libs/api/user";
import BackendErrorMessages from "../components/backendErrorMessages";
import MyTextField from "../components/myTextField";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "600px",
    margin: "0 auto",
  },
  form: {
    "& > *": {
      marginBottom: theme.spacing(1.1),
    },
  },
}));

export default () => {
  const [currentUserState] = useContext(CurrentUserContext);
  const [backendErrors, setBackendErrors] = useState(null);
  const classes = useStyles();

  const [initialValues, setInitialValues] = useState({
    image: "",
    bio: "",
    username: "",
    email: "",
    password: "",
  });

  const validationSchema = object({
    username: string().required(),
    email: string().required().email(),
    password: string().min(8),
  });

  const handleSubmit = async (values) => {
    const user = { ...values };

    if (!user.password) {
      delete user.password;
    }

    const { data, status } = await userApi.editUser(user);

    if (status !== 200) {
      setBackendErrors(data.errors.body);
    }

    if (data?.user) {
      Router.push(`/`);
    }
  };

  useEffect(() => {
    if (currentUserState.isLoggedIn === false) {
      Router.push("/login");
      return;
    }

    if (!currentUserState.currentUser) return;

    const { currentUser } = currentUserState;

    setInitialValues({
      image: currentUser.image || "",
      bio: currentUser.bio || "",
      username: currentUser.username,
      email: currentUser.email,
      password: "",
    });
  }, [currentUserState.currentUser]);

  return (
    <section className={classes.root}>
      <Typography gutterBottom variant="h5" component="h3">
        Account settings
      </Typography>
      {backendErrors ? (
        <BackendErrorMessages backendErrors={backendErrors} />
      ) : null}
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValidating }) => (
          <Form className={classes.form}>
            <FormGroup>
              <MyTextField
                name="image"
                label="URL of profile picture"
                placeholder="https://www.example.com/images/1.jpg"
              />
            </FormGroup>
            <FormGroup>
              <MyTextField name="username" label="Username" />
            </FormGroup>
            <FormGroup>
              <MyTextField
                name="bio"
                label="Biography"
                placeholder="Short bio about you"
                multiline
                rows={4}
              />
            </FormGroup>
            <FormGroup>
              <MyTextField name="email" label="Email" />
            </FormGroup>
            <FormGroup>
              <MyTextField
                name="password"
                label="Change password"
                type="password"
                placeholder="Enter new password"
              />
            </FormGroup>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isValidating}
              style={{ margin: "0 auto", display: "table" }}
            >
              Update
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
};
