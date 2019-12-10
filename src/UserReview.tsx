import { Button, Grid, Paper, TextField } from "@material-ui/core";
import React, { useState } from "react";

import StarRatingComponent from "react-star-rating-component";

function UserReview() {
  const [text, setText] = useState<String>("");
  const [stars, setStars] = useState(0);

  function onTextFieldChange(fieldValue: String) {
    setText(fieldValue);
  }
  function onButtonClick() {
    if (stars > 0) alert(text + " " + stars);
    //author username string, reviewee username string, comment string, rating int
  }

  return (
    <div style={{ margin: 8 }}>
      <Paper style={{ padding: 8 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item style={{ fontSize: "2em" }}>
            <StarRatingComponent
              name="Rating"
              starCount={5}
              onStarClick={value => {
                setStars(value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              multiline
              placeholder="Additional comments (optional)"
              onChange={field => onTextFieldChange(field.target.value)}
            />
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
