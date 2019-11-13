import * as yup from "yup";

import { Button, Grid, Paper } from "@material-ui/core";
import { Field, Form, Formik } from "formik";

import React from "react";
import { TextField } from "formik-material-ui";

function LoginScreen(props: { onRegisterButtonPressed: () => void }) {
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
            onSubmit={() => {}}
            validationSchema={yup.object({
              username: yup.string().required("Please enter a username"),
              password: yup.string().required("Please enter a password")
            })}
          >
            {formikProps => (
              <Form
                onReset={formikProps.handleReset}
                onSubmit={formikProps.handleSubmit}
              >
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
                      name="login"
                      type="submit"
                      style={{ width: "100%" }}
                    >
                      login
                    </Button>
                  </Grid>
                  <Grid item xs>
                    <Button
                      variant="contained"
                      name="register"
                      onClick={props.onRegisterButtonPressed}
                      style={{ width: "100%" }}
                    >
                      Register?
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
