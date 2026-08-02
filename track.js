/* Arnav Telecom — unified conversion tracking (GA4 + Facebook Pixel)
   Fires on: phone call clicks, WhatsApp clicks, directions clicks, lead form submits. */
(function () {
    'use strict';

    function ga(eventName, params) {
        if (typeof gtag === 'function') gtag('event', eventName, params || {});
    }
    function fb(eventName, params, custom) {
        if (typeof fbq !== 'function') return;
        if (custom) fbq('trackCustom', eventName, params || {});
        else fbq('track', eventName, params || {});
    }

    document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a') : null;
        if (!a || !a.href) return;
        var href = a.href;
        var page = location.pathname;

        if (href.indexOf('tel:') === 0) {
            var num = href.replace('tel:', '');
            ga('phone_call', { phone_number: num, page_path: page });
            fb('Contact', { content_name: 'phone_call', content_category: num });
        } else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
            ga('whatsapp_click', { link_url: href, page_path: page });
            fb('Contact', { content_name: 'whatsapp' });
        } else if (href.indexOf('maps.google') !== -1 || href.indexOf('google.com/maps') !== -1) {
            ga('get_directions', { link_url: href, page_path: page });
            fb('FindLocation', { content_name: page });
        } else if (href.indexOf('g.page') !== -1) {
            ga('review_click', { page_path: page });
            fb('ReviewClick', { page: page }, true);
        }
    }, true);

    // Lead form success (popup pushes lead_submitted into dataLayer)
    if (window.dataLayer && window.dataLayer.push) {
        var origPush = window.dataLayer.push.bind(window.dataLayer);
        window.dataLayer.push = function () {
            try {
                var arg = arguments[0];
                if (arg && arg.event === 'lead_submitted') {
                    fb('Lead', { content_name: arg.source || 'popup' });
                }
            } catch (err) { /* no-op */ }
            return origPush.apply(null, arguments);
        };
    }
})();
