import { get } from 'object-path';
export function indicatorTooltipContent (indicator, lang) {
  const t = get(window.t, [lang, 'map_labels'], {});
  const defaultDescriptionLabel = t.description_default_value;
  const indicatorDescription = lang === 'en' ? indicator.description : indicator.description_ar;
  return `<span class="tooltip__description">${t.description_label} : &nbsp; ${indicatorDescription !== null ? indicatorDescription : defaultDescriptionLabel}</span>` +
    `${(indicator.sources) ? `<span class="tooltip__sources">Sources: ${indicator.sources.join(', ')}</span>` : ''}`;
}
