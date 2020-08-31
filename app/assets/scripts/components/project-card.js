'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { parseProjectDate } from '../utils/date';
import slugify from '../utils/slugify';
import { tally, shortTally, pct, shortParagraph, currency } from '../utils/format';
import getLocation from '../utils/location';
import { getProjectName, getDescription } from '../utils/accessors';

function categoryLink (base, categoryName) {
  return path.resolve(base, 'category', slugify(categoryName));
}

function isOntime (project, lang = 'en') {
  const t = get(window.t, [lang, 'project_pages'], {});

  if (project.status.en.toLowerCase() === 'closed') {
    return t.status_closed;
  }

  let plannedEnd = parseProjectDate(project.planned_end_date);
  let actualEnd = parseProjectDate(project.actual_end_date);
  let plannedStart = parseProjectDate(project.planned_start_date);
  let actualStart = parseProjectDate(project.actual_start_date);

  const projectDelayed = actualStart > plannedStart || (!actualStart && plannedStart && plannedStart < new Date().getTime());
  const projectExtended = (!actualEnd && plannedEnd && plannedEnd < new Date().getTime()) || (actualEnd > plannedEnd);
  // if projects are both delayed and extended, they should be classed as delayed
  if (!plannedStart) {
    return null;
  } else if (plannedStart > new Date().getTime()) {
    return t.status_planned;
  } else if (projectDelayed) {
    return t.status_delayed;
  } else if (projectExtended) {
    return t.status_extended;
  } else {
    return t.status_ontime;
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
    const { project, lang } = this.props;
    const t = get(window.t, [lang, 'project_pages'], {});
    // check project type to set currencyValue
    const currencyValue = project.type === 'international' ? t.currency_international_projects : t.currency_national_projects;
    const ontime = isOntime(project).replace(/\s/g, '').toLowerCase();
    const statusClass = 'project--' + ontime;
    const basepath = '/' + lang;
    const budget = project.budget || [];
    const funding = budget.reduce((a, b) => a + b.fund.amount, 0);
    let completion = pct(percentComplete(project));
    let projects = [];
    let locations = project.location || [];
    locations.map((loc, i) => {
      const location = getLocation(loc, lang);
      if (location) {
        projects.push(location.display);
      }
    });

    return (
      <div className='project'>
        <article className={statusClass}>
          <div className='card__contents'>
            <header className='card__header'>
              <h1 className='card__title heading--xsmall'><Link to={path.resolve(basepath, 'projects', project.id)} className='link--deco' href=''>{getProjectName(project, lang)}</Link></h1>

              {completion && (
                <ul className='card-cmplt'>
                  <li style={{ width: completion }}><span>{completion} {t.status_complete}</span></li>
                </ul>
              )}
            </header>
            <div className='card__body'>
              <dl className='card-meta'>
                {ontime !== 'closed' && ontime !== 'planned'
                  ? <dd className='card-meta__value card-meta__value--timeline'>{project.status[lang]}</dd>
                  : ''}
                {ontime !== 'planned'
                  ? <dd className={'card-meta__value card-meta__value--status ' + statusClass}>{t['status_' + ontime]}</dd>
                  : ''}
                <dd className='card-meta__value card-meta__value--location'>{projects.join(', ')}</dd>
              </dl>
              <p>{shortParagraph(getDescription(project, lang))}</p>
              <div className='card__categories'>
                {project.categories.map((c, i) => {
                  let key = c.en;
                  return (
                    <span key={key} className='card__subtitle'>
                      <Link to={categoryLink(basepath, key)} className='link--secondary' href=''>{c[lang]}</Link>
                    </span>
                  );
                })}
              </div>
              <ul className='card-stats'>
              <li>{currency(currencyValue, shortTally(funding, t))} <small>{t.funding_title}</small></li>
              <li>{tally(project.number_served.number_served)} <small>{ (lang === 'en' ? project.number_served.number_served_unit : project.number_served.number_served_unit_ar).toLowerCase()}</small></li>
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
