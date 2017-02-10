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
  console.log(projects)
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

const donorHeaders = [['donor', 'value']];

export function donors (donors) {
  return donorHeaders.concat(donors.map(d => [
    d.name,
    d.value
  ]));
}

const disbursementHeaders = [['name', 'donor', 'type', 'value']];

export function disbursement (disbursement) {
  return disbursementHeaders.concat(disbursement.map(d => [
    d.name,
    d.donor,
    d.type,
    d.value
  ]));
}

const fundingByCatHeaders = [['name', 'value', 'link']];

export function fundingByCat (budgets) {
  return fundingByCatHeaders.concat(budgets.map(b => [
    b.name,
    b.value,
    'https://map-egypt.github.io/#' + b.link
  ]));
}

const percentCompleteByCatHeaders = [['name', 'value', 'link']];

export function percentCompleteByCat (completion) {
  return percentCompleteByCatHeaders.concat(completion.map(c => [
    c.name,
    c.value,
    'https://map-egypt.github.io/#' + c.link
  ]));
}

const beneficiariesByCatHeaders = [['name', 'value', 'link']];

export function beneficiariesByCat (beneficiaries) {
  return beneficiariesByCatHeaders.concat(beneficiaries.map(b => [
    b.name,
    b.value,
    'https://map-egypt.github.io/#' + b.link
  ]));
}

export function serialize (list) {
  return list.map(row => {
    return row.map(item => {
      let out = typeof item === 'string' ? '"' + item + '"' : item;
      return out;
    }).join(',');
  }).join('\n');
}
