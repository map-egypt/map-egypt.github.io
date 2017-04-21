'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { parseProjectDate } from '../utils/date';
import slugify from '../utils/slugify';
import { tally, shortTally, pct } from '../utils/format';

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

function percentComplete (project) {
  const end = project.actual_end_date || project.planned_end_date;
  const start = project.actual_start_date;
  if (!end || !start) {
    return 0;
  }
  const now = new Date().getTime();
  const endDate = parseProjectDate(end);
  if (now > endDate) {
    return 100;
  } else {
    let startDate = parseProjectDate(start);
    let period = endDate - startDate;
    let elapsed = now - startDate;
    return Math.round(elapsed / period * 100);
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
    const funding = get(project, 'budget', []).reduce((a, b) => a + b.fund.amount, 0);
    let completion = pct(percentComplete(project));

    return (
      <div className='project'>
        <article className={'card project--' + (ontime ? 'ontime' : 'delayed')}>
          <div className='card__contents'>
            <header className='card__header'>
              <h1 className='card__title heading--small'><Link to={path.resolve(basepath, 'projects', project.id)} className='link--deco' href=''>{project.name}</Link></h1>

              {completion && (
                <ul className='card-cmplt'>
                  <li style={{ width: completion }}><span>{completion} cmplt</span></li>
                </ul>
              )}
            </header>
            <div className='card__body'>
              <dl className='card-meta'>
                <dt className='card-meta__label'>Status</dt>
                <dd className='card-meta__value card-meta__value--status'>{ontime ? 'On Time' : 'Delayed'}</dd>
                <dt className='card-meta__label'>Location</dt>
                <dd className='card-meta__value card-meta__value--location'>{project.location.map((loc) => loc.district.governorate).join(', ')}</dd>
              </dl>
              <p>{project.description}</p>
              <div className='card__categories'>
                {project.categories.map((c) => {
                  return (
                    <span key={c} className='card__subtitle'>
                      <Link to={categoryLink(basepath, c)} className='link--secondary' href=''>{c},</Link>
                    </span>
                  );
                })}
              </div>
              <ul className='card-stats'>
                <li>${shortTally(funding)} <small>funding</small></li>
                <li>{tally(project.number_served.number_served)} <small>{project.number_served.number_served_unit.toLowerCase()}</small></li>
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
module.exports.percentComplete = percentComplete;
