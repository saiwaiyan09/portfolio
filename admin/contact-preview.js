(function () {
  function getValue(item, path) {
    if (item && typeof item.getIn === 'function') {
      var immutableValue = item.getIn(path);
      return immutableValue == null ? '' : immutableValue;
    }
    return path.reduce(function (value, key) {
      return value == null ? undefined : value[key];
    }, item);
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

  function contactCard(label, prompt, unconfiguredLabel, value, type) {
    if (!hasText(value)) {
      return window.h(
        'div',
        { className: 'contact-preview__card contact-preview__card--inactive' },
        window.h('strong', {}, label),
        window.h('p', {}, prompt),
        window.h('span', {}, unconfiguredLabel)
      );
    }

    return window.h(
      'a',
      {
        className: 'contact-preview__card',
        href: type === 'email' ? 'mailto:' + value : value,
        target: type === 'email' ? undefined : '_blank',
        rel: type === 'email' ? undefined : 'noopener noreferrer'
      },
      window.h('strong', {}, label),
      window.h('p', {}, value)
    );
  }

  var ContactPreview = window.createClass({
    render: function () {
      var entry = this.props.entry;
      var unconfiguredLabel = getValue(entry, ['data', 'unconfigured_label']);
      var socialLinks = toArray(entry.getIn(['data', 'social_links']));
      var location = getValue(entry, ['data', 'location']);
      var availability = getValue(entry, ['data', 'availability']);

      return window.h(
        'main',
        { className: 'contact-preview' },
        window.h(
          'header',
          { className: 'contact-preview__header' },
          window.h('p', { className: 'contact-preview__eyebrow' }, getValue(entry, ['data', 'eyebrow'])),
          window.h(
            'h1',
            {},
            getValue(entry, ['data', 'heading', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'contact-preview__accent' },
              getValue(entry, ['data', 'heading', 'highlight'])
            )
          ),
          window.h('p', { className: 'contact-preview__description' }, getValue(entry, ['data', 'description']))
        ),
        window.h(
          'div',
          { className: 'contact-preview__grid' },
          contactCard(
            getValue(entry, ['data', 'channels', 'email', 'label']),
            getValue(entry, ['data', 'channels', 'email', 'prompt']),
            unconfiguredLabel,
            getValue(entry, ['data', 'channels', 'email', 'address']),
            'email'
          ),
          contactCard(
            getValue(entry, ['data', 'channels', 'linkedin', 'label']),
            getValue(entry, ['data', 'channels', 'linkedin', 'prompt']),
            unconfiguredLabel,
            getValue(entry, ['data', 'channels', 'linkedin', 'url']),
            'external'
          ),
          contactCard(
            getValue(entry, ['data', 'channels', 'github', 'label']),
            getValue(entry, ['data', 'channels', 'github', 'prompt']),
            unconfiguredLabel,
            getValue(entry, ['data', 'channels', 'github', 'url']),
            'external'
          ),
          socialLinks.map(function (social, index) {
            return hasText(getItemValue(social, 'label')) && hasText(getItemValue(social, 'url'))
              ? window.h(
                  'a',
                  {
                    className: 'contact-preview__card',
                    href: getItemValue(social, 'url'),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    key: index
                  },
                  window.h('strong', {}, getItemValue(social, 'label')),
                  window.h('p', {}, getItemValue(social, 'url'))
                )
              : null;
          })
        ),
        (hasText(location) || hasText(availability)) &&
          window.h(
            'div',
            { className: 'contact-preview__extra' },
            hasText(location) && window.h('p', {}, window.h('strong', {}, 'Location: '), location),
            hasText(availability) && window.h('p', { className: 'contact-preview__availability' }, availability)
          )
      );
    }
  });

  window.CMS.registerPreviewStyle(new URL('contact-preview.css', window.location.href).href);
  window.CMS.registerPreviewTemplate('contact', ContactPreview);
})();
