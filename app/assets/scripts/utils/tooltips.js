import { get } from 'object-path';
export function indicatorTooltipContent (indicator, lang) {
  const t = get(window.t, [lang, 'map_labels'], {});
  const indicatorDescription = lang === 'en' ? indicator.description : indicator.description_ar;
  return `${(indicator.description) !== null ? `<span class="tooltip__description">${t.description_label}: ${indicatorDescription}</span>` : ''}` +
    `${(indicator.sources) ? `<span class="tooltip__sources">Sources: ${indicator.sources.join(', ')}</span>` : ''}`;
}
