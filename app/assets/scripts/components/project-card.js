'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { parseProjectDate } from '../utils/date';
import slugify from '../utils/slugify';

function categoryLink (base, categoryName) {
  return path.resolve(base, 'category', slugify(categoryName));
}

function isOntime (project) {
  let planned = parseProjectDate(project.planned_end_date);
  let actual = parseProjectDate(project.actual_end_date);
  if (!actual || !planned) {
    return null;
  } else if (actual > planned) {
    return false;
  } else {
    return true;
  }
}

var ProjectCard = React.createClass({
  displayName: 'ProjectCard',

  propTypes: {
    lang: React.PropTypes.string,
    project: React.PropTypes.object
  },

  render: function () {
    const project = this.props.project;
    const ontime = isOntime(project);
    const basepath = '/' + this.props.lang;
    return (
      <div className='project'>
        <article className={'card project--' + ontime ? 'ontime' : 'delayed'}>
          <div className='card__contents'>
            <header className='card__header'>
              <h1 className='card__title heading--small'><Link to={path.resolve(basepath, 'projects', project.id)} className='link--deco' href=''>{project.name}</Link></h1>

              <ul className='card-cmplt'>
                <li><span>60% cmplt</span></li>
              </ul>
            </header>
            <div className='card__body'>
              <dl className='card-meta'>
                <dt className='card-meta__label'>Status</dt>
                <dd className='card-meta__value card-meta__value--status'>{ontime ? 'On Time' : 'Delayed'}</dd>
                <dt className='card-meta__label'>Location</dt>
                <dd className='card-meta__value card-meta__value--location'>{project.location.map((loc) => loc.district.governorate).join(', ')}</dd>
              </dl>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante.</p>
              <div className='card__categories'>
                {project.categories.map((c, i) => {
                  return (
                    <span key={i} className='card__subtitle'>
                      <Link to={categoryLink(basepath, c)} className='link--secondary' href=''>{c},</Link>
                    </span>
                  );
                })}
              </div>
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
module.exports.isOntime = isOntime;
