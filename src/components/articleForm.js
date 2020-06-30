import { useState, useEffect, useContext } from "react";
import { FormGroup, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { useRouter } from "next/router";
import { CurrentUserContext } from "../libs/contexts/currentUser";
import MyTextField from "./myTextField";
import BackendErrorMessages from "../components/backendErrorMessages";
import articleApi from "../libs/api/article";

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

export default function ArticleForm({ edit }) {
  const router = useRouter();
  const [currentUserState] = useContext(CurrentUserContext);

  useEffect(() => {
    if (!currentUserState.isLoading && currentUserState.isLoggedIn === false) {
      router.push("/login");
    }
  }, [currentUserState.isLoading, currentUserState.isLoggedIn]);

  const classes = useStyles();
  const [backendErrors, setBackendErrors] = useState(null);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });

  const validationSchema = object({
    title: string().required(),
    description: string().required(),
    body: string().required(),
    tagList: string(),
  });

  const handleSubmit = async (values) => {
    const article = { ...values };
    const tagsArray = article.tagList.split(",").map((tag) => tag.trim());
    article.tagList = tagsArray;

    let apiMethod = articleApi.postArticle.bind(null, article);

    if (edit === true) {
      apiMethod = articleApi.editArticle.bind(null, router.query.id, article);
    }

    const { data, status } = await apiMethod();

    if (status !== 200) {
      setBackendErrors(data.errors.body);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (!edit || !currentUserState.currentUser) {
      return;
    }

    const fetchArticle = async () => {
      const article = await articleApi.getArticleById(router.query.id);

      setInitialValues({
        title: article.title,
        description: article.description || "",
        body: article.body,
        tagList: article.tagList?.join(", "),
      });
    };

    fetchArticle();
  }, [currentUserState.currentUser]);

  return (
    <section className={classes.root}>
      <Typography gutterBottom variant="h5" component="h3">
        {edit ? "Edit article" : "Write new article"}
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
                name="title"
                label="Title"
                placeholder="Article title"
              />
            </FormGroup>
            <FormGroup>
              <MyTextField
                name="description"
                label="Description"
                placeholder="What is your article about?"
              />
            </FormGroup>
            <FormGroup>
              <MyTextField
                name="body"
                label="Article body"
                placeholder="Write your article"
                multiline
                rows={4}
              />
            </FormGroup>
            <FormGroup>
              <MyTextField
                name="tagList"
                label="Tags (separated by comma)"
                placeholder="tag1, tag2, tag3 ..."
              />
            </FormGroup>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isValidating}
              style={{ margin: "0 auto", display: "table" }}
            >
              Publish
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
