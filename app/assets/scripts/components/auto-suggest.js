'use strict';
import React from 'react';
import Autosuggest from 'react-autosuggest';

const Auto = React.createClass({
  displayName: 'AutoSuggest',
  propTypes: {
    suggestions: React.PropTypes.array,
    getDisplayName: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      value: '',
      active: []
    };
  },

  getSuggestions: function ({value}) {
    const input = value.trim().toLowerCase();
    const inputLength = input.length;
    if (inputLength <= 1) {
      return [];
    }
    const getName = this.props.getDisplayName;
    return this.props.suggestions.filter((s) => getName(s).toLowerCase().slice(0, inputLength) === input);
  },

  onSuggestionsFetch: function (value) {
    this.setState({
      active: this.getSuggestions(value)
    });
  },

  onSuggestionsClear: function () {
    this.setState({
      active: []
    });
  },

  onChange: function (event, data) {
    this.setState({
      value: data.newValue
    });
  },

  renderSuggestion: function (suggestion) {
    return (
      <div>
        {this.props.getDisplayName(suggestion)}
      </div>
    );
  },

  render: function () {
    const {
      active,
      value
    } = this.state;

    const { placeholder } = this.props;
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Autosuggest
          suggestions={active}
          onSuggestionsFetchRequested={this.onSuggestionsFetch}
          onSuggestionsClearRequested={this.onSuggestionsClear}
          getSuggestionValue={this.props.getDisplayName}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.props.onSelect}
        />
      </div>
    );
  }
});

module.exports = Auto;
