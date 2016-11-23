'use strict';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import Map from '../components/map';
import { getProject } from '../actions';
import slugify from '../utils/slugify';
import { isOntime } from '../components/project-card';
import { formatDate } from '../utils/date';
import { tally, shortTally } from '../utils/format';

function categoryLink (base, categoryName) {
  return path.resolve(base, 'category', slugify(categoryName));
}

var Project = React.createClass({
  displayName: 'Project',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    api: React.PropTypes.object,
    meta: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(getProject(this.props.params.id));
  },

  render: function () {
    const meta = get(this.props.api, ['projectDetail', this.props.params.id]);
    if (!meta) {
      return <div></div>; // TODO loading indicator
    }
    const data = meta.data;
    console.log(data);
    const basepath = '/' + this.props.meta.lang;
    const ontime = isOntime(data);
    const lastUpdated = formatDate(meta.updated_at) || '';
    const budget = get(data, 'budget', []).reduce((a, b) => {
      return a + get(b, 'fund.amount', 0);
    }, 0);

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
             <div className='inpage__headline-actions'>
              <ul>
                <li><button className='button button--medium button--primary button--download'>Download</button></li>
                <li><button className='button button--medium button--primary'>Share</button></li>
              </ul>
              </div>
              <h1 className='inpage__title heading--deco heading--large'>{meta.name}</h1>
              <div>
                {get(data, 'category', []).map((category, i) => <span key={i} className='inpage__subtitle'>
                  <Link to={categoryLink(basepath, category)} className='link--secondary' href=''>{category}</Link>&nbsp;
                </span>)}
              </div>
              <dl className={'inpage-meta project--' + ontime ? 'ontime' : 'delayed'}>
                <dt className='inpage-meta__label visually-hidden'>Status</dt>
                <dd className='inpage-meta__value inpage-meta__value--status'>{ontime ? 'On time' : 'Delayed'}</dd>
                <dt className='inpage-meta__label'>Last Update: </dt>
                <dd className='inpage-meta__value'>&nbsp;{lastUpdated}</dd>
              </dl>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <section className='inpage__section inpage__section--overview'>
              <h1 className='visually-hidden'>Project Overview</h1>
              <div className='inpage__col--map'>
                <Map />
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li>${shortTally(budget)} <small>Funding</small></li>
                  <li>{tally(data.number_served.number_served)} <small>{data.number_served.number_served_unit}</small></li>
                </ul>

                <div className='inpage__overview-links'>
                  <h2 className='overview-item__title heading-alt'>Objective</h2>
                  <ul>
                    <li>{data.description}</li>
                  </ul>

                <div className='overview-item'>
                  <h1 className='overview-item__title heading-alt'>Location</h1>
                  <ul className='link-list'>
                    {get(data, 'location', []).map((loc, i) => {
                      const display = loc.district.district || loc.district.governorate;
                      return (
                        <li key={i}>
                          <a href='' className='link--primary'><span>{display}</span></a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>Project Link</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Source</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>Responsible Party</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Responsible Party</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>Responsible Party</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>{data.responsible_ministry}</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>SDG Indicator</h2>
                  <ul className='link-list'>
                    {get(data, 'sdg_indicator', []).map((indicator, i) => {
                      return (
                        <li key={i}>
                          <a href='' className='link--primary'><span>{indicator}</span></a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>SDS Indicator</h2>
                  <ul className='link-list'>
                    {get(data, 'sds_indicator', []).map((indicator, i) => {
                      return (
                        <li key={i}>
                          <a href='' className='link--primary'><span>{indicator}</span></a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                </div>
              </div>
            </section>
            <section className='inpage__section inpage__section--charts'>
            </section>
            <section className='inpage__section inpage__section--indicators'>
              <h1 className='section__title heading--small'>Monitoring Indicators</h1>
              <table className='inpage__table'>
                <thead>
                  <tr>
                    <th className='row-name'>Name and Description</th>
                    <th className='row-kpi'>KPI</th>
                    <th className='row-target'>Target</th>
                    <th className='row-date'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='project--ontime'>
                      <p className='card-meta__value--status activity-name'>Activity Name</p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante.
                    </td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                    <td>02/20/16</td>
                  </tr>
                  <tr>
                    <td className='project--ontime'>
                      <p className='card-meta__value--status activity-name'>Activity Name</p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante.
                    </td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                    <td>02/20/16</td>
                  </tr>
                  <tr>
                    <td className='project--ontime'>
                      <p className='card-meta__value--status activity-name'>Activity Name</p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante.
                    </td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                    <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                    <td>02/20/16</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className='inpage__section inpage__section--comparison'>
              <h1 className='section__title heading--small'>Project Comparison By Cateogry</h1>
            </section>
          </div>
          <section className='inpage__section--bleed'>
            <div className='inner'>
              <h1 className='section__title heading--small'>Related Projects By SDS Goal</h1>
              <ul className='projects-list'>
                <li className='projects-list__card'>
                  <div>
                    <article className='card project--ontime'>
                      <div className='card__contents'>
                        <header className='card__header'>
                          <p className='card__subtitle'><a className='link--secondary' href=''>Category</a></p>
                          <h1 className='card__title heading--small'><a className='link--deco' href=''>Project Name</a></h1>

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
                </li>

                <li className='projects-list__card'>
                  <div>
                    <article className='card project--ontime'>
                      <div className='card__contents'>
                        <header className='card__header'>
                          <p className='card__subtitle'><a className='link--secondary' href=''>Category</a></p>
                          <h1 className='card__title heading--small'><a className='link--deco' href=''>Project Name</a></h1>

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
                </li>

                <li className='projects-list__card'>
                  <div>
                    <article className='card project--ontime'>
                      <div className='card__contents'>
                        <header className='card__header'>
                          <p className='card__subtitle'><a className='link--secondary' href=''>Category</a></p>
                          <h1 className='card__title heading--small'><a className='link--deco' href=''>Project Name</a></h1>

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
                </li>

              </ul>
            </div>
          </section>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function mapStateToProps (state) {
  return {
    api: state.api,
    meta: state.meta
  };
}

module.exports = connect(mapStateToProps)(Project);
