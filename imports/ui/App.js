import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Typography } from '@material-ui/core';
import { Grid, Checkbox, Input } from '@material-ui/core';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
  

  render() {
    return (
      <div className="container">
        <header>
          <Grid container>
          
            <Grid item xs={10}>
              <Typography variant="display1" >Todo List ({this.props.incompleteCount})</Typography>
            </Grid>

            <Grid align="right" item xs={2}>
              <AccountsUIWrapper />
            </Grid>

            <Grid item xs={6}>
              { this.props.currentUser ?
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                  <Input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add new tasks"
                  />
                </form> : ''
              }
            </Grid>
            
            <Grid align="right" item xs={6}>

              <Typography>
                <label>
                  <Checkbox
                    checked={this.state.hideCompleted}
                    onClick={this.toggleHideCompleted.bind(this)}
                  />Hide Completed Tasks
                </label>
              </Typography>
              </Grid>

            </Grid>

        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);
