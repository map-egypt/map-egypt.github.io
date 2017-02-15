'use strict';
import React from 'react';
import { get } from 'object-path';
import { connect } from 'react-redux';
import { window } from 'global';

var About = React.createClass({
  displayName: 'About',

  propTypes: {
    meta: React.PropTypes.object
  },

  render: function () {
    const content = get(window, 't.about.' + this.props.meta.lang, {});
    return (
      <section className='inpage'>
        <header className='inpage__header--alt'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title heading--deco heading--large'>{content.title}</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body--alt'>
          <div className='inner'>
            <section>
              {get(content, 'body', []).map((p, i) => {
                let text = p.text ? p.text : p;
                let className = p.class ? p.class : '';
                return <p key={i} className={className}>{text}</p>;
              })}
            </section>
          </div>
        </div>
      </section>
    );
  }
});

function mapStateToProps (state) {
  return {
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(About);
