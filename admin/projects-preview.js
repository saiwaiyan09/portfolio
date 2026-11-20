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

  function makeLink(url, label, key) {
    return hasText(url)
      ? window.h(
          'a',
          { className: 'projects-preview__link', href: url, target: '_blank', rel: 'noopener noreferrer', key: key },
          label
        )
      : null;
  }

  var ProjectsPreview = window.createClass({
    render: function () {
      var entry = this.props.entry;
      var projects = toArray(entry.getIn(['data', 'projects']));

      return window.h(
        'main',
        { className: 'projects-preview' },
        window.h(
          'header',
          { className: 'projects-preview__header' },
          window.h('p', { className: 'projects-preview__eyebrow' }, getValue(entry, ['data', 'eyebrow'])),
          window.h(
            'h1',
            {},
            getValue(entry, ['data', 'heading', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'projects-preview__accent' },
              getValue(entry, ['data', 'heading', 'highlight'])
            )
          ),
          window.h('p', { className: 'projects-preview__description' }, getValue(entry, ['data', 'description']))
        ),
        projects.length
          ? window.h(
              'div',
              { className: 'projects-preview__grid' },
              projects.map(function (project, index) {
                var name = getItemValue(project, 'name') || '';
                var category = getItemValue(project, 'category');
                var status = getItemValue(project, 'status');
                var image = getItemValue(project, 'image');
                var technologies = toArray(getItemValue(project, 'technologies'));
                var tags = toArray(getItemValue(project, 'tags'));
                var architectureSteps = toArray(getValue(project, ['architecture', 'steps']));
                var architecture = architectureSteps.length > 0;
                var statusLabel = architecture && status === 'Planned' ? 'Planned architecture' : status;
                var links = [
                  makeLink(getItemValue(project, 'github_url'), 'GitHub', 'github'),
                  makeLink(getItemValue(project, 'live_demo_url'), 'Live Demo', 'demo')
                ].filter(Boolean);

                return window.h(
                  'article',
                  {
                    className: architecture
                      ? 'projects-preview__card projects-preview__card--featured'
                      : 'projects-preview__card',
                    key: index
                  },
                  hasText(image) &&
                    window.h('img', { className: 'projects-preview__image', src: image, alt: name }),
                  window.h(
                    'div',
                    { className: 'projects-preview__meta' },
                    hasText(category) && window.h('span', { className: 'projects-preview__category' }, category),
                    hasText(statusLabel) && window.h('span', { className: 'projects-preview__status' }, statusLabel)
                  ),
                  window.h('h2', {}, name),
                  window.h('p', { className: 'projects-preview__prose' }, getItemValue(project, 'description') || ''),
                  (technologies.length > 0 || tags.length > 0) &&
                    window.h(
                      'ul',
                      { className: 'projects-preview__tags', 'aria-label': 'Technologies and tags' },
                      technologies.concat(tags).map(function (tag, tagIndex) {
                        return window.h('li', { key: tagIndex }, tag);
                      })
                    ),
                  links.length > 0 && window.h('nav', { className: 'projects-preview__links', 'aria-label': 'Project links' }, links),
                  architecture &&
                    window.h(
                      'section',
                      { className: 'projects-preview__architecture' },
                      window.h('p', { className: 'projects-preview__eyebrow' }, getValue(project, ['architecture', 'eyebrow'])),
                      window.h('h3', {}, getValue(project, ['architecture', 'heading'])),
                      window.h(
                        'ol',
                        {},
                        architectureSteps.map(function (step, stepIndex) {
                          return window.h(
                            'li',
                            { key: stepIndex },
                            window.h('strong', {}, getItemValue(step, 'title')),
                            window.h('p', {}, getItemValue(step, 'description'))
                          );
                        })
                      ),
                      window.h('p', { className: 'projects-preview__note' }, getValue(project, ['architecture', 'note']))
                    )
                );
              })
            )
          : window.h('p', { className: 'projects-preview__empty' }, 'No projects are currently listed.')
      );
    }
  });

  window.CMS.registerPreviewStyle(new URL('projects-preview.css', window.location.href).href);
  window.CMS.registerPreviewTemplate('projects', ProjectsPreview);
})();
