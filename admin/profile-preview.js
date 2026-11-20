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

  var ProfilePreview = window.createClass({
    render: function () {
      var entry = this.props.entry;
      var paragraphs = toArray(entry.getIn(['data', 'about', 'paragraphs']));
      var stats = toArray(entry.getIn(['data', 'about', 'stats']));

      return window.h(
        'main',
        { className: 'profile-preview' },
        window.h(
          'section',
          { className: 'profile-preview__hero', 'aria-labelledby': 'profile-preview-title' },
          window.h('p', { className: 'profile-preview__eyebrow' }, 'Cloud Infrastructure / DevOps'),
          window.h('h1', { id: 'profile-preview-title' }, getText(entry, ['data', 'name'])),
          window.h(
            'p',
            { className: 'profile-preview__headline' },
            getText(entry, ['data', 'headline', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'profile-preview__accent' },
              getText(entry, ['data', 'headline', 'highlight'])
            ),
            ' ',
            getText(entry, ['data', 'headline', 'after'])
          ),
          window.h('p', { className: 'profile-preview__summary' }, getText(entry, ['data', 'summary']))
        ),
        window.h(
          'section',
          { className: 'profile-preview__section', 'aria-labelledby': 'profile-preview-about-title' },
          window.h(
            'h2',
            { id: 'profile-preview-about-title' },
            getText(entry, ['data', 'about', 'heading', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'profile-preview__accent' },
              getText(entry, ['data', 'about', 'heading', 'highlight'])
            )
          ),
          window.h(
            'div',
            { className: 'profile-preview__prose' },
            paragraphs.map(function (paragraph, index) {
              return window.h('p', { key: index }, paragraph);
            })
          )
        ),
        window.h(
          'section',
          { className: 'profile-preview__section', 'aria-labelledby': 'profile-preview-stats-title' },
          window.h('h2', { id: 'profile-preview-stats-title' }, 'Experience & focus'),
          window.h(
            'div',
            { className: 'profile-preview__stats' },
            stats.map(function (stat, index) {
              return window.h(
                'article',
                { className: 'profile-preview__stat', key: index },
                window.h('strong', {}, getItemText(stat, 'value')),
                window.h('span', {}, getItemText(stat, 'label'))
              );
            })
          )
        ),
        window.h(
          'aside',
          { className: 'profile-preview__note', 'aria-label': 'Profile note' },
          window.h('p', {}, getText(entry, ['data', 'about', 'note']))
        )
      );
    }
  });

  window.CMS.registerPreviewStyle(new URL('profile-preview.css', window.location.href).href);
  window.CMS.registerPreviewTemplate('profile', ProfilePreview);
})();
