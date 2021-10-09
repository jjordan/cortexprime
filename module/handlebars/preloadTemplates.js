export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'actor-sheet/sidebar',
    'actor-sheet/simple-traits',
    'actor-sheet/temporary-traits',
    'actor-sheet/traits',
    'actor-sheet/traits-edit',
    'actor-sheet/trait-set-edit',
    'actor-sheet/trait-sets',
    'breadcrumbs',
    'dice/select',
    'dice/select-options',
    'pp',
    'remove-button',
    'reorder',
    'settings/actor-types',
    'settings/actor-type',
    'settings/trait',
    'settings/trait-set',
    'settings/simple-trait',
    'settings/value-types/descriptors',
    'settings/value-types/dice',
    'settings/value-types/number',
    'settings/value-types/sfx',
    'settings/value-types/sub-traits',
    'settings/value-types/text',
    'value-types/descriptors',
    'value-types/dice',
    'value-types/number',
    'value-types/sfx',
    'value-types/sub-traits',
    'value-types/text',
  ]
    .map(template => `systems/cortexprime/templates/partials/${template}.html`)

  return loadTemplates(templatePaths)
}
