import { Button, Grid, Paper, TextField } from "@material-ui/core";

import React from "react";
import StarRatingComponent from "react-star-rating-component";

function UserReview() {
  function onButtonClick() {}

  return (
    <div style={{ margin: 8 }}>
      <Paper style={{ padding: 8 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item style={{ fontSize: "2em" }}>
            <StarRatingComponent
              name="Rating"
              starCount={5}
              onStarClick={value => {}}
            />
          </Grid>
          <Grid item>
            <TextField variant="outlined" multiline value={""} />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onButtonClick()}
            >
              Submit review
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default UserReview;
