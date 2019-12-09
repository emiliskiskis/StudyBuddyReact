import {} from "formik-material-ui";

import * as yup from "yup";

import { Avatar, Button, Grid, IconButton } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { TextField } from "formik-material-ui";
import { UserContainer } from "./containers/UserContainer";

function UserProfile(props: { onClose: () => void }) {
  const { user } = useContext(UserContainer);
  function onUpdateClick(values) {}

  return (
    <div style={{ padding: 16, width: "calc(100% - 32px)" }}>
      <Grid container direction="column" alignItems="stretch" spacing={4}>
        <Grid
          container
          item
          justify="flex-end"
          style={{
            position: "absolute",
            padding: 0,
            paddingTop: 8,
            paddingRight: 8
          }}
        >
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid container item justify="center">
          {user.profilePicture != null && (
            <Grid item>
              <Avatar
                src={user.profilePicture}
                alt=""
                style={{ height: 128, width: 128 }}
              />
            </Grid>
          )}
        </Grid>
        <Grid item>
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
              lastName: yup.string().required("Please  enter your last name"),
              email: yup
                .string()
                .required("Please enter your E-mail")
                .email("Please enter a valid E-mail")
                .matches(/^[0-9a-zA-Z.-_@]+$/, "illegal characters detected")
            })}
          >
            {({ submitForm }) => (
              <Form>
                <Grid
                  container
                  direction="column"
                  alignItems="stretch"
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
                  <Grid container item justify="center">
                    <Button
                      variant="contained"
                      name="update"
                      onClick={event => submitForm()}
                    >
                      Update profile
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </div>
  );
}

export default UserProfile;
