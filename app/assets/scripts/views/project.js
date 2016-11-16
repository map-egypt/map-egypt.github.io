'use strict';
import React from 'react';
import Map from './map';

var Project = React.createClass({
  displayName: 'Project',

  render: function () {
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
              <p className='inpage__subtitle'><a className='link--secondary' href=''>Category</a></p>
              <h1 className='inpage__title heading--deco heading--large'>Project Name</h1>
              <dl className='inpage-meta project--ontime'>
                <dt className='inpage-meta__label visually-hidden'>Status</dt>
                <dd className='inpage-meta__value inpage-meta__value--status'>On time</dd>
                <dt className='inpage-meta__label'>Last Update: </dt>
                <dd className='inpage-meta__value'> Jun. 30, 2016</dd>
              </dl>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <section className='inpage__section inpage__section--overview'>
              <Map />
              <h1 className='visually-hidden'>Project Overview</h1>
              <div className='inpage__col--map'>
              </div>
              <div className='inpage__col--content'>
                <ul className='inpage-stats'>
                  <li>$50M <small>funding</small></li>
                  <li>20,000 <small>households</small></li>
                </ul>

                <div className='inpage__overview-links'>
                  <h2 className='overview-item__title heading-alt'>Objective</h2>
                  <ul>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In auctor sed leo nec scelerisque. Nullam fermentum ligula vitae elit scelerisque, eget tempus quam tincidunt. Integer porta in est non tempus. Etiam vel arcu urna.</li>
                  </ul>

                <div className='overview-item'>
                  <h1 className='overview-item__title heading-alt'>Location</h1>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Location</span></a></li>
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
                    <li><a href='' className='link--primary'><span>Name of Ministry Department</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>SDG Indicator</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Indicator</span></a></li>
                    <li><a href='' className='link--primary'><span>Name of Indicator</span></a></li>
                  </ul>
                </div>

                <div className='overview-item'>
                  <h2 className='overview-item__title heading-alt'>SDG Indicator</h2>
                  <ul className='link-list'>
                    <li><a href='' className='link--primary'><span>Name of Indicator</span></a></li>
                    <li><a href='' className='link--primary'><span>Name of Indicator</span></a></li>
                  </ul>
                </div>

                </div>
              </div>
            </section>
            <section className='inpage__section inpage__section--charts'>
            </section>
            <section className='inpage__section inpage__section--indicators'>
              <h1 className='section__title heading--medium'>Monitoring Indicators</h1>
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
              <h1 className='section__title heading--medium'>Project Comparison By Cateogry</h1>
            </section>
          </div>
          <section className='inpage__section--bleed'>
            <div className='inner'>
              <h1 className='section__title heading--medium'>Related Projects By SDS Goal</h1>
              <ul className='related-projects'>
                <li className='related-projects-card'>
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

                <li className='related-projects-card'>
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

                <li className='related-projects-card'>
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

export default Project;
