(function () {
  function getValue(entry, path) {
    var value = entry.getIn(path);
    return value == null ? '' : value;
  }

  function getItemValue(item, key) {
    if (item && typeof item.get === 'function') {
      return item.get(key);
    }
    return item && item[key];
  }

  function toArray(value) {
    if (value && typeof value.toArray === 'function') {
      return value.toArray();
    }
    return Array.isArray(value) ? value : [];
  }

  function hasText(value) {
    return value != null && String(value).trim() !== '';
  }

  var ExperiencePreview = window.createClass({
    render: function () {
      var entry = this.props.entry;
      var entries = toArray(entry.getIn(['data', 'entries']));

      return window.h(
        'main',
        { className: 'experience-preview' },
        window.h(
          'header',
          { className: 'experience-preview__header' },
          window.h('p', { className: 'experience-preview__eyebrow' }, getValue(entry, ['data', 'eyebrow'])),
          window.h(
            'h1',
            {},
            getValue(entry, ['data', 'heading', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'experience-preview__accent' },
              getValue(entry, ['data', 'heading', 'highlight'])
            )
          ),
          window.h('p', { className: 'experience-preview__description' }, getValue(entry, ['data', 'description']))
        ),
        entries.length
          ? window.h(
              'ol',
              { className: 'experience-preview__timeline' },
              entries.map(function (item, index) {
                var meta = [
                  getItemValue(item, 'job_title'),
                  getItemValue(item, 'company'),
                  getItemValue(item, 'employment_dates'),
                  getItemValue(item, 'location')
                ].filter(hasText);
                var responsibilities = toArray(getItemValue(item, 'responsibilities'));
                var technologies = toArray(getItemValue(item, 'technologies'));
                var description = getItemValue(item, 'description');

                return window.h(
                  'li',
                  { className: 'experience-preview__item', key: index },
                  window.h(
                    'article',
                    { className: 'experience-preview__card' },
                    hasText(getItemValue(item, 'eyebrow')) &&
                      window.h('p', { className: 'experience-preview__item-label' }, getItemValue(item, 'eyebrow')),
                    window.h('h2', {}, getItemValue(item, 'title')),
                    meta.length > 0 &&
                      window.h(
                        'p',
                        { className: 'experience-preview__meta' },
                        meta.map(function (value, metaIndex) {
                          return window.h('span', { key: metaIndex }, value);
                        })
                      ),
                    hasText(description) && window.h('p', { className: 'experience-preview__prose' }, description),
                    responsibilities.length > 0 &&
                      window.h(
                        'ul',
                        { className: 'experience-preview__highlights' },
                        responsibilities.map(function (responsibility, responsibilityIndex) {
                          return window.h('li', { key: responsibilityIndex }, responsibility);
                        })
                      ),
                    technologies.length > 0 &&
                      window.h(
                        'ul',
                        { className: 'experience-preview__technologies', 'aria-label': 'Technologies' },
                        technologies.map(function (technology, technologyIndex) {
                          return window.h('li', { key: technologyIndex }, technology);
                        })
                      )
                  )
                );
              })
            )
          : window.h('p', { className: 'experience-preview__empty' }, 'No experience entries are currently listed.')
      );
    }
  });

  window.CMS.registerPreviewStyle(new URL('experience-preview.css', window.location.href).href);
  window.CMS.registerPreviewTemplate('experience', ExperiencePreview);
})();
