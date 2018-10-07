import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Grid, IconButton, Checkbox, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });

    const { classes } = this.props;

    return (
      <li className={taskClassName}>

        <Grid container>

          <Grid item xs={1}>
            <Checkbox
                readOnly
                checked={!!this.props.task.checked}
                onClick={this.toggleChecked.bind(this)}
              />
          </Grid>
          <Grid item xs={10}>

            { this.props.showPrivateButton ? (
              <Button className="toggle-private" variant="raised" color="primary" onClick={this.togglePrivate.bind(this)} >
                { this.props.task.private ? 'Private' : 'Public' }
              </Button>
            ) : ''}

            <span className="text">
              <strong>{this.props.task.username}</strong>: {this.props.task.text}
            </span>

          </Grid>
          <Grid item xs={1}>
            <IconButton color="secondary" onClick={this.deleteThisTask.bind(this)}>
              <DeleteIcon/>
            </IconButton>
          </Grid>

        </Grid>

      </li>
    );
  }
}
