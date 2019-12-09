import {} from "formik-material-ui";

import * as yup from "yup";

import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";

import { TextField } from "formik-material-ui";
import { UserContainer } from "./containers/UserContainer";

function UserProfile() {
  const { user } = useContext(UserContainer);
  function onUpdateClick(values) {
    alert("epic");
    if (values.email !== user.email) {
      //update email
    }
    if (values.firstName !== user.firstName) {
      //update first name
    }

    if (values.lastName !== user.lastName) {
      //update last name
    }

    if (1) {
      //check if values.oldPassword matches DB
    }

    if (1) {
      //if oldPassword matches DB send values.newPassword to DB
    }
  }
  function onBackClick() {
    alert("back");
  }

  return (
    <div style={{ margin: 8 }}>
      <Paper style={{ padding: 8 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography>{user.username}</Typography>
          </Grid>
          <Grid item>
            {user.profilePicture != null && (
              <img src={user.profilePicture} alt="" style={{ width: "100%" }} />
            )}
          </Grid>
          <Grid item>
            <Paper>
              <Formik
                initialValues={{
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  oldPassword: "",
                  newPassword: "",
                  newPasswordConfirm: ""
                }}
                onSubmit={(values, actions) => onUpdateClick(values)}
                validationSchema={yup.object({
                  oldPassword: yup
                    .string()
                    .matches(
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[!-~]{8,}$/,
                      "Password must be atleast of 8 characters, contain atleast one number and one uppercase letter"
                    ),
                  newPassword: yup
                    .string()
                    .matches(
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[!-~]{8,}$/,
                      "Password must be atleast of 8 characters, contain atleast one number and one uppercase letter"
                    ),
                  newPasswordConfirm: yup
                    .string()
                    .oneOf([yup.ref("password")], "Passwords do not match!"),
                  firstName: yup.string().required("Please enter your name"),
                  lastName: yup
                    .string()
                    .required("Please  enter your last name"),
                  email: yup
                    .string()
                    .required("Please enter your E-mail")
                    .email("Please enter a valid E-mail")
                    .matches(
                      /^[0-9a-zA-Z.-_@]+$/,
                      "illegal characters detected"
                    )
                })}
              >
                {({ submitForm }) => (
                  <Form>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item>
                        <Field
                          name="email"
                          label="Email"
                          component={TextField}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="firstName"
                          label="First name"
                          component={TextField}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="lastName"
                          label="Last name"
                          component={TextField}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="oldPassword"
                          label="Current password"
                          type="password"
                          component={TextField}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="newPassword"
                          label="New password"
                          type="password"
                          component={TextField}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="newPasswordConfirm"
                          label="Repeat new password"
                          type="password"
                          component={TextField}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          name="update"
                          onClick={event => submitForm()}
                        >
                          Update profile
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          name="back"
                          onClick={() => onBackClick()}
                        >
                          Back
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default UserProfile;
