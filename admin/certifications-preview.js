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

  var CertificationsPreview = window.createClass({
    render: function () {
      var entry = this.props.entry;
      var certifications = toArray(entry.getIn(['data', 'certifications']));

      return window.h(
        'main',
        { className: 'certifications-preview' },
        window.h(
          'header',
          { className: 'certifications-preview__header' },
          window.h('p', { className: 'certifications-preview__eyebrow' }, getValue(entry, ['data', 'eyebrow'])),
          window.h(
            'h1',
            {},
            getValue(entry, ['data', 'heading', 'before']),
            ' ',
            window.h(
              'span',
              { className: 'certifications-preview__accent' },
              getValue(entry, ['data', 'heading', 'highlight'])
            )
          ),
          window.h('p', { className: 'certifications-preview__description' }, getValue(entry, ['data', 'description']))
        ),
        certifications.length
          ? window.h(
              'div',
              { className: 'certifications-preview__grid' },
              certifications.map(function (certification, index) {
                var name = getItemValue(certification, 'name') || '';
                var issuer = getItemValue(certification, 'issuer');
                var issueDate = getItemValue(certification, 'issue_date');
                var expirationDate = getItemValue(certification, 'expiration_date');
                var credentialId = getItemValue(certification, 'credential_id');
                var verificationUrl = getItemValue(certification, 'verification_url');
                var badge = getItemValue(certification, 'badge');
                var status = getItemValue(certification, 'status');
                var details = [
                  { label: 'Issue date', value: issueDate },
                  { label: 'Expiration date', value: expirationDate },
                  { label: 'Credential ID', value: credentialId }
                ].filter(function (detail) {
                  return hasText(detail.value);
                });

                return window.h(
                  'article',
                  { className: 'certifications-preview__card', key: index },
                  hasText(badge) && window.h('img', { className: 'certifications-preview__badge', src: badge, alt: name }),
                  hasText(status) && window.h('span', { className: 'certifications-preview__status' }, status),
                  window.h('h2', {}, name),
                  hasText(issuer) && window.h('p', { className: 'certifications-preview__issuer' }, issuer),
                  details.length > 0 &&
                    window.h(
                      'dl',
                      { className: 'certifications-preview__details' },
                      details.map(function (detail, detailIndex) {
                        return window.h(
                          'div',
                          { key: detailIndex },
                          window.h('dt', {}, detail.label),
                          window.h('dd', {}, detail.value)
                        );
                      })
                    ),
                  hasText(verificationUrl) &&
                    window.h(
                      'a',
                      {
                        className: 'certifications-preview__link',
                        href: verificationUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      },
                      'Verify credential'
                    )
                );
              })
            )
          : window.h(
              'article',
              { className: 'certifications-preview__empty' },
              window.h('h2', {}, getValue(entry, ['data', 'empty_state', 'heading'])),
              window.h('p', {}, getValue(entry, ['data', 'empty_state', 'description']))
            )
      );
    }
  });

  window.CMS.registerPreviewStyle(new URL('certifications-preview.css', window.location.href).href);
  window.CMS.registerPreviewTemplate('certifications', CertificationsPreview);
})();
