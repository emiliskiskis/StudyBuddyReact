import * as yup from "yup";

import { Button, Grid, Paper } from "@material-ui/core";
import { Field, Form, Formik } from "formik";

import React from "react";
import { TextField } from "formik-material-ui";
import { doRegister } from "./api/API";
import { useSnackbar } from "notistack";

function RegisterScreen(props: { onSuccessfulRegister: () => void }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid
      container
      alignItems="center"
      justify="space-around"
      style={{ minHeight: "100vh" }}
    >
      <Grid item style={{ maxWidth: "25vw" }}>
        <Paper style={{ padding: 16 }}>
          <Formik
            initialValues={{
              username: "",
              password: "",
              passwordConfirm: "",
              firstName: "",
              lastName: "",
              email: ""
            }}
            onSubmit={async (values, actions) => {
              try {
                await doRegister(
                  values.username,
                  values.password,
                  values.firstName,
                  values.lastName,
                  values.email
                );
                props.onSuccessfulRegister();
              } catch (exception) {
                enqueueSnackbar(exception.message, { variant: "error" });
              }
              actions.setSubmitting(false);
            }}
            validationSchema={yup.object({
              username: yup
                .string()
                .required("Please enter a username")
                .matches(/^[0-1a-zA-Z-_]+$/, "illegal characters detected"),
              password: yup
                .string()
                .required("Please enter a password")
                .matches(
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[!-~]{8,}$/,
                  "Password must be atleast of 8 characters, contain atleast one number and one uppercase letter"
                ),
              //Password can also contain special characters
              passwordConfirm: yup
                .string()
                .required("Please enter a password")
                .oneOf([yup.ref("password")], "Password do not match!"),
              firstName: yup.string().required("Please enter your name"),
              lastName: yup.string().required("Please  enter your last name"),
              email: yup
                .string()
                .required("Please enter your E-mail")
                .email("Please enter a valid E-mail")
                .matches(/^[0-9a-zA-Z.-_@]+$/, "illegal characters detected")
            })}
          >
            {({ isSubmitting, submitForm }) => (
              <Form>
                <Grid container spacing={3} justify="space-between">
                  <Grid item xs={12}>
                    <Field
                      name="username"
                      label="Username"
                      component={TextField}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="password"
                      label="Password"
                      type="password"
                      component={TextField}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="passwordConfirm"
                      label="Password"
                      type="password"
                      component={TextField}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="firstName"
                      label="First Name"
                      component={TextField}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="lastName"
                      label="Last Name"
                      component={TextField}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="email"
                      label="E-mail"
                      component={TextField}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      disabled={isSubmitting}
                      variant="contained"
                      name="register"
                      type="submit"
                      onClick={event => {
                        event.preventDefault();
                        submitForm();
                      }}
                      style={{ width: "100%" }}
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default RegisterScreen;
