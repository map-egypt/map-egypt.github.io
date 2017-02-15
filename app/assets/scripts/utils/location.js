'use strict';
import { get } from 'object-path';
import { byId as districtNames } from './districts';
import { byId as governorateNames } from './governorates';

export default function getLocation (loc, lang) {
  let location;
  const district = get(loc, 'district.district');
  if (district && district.toLowerCase() !== 'all') {
    location = districtNames(district);
  } else {
    location = governorateNames(get(loc, 'district.governorate'));
  }
  if (location) {
    location.display = lang === 'ar' ? get(location, 'nameAr') : get(location, 'name');
  }
  return location;
}
