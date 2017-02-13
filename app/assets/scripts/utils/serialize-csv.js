'use strict';
import { get } from 'object-path';
import { isOntime } from '../components/project-card';
import getLocation from './location';

function location (location, lang) {
  const l = location.map(l => {
    let location = getLocation(l, lang);
    return location ? location.display : false;
  }).filter(Boolean).join(', ');
  return l;
}

const relatedProjectHeaders = [['name', 'id', 'status', 'location', 'budget',
  'households', 'categories', 'description']];

export function relatedProjects (projects, lang) {
  return relatedProjectHeaders.concat(projects.map(p => [
    p.name,
    p.id,
    isOntime(p),
    location(get(p, 'location', [])),
    get(p, 'budget', []).reduce((a, b) => a + get(b, 'fund.amount', 0), 0),
    get(p, 'number_served.number_served'),
    get(p, 'categories', []).map(c => c[lang]).join(', '),
    p.description
  ]));
}

const projectHeaders = [['name', 'id', 'status', 'location', 'budget',
  'households', 'categories', 'donors', 'link', 'responsible ministry',
  'local manager', 'sdg goals', 'sds pillars', 'objective']];

export function project (p, lang) {
  return projectHeaders.concat([[
    p.name,
    p.id,
    isOntime(p),
    location(get(p, 'location', [])),
    get(p, 'budget', []).reduce((a, b) => a + get(b, 'fund.amount', 0), 0),
    get(p, 'number_served.number_served'),
    get(p, 'category', []).map(c => c[lang]).join(', '),
    get(p, 'budget', []).map(d => d.donor_name).join(', '),
    p.project_link,
    get(p, 'responsible_ministry.' + lang),
    p.local_manager,
    get(p, 'sdg_indicator', []).map(d => d[lang] || d['en']).join(', '),
    get(p, 'sds_indicator', []).map(d => d[lang] || d['en']).join(', '),
    p.description
  ]]);
}

export function serialize (list) {
  return list.map(row => {
    return row.map(item => {
      let out = typeof item === 'string' ? '"' + item + '"' : item;
      return out;
    }).join(',');
  }).join('\n');
}
