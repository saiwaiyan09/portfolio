(function () {
  function getText(entry, path) {
    var value = entry.getIn(path);
    return value == null ? '' : value;
  }

  function toArray(value) {
    if (value && typeof value.toArray === 'function') {
      return value.toArray();
    }
    return Array.isArray(value) ? value : [];
  }

  function getItemText(item, key) {
    if (item && typeof item.get === 'function') {
      return item.get(key) || '';
    }
    return item && item[key] || '';
  }

  var SkillsPreview = window.createClass({
    render: function () {
      var entry = this.props.entry;
      var categories = toArray(entry.getIn(['data', 'categories']));

      return window.h(
        'main',
        { className: 'skills-preview' },
        window.h(
          'header',
          { className: 'skills-preview__header' },
          window.h('p', { className: 'skills-preview__eyebrow' }, getText(entry, ['data', 'eyebrow'])),
          window.h(
            'h1',
            {},
            getText(entry, ['data', 'heading', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'skills-preview__accent' },
              getText(entry, ['data', 'heading', 'highlight'])
            )
          ),
          window.h('p', { className: 'skills-preview__description' }, getText(entry, ['data', 'description']))
        ),
        window.h(
          'div',
          { className: 'skills-preview__grid' },
          categories.map(function (category, categoryIndex) {
            var skills = toArray(getItemText(category, 'skills'));

            return window.h(
              'article',
              { className: 'skills-preview__card', key: categoryIndex },
              window.h(
                'div',
                { className: 'skills-preview__icon', 'aria-hidden': 'true' },
                getItemText(category, 'icon')
              ),
              window.h('h2', {}, getItemText(category, 'name')),
              window.h(
                'ul',
                {},
                skills.map(function (skill, skillIndex) {
                  return window.h('li', { key: skillIndex }, skill);
                })
              )
            );
          })
        )
      );
    }
  });

  window.CMS.registerPreviewStyle(new URL('skills-preview.css', window.location.href).href);
  window.CMS.registerPreviewTemplate('skills', SkillsPreview);
})();
