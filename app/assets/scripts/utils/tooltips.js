export function indicatorTooltipContent (indicator) {
  return `${(indicator.description) ? `<span class="tooltip__description">Description: ${indicator.description}</span>` : ''}` +
    `${(indicator.sources) ? `<span class="tooltip__sources">Sources: ${indicator.sources.join(', ')}</span>` : ''}`;
}
