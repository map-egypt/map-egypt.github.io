'use strict';
import React from 'react';

var About = React.createClass({
  displayName: 'About',

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header--alt'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title heading--deco heading--large'>About</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body--alt'>
          <div className='inner'>
            <section>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum vulputate nisi, eget viverra ipsum. Suspendisse quis enim id mauris gravida rhoncus. Aliquam massa lectus, finibus ac leo vel, suscipit placerat ante. Morbi eu vehicula nulla. Cras pellentesque volutpat metus, at volutpat purus ultrices sit amet. Proin feugiat at felis et sodales. Donec egestas aliquam ex, vel hendrerit massa bibendum id. Nullam vitae ullamcorper metus. Aliquam est nibh, tristique scelerisque ullamcorper id, aliquet sed magna. Fusce justo sem, laoreet egestas ultricies ut, condimentum viverra lectus. Aenean volutpat lacinia libero, non imperdiet metus convallis id. Nam sollicitudin, velit tempus facilisis ornare, orci orci cursus ex, non convallis erat felis ac orci. Donec eu turpis et elit scelerisque scelerisque. Nunc nec molestie nibh, eu sagittis ex.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum vulputate nisi, eget viverra ipsum. Suspendisse quis enim id mauris gravida rhoncus. Aliquam massa lectus, finibus ac leo vel, suscipit placerat ante. Morbi eu vehicula nulla. Cras pellentesque volutpat metus, at volutpat purus ultrices sit amet. Proin feugiat at felis et sodales. Donec egestas aliquam ex, vel hendrerit massa bibendum id. Nullam vitae ullamcorper metus. Aliquam est nibh, tristique scelerisque ullamcorper id, aliquet sed magna. Fusce justo sem, laoreet egestas ultricies ut, condimentum viverra lectus. Aenean volutpat lacinia libero, non imperdiet metus convallis id. Nam sollicitudin, velit tempus facilisis ornare, orci orci cursus ex, non convallis erat felis ac orci. Donec eu turpis et elit scelerisque scelerisque. Nunc nec molestie nibh, eu sagittis ex.</p>
              <p className='small'>The information provided on this website is not official U.S. Government information and does not represent the views or positions of the U.S. Agency for International Development or the U.S. Government. </p>
            </section>
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default About;
