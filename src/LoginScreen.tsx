import * as yup from "yup";

import { Button, Grid, Paper } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { doLogin, getAllUsers } from "./api/API";

import { TextField } from "formik-material-ui";
import { UserContainer } from "./containers/UserContainer";
import { useSnackbar } from "notistack";

function LoginScreen(props: {
  onRegisterButtonPressed: () => void;
  onSuccessfulLogin: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useContext(UserContainer);

  return (
    <Grid
      container
      alignItems="center"
      justify="space-around"
      style={{
        minHeight: "100vh"
      }}
    >
      <Grid item style={{ maxWidth: "25vw" }}>
        <Paper style={{ padding: 16 }}>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, actions) => {
              try {
                setUser(await doLogin(values.username, values.password));
                await getAllUsers();
                props.onSuccessfulLogin();
              } catch (exception) {
                enqueueSnackbar(exception.message, { variant: "error" });
              }
              actions.setSubmitting(false);
            }}
            validationSchema={yup.object({
              username: yup.string().required("Please enter a username"),
              password: yup.string().required("Please enter a password")
            })}
          >
            {formikProps => (
              <Form>
                <Grid container spacing={1} justify="space-between">
                  <Grid item xs={12}>
                    <Field
                      name="username"
                      label="Username"
                      component={TextField}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="password"
                      label="Password"
                      type="password"
                      component={TextField}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      variant="contained"
                      onClick={formikProps.submitForm}
                      style={{ width: "100%" }}
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs>
                    <Button
                      variant="contained"
                      onClick={props.onRegisterButtonPressed}
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

export default LoginScreen;
