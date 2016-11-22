'use strict';
import React from 'react';

var ProjectCard = React.createClass({
  displayName: 'ProjectCard',

  propTypes: {
  },

  render: function () {
    return (
      <div style={{ width: '20rem' }}>
        <article className='card project--ontime'>
          <div className='card__contents'>
            <header className='card__header'>
              <p className='card__subtitle'><a className='link--secondary' href=''>Category</a></p>
              <h1 className='card__title'><a className='link--deco' href=''>Project Name</a></h1>

              <ul className='card-cmplt'>
                <li><span>60% cmplt</span></li>
              </ul>
            </header>
            <div className='card__body'>
              <dl className='card-meta'>
                <dt className='card-meta__label'>Status</dt>
                <dd className='card-meta__value card-meta__value--status'>On time</dd>
                <dt className='card-meta__label'>Location</dt>
                <dd className='card-meta__value card-meta__value--location'>Location 1, Location 2</dd>
              </dl>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante.</p>

              <ul className='card-stats'>
                <li>$50M <small>funding</small></li>
                <li>20,000 <small>households</small></li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    );
  }
});
module.exports = ProjectCard;
