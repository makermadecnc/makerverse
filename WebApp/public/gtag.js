// Copyright 2012 Google Inc. All rights reserved.
(function () {
  var data = {
    resource: {
      version: '1',

      macros: [
        {
          function: '__e',
        },
        {
          vtp_signal: 0,
          function: '__c',
          vtp_value: 0,
        },
        {
          function: '__c',
          vtp_value: '',
        },
        {
          function: '__c',
          vtp_value: 0,
        },
        {
          function: '__aev',
          vtp_varType: 'URL',
          vtp_component: 'IS_OUTBOUND',
          vtp_affiliatedDomains: ['list'],
        },
        {
          function: '__v',
          vtp_name: 'gtm.triggers',
          vtp_dataLayerVersion: 2,
          vtp_setDefaultValue: true,
          vtp_defaultValue: '',
        },
        {
          function: '__v',
          vtp_name: 'gtm.elementId',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.elementClasses',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__aev',
          vtp_varType: 'URL',
          vtp_component: 'URL_NO_FRAGMENT',
        },
        {
          function: '__aev',
          vtp_varType: 'URL',
          vtp_component: 'HOST',
          vtp_stripWww: true,
        },
        {
          function: '__aev',
          vtp_varType: 'URL',
          vtp_component: 'EXTENSION',
        },
        {
          function: '__aev',
          vtp_varType: 'TEXT',
        },
        {
          function: '__aev',
          vtp_varType: 'URL',
          vtp_component: 'PATH',
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoStatus',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoUrl',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoTitle',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoProvider',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoCurrentTime',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoDuration',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoPercent',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.videoVisible',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__u',
          vtp_component: 'QUERY',
          vtp_queryKey: 'q,s,search,query,keyword',
          vtp_multiQueryKeys: true,
          vtp_ignoreEmptyQueryParam: true,
          vtp_enableMultiQueryKeys: false,
          vtp_enableIgnoreEmptyQueryParam: false,
        },
        {
          function: '__v',
          vtp_name: 'gtm.scrollThreshold',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.historyChangeSource',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.oldUrl',
          vtp_dataLayerVersion: 1,
        },
        {
          function: '__v',
          vtp_name: 'gtm.newUrl',
          vtp_dataLayerVersion: 1,
        },
      ],
      tags: [
        {
          function: '__gct',
          vtp_trackingId: 'G-1YYCDQLM0S',
          vtp_sessionDuration: 0,
          vtp_googleSignals: ['macro', 1],
          vtp_foreignTld: ['macro', 2],
          vtp_restrictDomain: ['macro', 3],
          vtp_eventSettings: ['map', 'purchase', ['map', 'blacklisted', false, 'conversion', true]],
          vtp_dynamicEventSettings: ['map', 'edit_rules', ['list'], 'synthesis_rules', ['list']],
          tag_id: 7,
        },
        {
          function: '__get',
          vtp_eventName: 'click',
          vtp_settings: [
            'map',
            'streamId',
            'G-1YYCDQLM0S',
            'eventParameters',
            [
              'map',
              'link_id',
              ['macro', 6],
              'link_classes',
              ['macro', 7],
              'link_url',
              ['macro', 8],
              'link_domain',
              ['macro', 9],
              'outbound',
              true,
            ],
          ],
          vtp_deferrable: false,
          tag_id: 17,
        },
        {
          function: '__get',
          vtp_eventName: 'file_download',
          vtp_settings: [
            'map',
            'streamId',
            'G-1YYCDQLM0S',
            'eventParameters',
            [
              'map',
              'link_id',
              ['macro', 6],
              'link_text',
              ['macro', 11],
              'link_url',
              ['macro', 8],
              'file_name',
              ['macro', 12],
              'file_extension',
              ['macro', 10],
            ],
          ],
          vtp_deferrable: false,
          tag_id: 24,
        },
        {
          function: '__get',
          vtp_eventName: ['template', 'video_', ['macro', 13]],
          vtp_settings: [
            'map',
            'streamId',
            'G-1YYCDQLM0S',
            'eventParameters',
            [
              'map',
              'video_url',
              ['macro', 14],
              'video_title',
              ['macro', 15],
              'video_provider',
              ['macro', 16],
              'video_current_time',
              ['macro', 17],
              'video_duration',
              ['macro', 18],
              'video_percent',
              ['macro', 19],
              'visible',
              ['macro', 20],
            ],
          ],
          vtp_deferrable: false,
          tag_id: 27,
        },
        {
          function: '__get',
          vtp_eventName: 'view_search_results',
          vtp_settings: ['map', 'streamId', 'G-1YYCDQLM0S', 'eventParameters', ['map', 'search_term', ['macro', 21]]],
          vtp_deferrable: true,
          tag_id: 32,
        },
        {
          function: '__get',
          vtp_eventName: 'scroll',
          vtp_settings: [
            'map',
            'streamId',
            'G-1YYCDQLM0S',
            'eventParameters',
            ['map', 'percent_scrolled', ['macro', 22]],
          ],
          vtp_deferrable: false,
          tag_id: 35,
        },
        {
          function: '__get',
          vtp_eventName: 'page_view',
          vtp_settings: ['map', 'streamId', 'G-1YYCDQLM0S', 'eventParameters', ['map', 'page_referrer', ['macro', 24]]],
          vtp_deferrable: false,
          tag_id: 38,
        },
        {
          function: '__dlm',
          vtp_userInput: ['list', ['map', 'key', 'gtm.gtagReferrer.G-1YYCDQLM0S', 'value', ['macro', 24]]],
          tag_id: 39,
        },
        {
          function: '__lcl',
          vtp_waitForTags: false,
          vtp_checkValidation: true,
          vtp_uniqueTriggerId: '1_15',
          tag_id: 40,
        },
        {
          function: '__lcl',
          vtp_waitForTags: false,
          vtp_checkValidation: true,
          vtp_uniqueTriggerId: '1_22',
          tag_id: 41,
        },
        {
          function: '__ytl',
          vtp_captureStart: true,
          vtp_captureComplete: true,
          vtp_captureProgress: true,
          vtp_progressThresholdsPercent: '10,25,50,75',
          vtp_triggerStartOption: 'DOM_READY',
          vtp_uniqueTriggerId: '1_25',
          vtp_enableTriggerStartOption: true,
          tag_id: 42,
        },
        {
          function: '__sdl',
          vtp_verticalThresholdUnits: 'PERCENT',
          vtp_verticalThresholdsPercent: '90',
          vtp_verticalThresholdOn: true,
          vtp_horizontalThresholdOn: false,
          vtp_triggerStartOption: 'WINDOW_LOAD',
          vtp_uniqueTriggerId: '1_33',
          vtp_enableTriggerStartOption: true,
          tag_id: 43,
        },
        {
          function: '__ehl',
          vtp_groupEvents: true,
          vtp_groupEventsInterval: 1000,
          vtp_uniqueTriggerId: '1_36',
          tag_id: 44,
        },
      ],
      predicates: [
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.js',
        },
        {
          function: '_eq',
          arg0: ['macro', 4],
          arg1: true,
        },
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.linkClick',
        },
        {
          function: '_re',
          arg0: ['macro', 5],
          arg1: '(^$|((^|,)1_15($|,)))',
        },
        {
          function: '_re',
          arg0: ['macro', 10],
          arg1: 'pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma',
          ignore_case: true,
        },
        {
          function: '_re',
          arg0: ['macro', 5],
          arg1: '(^$|((^|,)1_22($|,)))',
        },
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.video',
        },
        {
          function: '_re',
          arg0: ['macro', 5],
          arg1: '(^$|((^|,)1_25($|,)))',
        },
        {
          function: '_eq',
          arg0: ['macro', 21],
          arg1: 'undefined',
        },
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.scrollDepth',
        },
        {
          function: '_re',
          arg0: ['macro', 5],
          arg1: '(^$|((^|,)1_33($|,)))',
        },
        {
          function: '_eq',
          arg0: ['macro', 23],
          arg1: ['list', 'pushState', 'popstate', 'replaceState'],
          any_of: true,
        },
        {
          function: '_eq',
          arg0: ['macro', 24],
          arg1: ['macro', 25],
        },
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.historyChange-v2',
        },
        {
          function: '_re',
          arg0: ['macro', 5],
          arg1: '(^$|((^|,)1_36($|,)))',
        },
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.dom',
        },
        {
          function: '_eq',
          arg0: ['macro', 0],
          arg1: 'gtm.load',
        },
      ],
      rules: [
        [
          ['if', 0],
          ['add', 0, 8, 9, 12],
        ],
        [
          ['if', 1, 2, 3],
          ['add', 1],
        ],
        [
          ['if', 2, 4, 5],
          ['add', 2],
        ],
        [
          ['if', 6, 7],
          ['add', 3],
        ],
        [
          ['if', 0],
          ['unless', 8],
          ['add', 4],
        ],
        [
          ['if', 9, 10],
          ['add', 5],
        ],
        [
          ['if', 11, 13, 14],
          ['unless', 12],
          ['add', 6, 7],
        ],
        [
          ['if', 15],
          ['add', 10],
        ],
        [
          ['if', 16],
          ['add', 11],
        ],
      ],
    },
    runtime: [],
  };

  /*

   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
  var aa,
    ba = function (a) {
      var b = 0;
      return function () {
        return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
      };
    },
    ca = function (a) {
      var b = 'undefined' != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      return b ? b.call(a) : { next: ba(a) };
    },
    da =
      'function' == typeof Object.create
        ? Object.create
        : function (a) {
            var b = function () {};
            b.prototype = a;
            return new b();
          },
    ea;
  if ('function' == typeof Object.setPrototypeOf) ea = Object.setPrototypeOf;
  else {
    var ia;
    a: {
      var ja = { a: !0 },
        ka = {};
      try {
        ka.__proto__ = ja;
        ia = ka.a;
        break a;
      } catch (a) {}
      ia = !1;
    }
    ea = ia
      ? function (a, b) {
          a.__proto__ = b;
          if (a.__proto__ !== b) throw new TypeError(a + ' is not extensible');
          return a;
        }
      : null;
  }
  var la = ea,
    oa = function (a, b) {
      a.prototype = da(b.prototype);
      a.prototype.constructor = a;
      if (la) la(a, b);
      else
        for (var c in b)
          if ('prototype' != c)
            if (Object.defineProperties) {
              var d = Object.getOwnPropertyDescriptor(b, c);
              d && Object.defineProperty(a, c, d);
            } else a[c] = b[c];
      a.ui = b.prototype;
    },
    pa = this || self,
    ra = function (a) {
      return a;
    };
  var sa = {},
    ta = function (a, b) {
      sa[a] = sa[a] || [];
      sa[a][b] = !0;
    },
    ua = function (a) {
      for (var b = [], c = sa[a] || [], d = 0; d < c.length; d++) c[d] && (b[Math.floor(d / 6)] ^= 1 << d % 6);
      for (var e = 0; e < b.length; e++)
        b[e] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.charAt(b[e] || 0);
      return b.join('');
    };
  var va = function () {},
    wa = function (a) {
      return 'function' == typeof a;
    },
    g = function (a) {
      return 'string' == typeof a;
    },
    xa = function (a) {
      return 'number' == typeof a && !isNaN(a);
    },
    ya = function (a) {
      var b = '[object Array]' == Object.prototype.toString.call(Object(a));
      Array.isArray ? Array.isArray(a) !== b && ta('TAGGING', 4) : ta('TAGGING', 5);
      return b;
    },
    za = function (a, b) {
      if (Array.prototype.indexOf) {
        var c = a.indexOf(b);
        return 'number' == typeof c ? c : -1;
      }
      for (var d = 0; d < a.length; d++) if (a[d] === b) return d;
      return -1;
    },
    Ba = function (a, b) {
      if (a && ya(a)) for (var c = 0; c < a.length; c++) if (a[c] && b(a[c])) return a[c];
    },
    Ca = function (a, b) {
      if (!xa(a) || !xa(b) || a > b) (a = 0), (b = 2147483647);
      return Math.floor(Math.random() * (b - a + 1) + a);
    },
    Ea = function (a, b) {
      for (var c = new Da(), d = 0; d < a.length; d++) c.set(a[d], !0);
      for (var e = 0; e < b.length; e++) if (c.get(b[e])) return !0;
      return !1;
    },
    Fa = function (a, b) {
      for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c]);
    },
    Ia = function (a) {
      return (
        !!a &&
        ('[object Arguments]' == Object.prototype.toString.call(a) || Object.prototype.hasOwnProperty.call(a, 'callee'))
      );
    },
    Ja = function (a) {
      return Math.round(Number(a)) || 0;
    },
    Ka = function (a) {
      return 'false' == String(a).toLowerCase() ? !1 : !!a;
    },
    Na = function (a) {
      var b = [];
      if (ya(a)) for (var c = 0; c < a.length; c++) b.push(String(a[c]));
      return b;
    },
    Oa = function (a) {
      return a ? a.replace(/^\s+|\s+$/g, '') : '';
    },
    Pa = function () {
      return new Date().getTime();
    },
    Da = function () {
      this.prefix = 'gtm.';
      this.values = {};
    };
  Da.prototype.set = function (a, b) {
    this.values[this.prefix + a] = b;
  };
  Da.prototype.get = function (a) {
    return this.values[this.prefix + a];
  };
  var Ra = function (a, b, c) {
      return a && a.hasOwnProperty(b) ? a[b] : c;
    },
    Sa = function (a) {
      var b = a;
      return function () {
        if (b) {
          var c = b;
          b = void 0;
          try {
            c();
          } catch (d) {}
        }
      };
    },
    Ta = function (a, b) {
      for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    },
    Ua = function (a) {
      for (var b in a) if (a.hasOwnProperty(b)) return !0;
      return !1;
    },
    Va = function (a, b) {
      for (var c = [], d = 0; d < a.length; d++) c.push(a[d]), c.push.apply(c, b[a[d]] || []);
      return c;
    },
    Xa = function (a, b) {
      for (var c = {}, d = c, e = a.split('.'), f = 0; f < e.length - 1; f++) d = d[e[f]] = {};
      d[e[e.length - 1]] = b;
      return c;
    },
    Ya = /^\w{1,9}$/,
    Za = function (a) {
      var b = [];
      Fa(a, function (c, d) {
        Ya.test(c) && d && b.push(c);
      });
      return b.join(',');
    }; /*
 jQuery v1.9.1 (c) 2005, 2012 jQuery Foundation, Inc. jquery.org/license. */
  var $a = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/,
    ab = function (a) {
      if (null == a) return String(a);
      var b = $a.exec(Object.prototype.toString.call(Object(a)));
      return b ? b[1].toLowerCase() : 'object';
    },
    bb = function (a, b) {
      return Object.prototype.hasOwnProperty.call(Object(a), b);
    },
    cb = function (a) {
      if (!a || 'object' != ab(a) || a.nodeType || a == a.window) return !1;
      try {
        if (a.constructor && !bb(a, 'constructor') && !bb(a.constructor.prototype, 'isPrototypeOf')) return !1;
      } catch (c) {
        return !1;
      }
      for (var b in a);
      return void 0 === b || bb(a, b);
    },
    m = function (a, b) {
      var c = b || ('array' == ab(a) ? [] : {}),
        d;
      for (d in a)
        if (bb(a, d)) {
          var e = a[d];
          'array' == ab(e)
            ? ('array' != ab(c[d]) && (c[d] = []), (c[d] = m(e, c[d])))
            : cb(e)
            ? (cb(c[d]) || (c[d] = {}), (c[d] = m(e, c[d])))
            : (c[d] = e);
        }
      return c;
    };
  var db = function (a) {
    if (void 0 === a || ya(a) || cb(a)) return !0;
    switch (typeof a) {
      case 'boolean':
      case 'number':
      case 'string':
      case 'function':
        return !0;
    }
    return !1;
  };
  var eb = (function () {
    var a = function (b) {
      return {
        toString: function () {
          return b;
        },
      };
    };
    return {
      Sf: a('consent'),
      Tf: a('consent_always_fire'),
      ne: a('convert_case_to'),
      oe: a('convert_false_to'),
      pe: a('convert_null_to'),
      qe: a('convert_true_to'),
      se: a('convert_undefined_to'),
      Yh: a('debug_mode_metadata'),
      Sa: a('function'),
      Dg: a('instance_name'),
      Fg: a('live_only'),
      Gg: a('malware_disabled'),
      Hg: a('metadata'),
      bi: a('original_activity_id'),
      ci: a('original_vendor_template_id'),
      Jg: a('once_per_event'),
      Ye: a('once_per_load'),
      ei: a('priority_override'),
      fi: a('respected_consent_types'),
      ef: a('setup_tags'),
      ff: a('tag_id'),
      hf: a('teardown_tags'),
    };
  })();
  var Eb;
  var Fb = [],
    Lb = [],
    Mb = [],
    Nb = [],
    Ob = [],
    Pb = {},
    Qb,
    Rb,
    Sb,
    Tb = function (a, b) {
      var c = a['function'];
      if (!c) throw Error('Error: No function name given for function call.');
      var d = Pb[c],
        e = {},
        f;
      for (f in a)
        if (a.hasOwnProperty(f))
          if (0 === f.indexOf('vtp_')) d && b && b.pf && b.pf(a[f]), (e[void 0 !== d ? f : f.substr(4)] = a[f]);
          else if (f === eb.Tf.toString() && a[f]) {
          }
      d && b && b.nf && (e.vtp_gtmCachedValues = b.nf);
      return void 0 !== d ? d(e) : Eb(c, e, b);
    },
    Vb = function (a, b, c) {
      c = c || [];
      var d = {},
        e;
      for (e in a) a.hasOwnProperty(e) && (d[e] = Ub(a[e], b, c));
      return d;
    },
    Ub = function (a, b, c) {
      if (ya(a)) {
        var d;
        switch (a[0]) {
          case 'function_id':
            return a[1];
          case 'list':
            d = [];
            for (var e = 1; e < a.length; e++) d.push(Ub(a[e], b, c));
            return d;
          case 'macro':
            var f = a[1];
            if (c[f]) return;
            var h = Fb[f];
            if (!h || b.Rd(h)) return;
            c[f] = !0;
            try {
              var k = Vb(h, b, c);
              k.vtp_gtmEventId = b.id;
              d = Tb(k, b);
              Sb && (d = Sb.Yg(d, k));
            } catch (z) {
              b.Af && b.Af(z, Number(f)), (d = !1);
            }
            c[f] = !1;
            return d;
          case 'map':
            d = {};
            for (var l = 1; l < a.length; l += 2) d[Ub(a[l], b, c)] = Ub(a[l + 1], b, c);
            return d;
          case 'template':
            d = [];
            for (var n = !1, p = 1; p < a.length; p++) {
              var r = Ub(a[p], b, c);
              Rb && (n = n || r === Rb.vc);
              d.push(r);
            }
            return Rb && n ? Rb.ah(d) : d.join('');
          case 'escape':
            d = Ub(a[1], b, c);
            if (Rb && ya(a[1]) && 'macro' === a[1][0] && Rb.th(a)) return Rb.Hh(d);
            d = String(d);
            for (var q = 2; q < a.length; q++) fb[a[q]] && (d = fb[a[q]](d));
            return d;
          case 'tag':
            var t = a[1];
            if (!Nb[t]) throw Error('Unable to resolve tag reference ' + t + '.');
            return (d = { vf: a[2], index: t });
          case 'zb':
            var u = { arg0: a[2], arg1: a[3], ignore_case: a[5] };
            u['function'] = a[1];
            var v = Wb(u, b, c),
              x = !!a[4];
            return x || 2 !== v ? x !== (1 === v) : null;
          default:
            throw Error('Attempting to expand unknown Value type: ' + a[0] + '.');
        }
      }
      return a;
    },
    Wb = function (a, b, c) {
      try {
        return Qb(Vb(a, b, c));
      } catch (d) {
        JSON.stringify(a);
      }
      return 2;
    };
  var Zb = function (a) {
      function b(q) {
        for (var t = 0; t < q.length; t++) d[q[t]] = !0;
      }
      for (var c = [], d = [], e = Xb(a), f = 0; f < Lb.length; f++) {
        var h = Lb[f],
          k = Yb(h, e);
        if (k) {
          for (var l = h.add || [], n = 0; n < l.length; n++) c[l[n]] = !0;
          b(h.block || []);
        } else null === k && b(h.block || []);
      }
      for (var p = [], r = 0; r < Nb.length; r++) c[r] && !d[r] && (p[r] = !0);
      return p;
    },
    Yb = function (a, b) {
      for (var c = a['if'] || [], d = 0; d < c.length; d++) {
        var e = b(c[d]);
        if (0 === e) return !1;
        if (2 === e) return null;
      }
      for (var f = a.unless || [], h = 0; h < f.length; h++) {
        var k = b(f[h]);
        if (2 === k) return null;
        if (1 === k) return !1;
      }
      return !0;
    },
    Xb = function (a) {
      var b = [];
      return function (c) {
        void 0 === b[c] && (b[c] = Wb(Mb[c], a));
        return b[c];
      };
    };
  var $b = {
    Yg: function (a, b) {
      b[eb.ne] && 'string' === typeof a && (a = 1 == b[eb.ne] ? a.toLowerCase() : a.toUpperCase());
      b.hasOwnProperty(eb.pe) && null === a && (a = b[eb.pe]);
      b.hasOwnProperty(eb.se) && void 0 === a && (a = b[eb.se]);
      b.hasOwnProperty(eb.qe) && !0 === a && (a = b[eb.qe]);
      b.hasOwnProperty(eb.oe) && !1 === a && (a = b[eb.oe]);
      return a;
    },
  };
  var cc = function (a, b) {
    var c = String(a);
    return c;
  };
  var hc = function (a) {
      var b = {},
        c = 0;
      Fa(a, function (e, f) {
        if (void 0 !== f)
          if (((f = cc(f, 100)), dc.hasOwnProperty(e))) b[dc[e]] = ec(f);
          else if (fc.hasOwnProperty(e)) {
            var h = fc[e],
              k = ec(f);
            b.hasOwnProperty(h) || (b[h] = k);
          } else if ('category' === e)
            for (var l = ec(f).split('/', 5), n = 0; n < l.length; n++) {
              var p = gc[n],
                r = l[n];
              b.hasOwnProperty(p) || (b[p] = r);
            }
          else 10 > c && ((b['k' + c] = ec(cc(e, 40))), (b['v' + c] = ec(f)), c++);
      });
      var d = [];
      Fa(b, function (e, f) {
        d.push('' + e + f);
      });
      return d.join('~');
    },
    ec = function (a) {
      return ('' + a).replace(/~/g, function () {
        return '~~';
      });
    },
    dc = {
      item_id: 'id',
      item_name: 'nm',
      item_brand: 'br',
      item_category: 'ca',
      item_category2: 'c2',
      item_category3: 'c3',
      item_category4: 'c4',
      item_category5: 'c5',
      item_variant: 'va',
      price: 'pr',
      quantity: 'qt',
      coupon: 'cp',
      item_list_name: 'ln',
      index: 'lp',
      item_list_id: 'li',
      discount: 'ds',
      affiliation: 'af',
      promotion_id: 'pi',
      promotion_name: 'pn',
      creative_name: 'cn',
      creative_slot: 'cs',
      location_id: 'lo',
    },
    fc = {
      id: 'id',
      name: 'nm',
      brand: 'br',
      variant: 'va',
      list_name: 'ln',
      list_position: 'lp',
      list: 'ln',
      position: 'lp',
      creative: 'cn',
    },
    gc = ['ca', 'c2', 'c3', 'c4', 'c5'];
  var ic = function (a) {
      var b = [];
      Fa(a, function (c, d) {
        null != d && b.push(encodeURIComponent(c) + '=' + encodeURIComponent(String(d)));
      });
      return b.join('&');
    },
    jc = function (a, b, c) {
      this.Ha = a.Ha;
      this.Ya = a.Ya;
      this.M = a.M;
      this.o = b;
      this.C = ic(a.Ha);
      this.m = ic(a.M);
      this.H = c ? this.m.length : 0;
      if (16384 < this.H) throw Error('EVENT_TOO_LARGE');
    };
  var kc = function () {
    this.events = [];
    this.m = this.Ha = '';
    this.o = 0;
  };
  kc.prototype.add = function (a) {
    return this.C(a) ? (this.events.push(a), (this.Ha = a.C), (this.m = a.o), (this.o += a.H), !0) : !1;
  };
  kc.prototype.C = function (a) {
    var b = 20 > this.events.length && 16384 > a.H + this.o,
      c = this.Ha === a.C && this.m === a.o;
    return 0 == this.events.length || (b && c);
  };
  var lc = function (a, b) {
      Fa(a, function (c, d) {
        null != d && b.push(encodeURIComponent(c) + '=' + encodeURIComponent(d));
      });
    },
    mc = function (a, b) {
      var c = [];
      a.C && c.push(a.C);
      b && c.push('_s=' + b);
      lc(a.Ya, c);
      var d = !1;
      a.m && (c.push(a.m), (d = !0));
      var e = c.join('&'),
        f = '',
        h = e.length + a.o.length + 1;
      d && 2048 < h && ((f = c.pop()), (e = c.join('&')));
      return { Xd: e, body: f };
    },
    nc = function (a, b) {
      var c = a.events;
      if (1 == c.length) return mc(c[0], b);
      var d = [];
      a.Ha && d.push(a.Ha);
      for (var e = {}, f = 0; f < c.length; f++)
        Fa(c[f].Ya, function (t, u) {
          null != u && ((e[t] = e[t] || {}), (e[t][String(u)] = e[t][String(u)] + 1 || 1));
        });
      var h = {};
      Fa(e, function (t, u) {
        var v,
          x = -1,
          z = 0;
        Fa(u, function (w, y) {
          z += y;
          var A = (w.length + t.length + 2) * (y - 1);
          A > x && ((v = w), (x = A));
        });
        z == c.length && (h[t] = v);
      });
      lc(h, d);
      b && d.push('_s=' + b);
      for (var k = d.join('&'), l = [], n = {}, p = 0; p < c.length; n = { ac: n.ac }, p++) {
        var r = [];
        n.ac = {};
        Fa(
          c[p].Ya,
          (function (t) {
            return function (u, v) {
              h[u] != '' + v && (t.ac[u] = v);
            };
          })(n),
        );
        c[p].m && r.push(c[p].m);
        lc(n.ac, r);
        l.push(r.join('&'));
      }
      var q = l.join('\r\n');
      return { Xd: k, body: q };
    };
  var B = {
    Ib: '_ee',
    Ac: '_syn_or_mod',
    hi: '_uei',
    vd: '_eu',
    di: '_pci',
    jd: 'event_callback',
    mc: 'event_timeout',
    ia: 'gtag.config',
    za: 'gtag.get',
    fa: 'purchase',
    ib: 'refund',
    Pa: 'begin_checkout',
    fb: 'add_to_cart',
    hb: 'remove_from_cart',
    bg: 'view_cart',
    we: 'add_to_wishlist',
    ya: 'view_item',
    ve: 'view_promotion',
    ue: 'select_promotion',
    Wc: 'select_item',
    fc: 'view_item_list',
    te: 'add_payment_info',
    ag: 'add_shipping_info',
    La: 'value_key',
    Ka: 'value_callback',
    qa: 'allow_ad_personalization_signals',
    Eb: 'restricted_data_processing',
    Ab: 'allow_google_signals',
    ra: 'cookie_expires',
    Bb: 'cookie_update',
    Gb: 'session_duration',
    qc: 'session_engaged_time',
    Da: 'user_properties',
    ka: 'transport_url',
    N: 'ads_data_redaction',
    ud: 'user_data',
    Cb: 'first_party_collection',
    B: 'ad_storage',
    F: 'analytics_storage',
    ke: 'region',
    me: 'wait_for_update',
    Ba: 'conversion_linker',
    Aa: 'conversion_cookie_prefix',
    aa: 'value',
    X: 'currency',
    Ne: 'trip_type',
    U: 'items',
    He: 'passengers',
  };
  (B.hc = 'page_view'),
    (B.xe = 'user_engagement'),
    (B.Wf = 'app_remove'),
    (B.Xf = 'app_store_refund'),
    (B.Yf = 'app_store_subscription_cancel'),
    (B.Zf = 'app_store_subscription_convert'),
    (B.$f = 'app_store_subscription_renew'),
    (B.cg = 'first_open'),
    (B.dg = 'first_visit'),
    (B.eg = 'in_app_purchase'),
    (B.fg = 'session_start'),
    (B.ye = 'allow_custom_scripts'),
    (B.gg = 'allow_display_features'),
    (B.jc = 'allow_enhanced_conversions'),
    (B.gd = 'enhanced_conversions'),
    (B.jb = 'client_id'),
    (B.Z = 'cookie_domain'),
    (B.kc = 'cookie_name'),
    (B.Qa = 'cookie_path'),
    (B.Ca = 'cookie_flags'),
    (B.Ae = 'custom_map'),
    (B.nd = 'groups'),
    (B.kb = 'language'),
    (B.bd = 'country'),
    (B.Zh = 'non_interaction'),
    (B.ob = 'page_location'),
    (B.Ge = 'page_path'),
    (B.Ma = 'page_referrer'),
    (B.rd = 'page_title'),
    (B.Fb = 'send_page_view'),
    (B.Ra = 'send_to'),
    (B.sd = 'session_engaged'),
    (B.Hb = 'session_id'),
    (B.td = 'session_number'),
    (B.zg = 'tracking_id'),
    (B.sa = 'linker'),
    (B.Na = 'url_passthrough'),
    (B.lb = 'accept_incoming'),
    (B.L = 'domains'),
    (B.nb = 'url_position'),
    (B.mb = 'decorate_forms'),
    (B.Ke = 'phone_conversion_number'),
    (B.Ie = 'phone_conversion_callback'),
    (B.Je = 'phone_conversion_css_class'),
    (B.Le = 'phone_conversion_options'),
    (B.ug = 'phone_conversion_ids'),
    (B.sg = 'phone_conversion_country_code'),
    (B.ze = 'aw_remarketing'),
    (B.Xc = 'aw_remarketing_only'),
    (B.ic = 'gclid'),
    (B.vg = 'quantity'),
    (B.kg = 'affiliation'),
    (B.Fe = 'tax'),
    (B.fd = 'shipping'),
    (B.ed = 'list_name'),
    (B.Ee = 'checkout_step'),
    (B.De = 'checkout_option'),
    (B.lg = 'coupon'),
    (B.mg = 'promotions'),
    (B.pb = 'transaction_id'),
    (B.qb = 'user_id'),
    (B.wg = 'retoken'),
    (B.ja = 'cookie_prefix'),
    (B.ad = 'aw_merchant_id'),
    (B.Zc = 'aw_feed_country'),
    (B.$c = 'aw_feed_language'),
    (B.Yc = 'discount'),
    (B.Ce = 'disable_merchant_reported_purchases'),
    (B.qd = 'new_customer'),
    (B.cd = 'customer_lifetime_value'),
    (B.jg = 'dc_natural_search'),
    (B.ig = 'dc_custom_params'),
    (B.qg = 'method'),
    (B.yg = 'search_term'),
    (B.hg = 'content_type'),
    (B.rg = 'optimize_id'),
    (B.ng = 'experiments'),
    (B.Db = 'google_signals'),
    (B.md = 'google_tld'),
    (B.uc = 'update'),
    (B.ld = 'firebase_id'),
    (B.nc = 'ga_restrict_domain'),
    (B.kd = 'event_settings'),
    (B.dd = 'dynamic_event_settings'),
    (B.xg = 'screen_name'),
    (B.pg = '_x_19'),
    (B.og = '_x_20'),
    (B.pd = 'internal_traffic_results'),
    (B.Me = 'traffic_type'),
    (B.oc = 'referral_exclusion_definition'),
    (B.od = 'ignore_referrer'),
    (B.sc = 'delivery_postal_code'),
    (B.hd = 'estimated_delivery_date'),
    (B.Be = 'developer_id');
  (B.Ag = [
    B.qa,
    B.jc,
    B.Ab,
    B.U,
    B.Eb,
    B.Z,
    B.ra,
    B.Ca,
    B.kc,
    B.Qa,
    B.ja,
    B.Bb,
    B.Ae,
    B.dd,
    B.jd,
    B.kd,
    B.mc,
    B.Cb,
    B.nc,
    B.Db,
    B.md,
    B.nd,
    B.pd,
    B.sa,
    B.oc,
    B.Ra,
    B.Fb,
    B.Gb,
    B.qc,
    B.ka,
    B.uc,
    B.Da,
    B.sc,
    B.vd,
  ]),
    (B.Oe = [B.ob, B.Ma, B.rd, B.kb, B.xg, B.qb, B.ld]),
    (B.Cg = [B.Wf, B.Xf, B.Yf, B.Zf, B.$f, B.cg, B.dg, B.eg, B.fg, B.xe]);
  B.Qe = [B.fa, B.ib, B.Pa, B.fb, B.hb, B.bg, B.we, B.ya, B.ve, B.ue, B.fc, B.Wc, B.te, B.ag];
  B.Pe = [B.qa, B.Ab, B.Bb];
  B.Re = [B.ra, B.mc, B.Gb, B.qc];
  var Ec = function (a) {
    ta('GTM', a);
  };
  var Fc = function (a, b) {
    this.m = a;
    this.defaultValue = void 0 === b ? !1 : b;
  };
  var Gc = new Fc(1936, !0),
    Hc = new Fc(1933),
    Ic = new Fc(373442741);
  var Jc = function (a, b) {
      var c = function () {};
      c.prototype = a.prototype;
      var d = new c();
      a.apply(d, Array.prototype.slice.call(arguments, 1));
      return d;
    },
    Kc = function (a) {
      var b = a;
      return function () {
        if (b) {
          var c = b;
          b = null;
          c();
        }
      };
    };
  var Lc,
    Mc = function () {
      if (void 0 === Lc) {
        var a = null,
          b = pa.trustedTypes;
        if (b && b.createPolicy) {
          try {
            a = b.createPolicy('goog#html', { createHTML: ra, createScript: ra, createScriptURL: ra });
          } catch (c) {
            pa.console && pa.console.error(c.message);
          }
          Lc = a;
        } else Lc = a;
      }
      return Lc;
    };
  var Oc = function (a, b) {
    this.m = b === Nc ? a : '';
  };
  Oc.prototype.toString = function () {
    return this.m + '';
  };
  var Nc = {};
  var Qc = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
  var Rc;
  a: {
    var Sc = pa.navigator;
    if (Sc) {
      var Tc = Sc.userAgent;
      if (Tc) {
        Rc = Tc;
        break a;
      }
    }
    Rc = '';
  }
  var Uc = function (a) {
    return -1 != Rc.indexOf(a);
  };
  var Wc = function (a, b, c) {
    this.m = c === Vc ? a : '';
  };
  Wc.prototype.toString = function () {
    return this.m.toString();
  };
  var Xc = function (a) {
      return a instanceof Wc && a.constructor === Wc ? a.m : 'type_error:SafeHtml';
    },
    Vc = {},
    Yc = function (a) {
      var b = Mc(),
        c = b ? b.createHTML(a) : a;
      return new Wc(c, null, Vc);
    },
    Zc = new Wc((pa.trustedTypes && pa.trustedTypes.emptyHTML) || '', 0, Vc);
  var $c = (function (a) {
      var b = !1,
        c;
      return function () {
        b || ((c = a()), (b = !0));
        return c;
      };
    })(function () {
      var a = document.createElement('div'),
        b = document.createElement('div');
      b.appendChild(document.createElement('div'));
      a.appendChild(b);
      var c = a.firstChild.firstChild;
      a.innerHTML = Xc(Zc);
      return !c.parentElement;
    }),
    ad = function (a, b) {
      if ($c()) for (; a.lastChild; ) a.removeChild(a.lastChild);
      a.innerHTML = Xc(b);
    },
    bd = /^[\w+/_-]+[=]{0,2}$/;
  var D = window,
    F = document,
    cd = navigator,
    dd = F.currentScript && F.currentScript.src,
    ed = function (a, b) {
      var c = D[a];
      D[a] = void 0 === c ? b : c;
      return D[a];
    },
    fd = function (a, b) {
      b &&
        (a.addEventListener
          ? (a.onload = b)
          : (a.onreadystatechange = function () {
              a.readyState in { loaded: 1, complete: 1 } && ((a.onreadystatechange = null), b());
            }));
    },
    gd = function (a, b, c) {
      var d = F.createElement('script');
      d.type = 'text/javascript';
      d.async = !0;
      var e,
        f = Mc(),
        h = f ? f.createScriptURL(a) : a;
      e = new Oc(h, Nc);
      d.src = e instanceof Oc && e.constructor === Oc ? e.m : 'type_error:TrustedResourceUrl';
      var k;
      a: {
        var l = ((d.ownerDocument && d.ownerDocument.defaultView) || pa).document;
        if (l.querySelector) {
          var n = l.querySelector('script[nonce]');
          if (n) {
            var p = n.nonce || n.getAttribute('nonce');
            if (p && bd.test(p)) {
              k = p;
              break a;
            }
          }
        }
        k = '';
      }
      var r = k;
      r && d.setAttribute('nonce', r);
      fd(d, b);
      c && (d.onerror = c);
      var q = F.getElementsByTagName('script')[0] || F.body || F.head;
      q.parentNode.insertBefore(d, q);
      return d;
    },
    hd = function () {
      if (dd) {
        var a = dd.toLowerCase();
        if (0 === a.indexOf('https://')) return 2;
        if (0 === a.indexOf('http://')) return 3;
      }
      return 1;
    },
    id = function (a, b) {
      var c = F.createElement('iframe');
      c.height = '0';
      c.width = '0';
      c.style.display = 'none';
      c.style.visibility = 'hidden';
      var d = (F.body && F.body.lastChild) || F.body || F.head;
      d.parentNode.insertBefore(c, d);
      fd(c, b);
      void 0 !== a && (c.src = a);
      return c;
    },
    jd = function (a, b, c) {
      var d = new Image(1, 1);
      d.onload = function () {
        d.onload = null;
        b && b();
      };
      d.onerror = function () {
        d.onerror = null;
        c && c();
      };
      d.src = a;
      return d;
    },
    kd = function (a, b, c, d) {
      a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent('on' + b, c);
    },
    ld = function (a, b, c) {
      a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent && a.detachEvent('on' + b, c);
    },
    I = function (a) {
      D.setTimeout(a, 0);
    },
    md = function (a, b) {
      return a && b && a.attributes && a.attributes[b] ? a.attributes[b].value : null;
    },
    nd = function (a) {
      var b = a.innerText || a.textContent || '';
      b && ' ' != b && (b = b.replace(/^[\s\xa0]+|[\s\xa0]+$/g, ''));
      b && (b = b.replace(/(\xa0+|\s{2,}|\n|\r\t)/g, ' '));
      return b;
    },
    od = function (a) {
      var b = F.createElement('div'),
        c = Yc('A<div>' + a + '</div>');
      ad(b, c);
      b = b.lastChild;
      for (var d = []; b.firstChild; ) d.push(b.removeChild(b.firstChild));
      return d;
    },
    sd = function (a, b, c) {
      c = c || 100;
      for (var d = {}, e = 0; e < b.length; e++) d[b[e]] = !0;
      for (var f = a, h = 0; f && h <= c; h++) {
        if (d[String(f.tagName).toLowerCase()]) return f;
        f = f.parentElement;
      }
      return null;
    },
    td = function (a) {
      (cd.sendBeacon && cd.sendBeacon(a)) || jd(a);
    },
    ud = function (a, b) {
      var c = a[b];
      c && 'string' === typeof c.animVal && (c = c.animVal);
      return c;
    };
  var vd = function () {
    var a = {};
    this.m = function (b, c) {
      return null != a[b] ? a[b] : c;
    };
    this.o = function () {
      a[Hc.m] = !0;
    };
  };
  vd.m = void 0;
  vd.o = function () {
    return vd.m ? vd.m : (vd.m = new vd());
  };
  var wd = function (a) {
    return vd.o().m(a.m, a.defaultValue);
  };
  var xd = [];
  function yd() {
    var a = ed('google_tag_data', {});
    a.ics ||
      (a.ics = { entries: {}, set: zd, update: Ad, addListener: Bd, notifyListeners: Cd, active: !1, usedDefault: !1 });
    return a.ics;
  }
  function zd(a, b, c, d, e, f) {
    var h = yd();
    h.active = !0;
    h.usedDefault = !0;
    if (void 0 != b) {
      var k = h.entries,
        l = k[a] || {},
        n = l.region,
        p = c && g(c) ? c.toUpperCase() : void 0;
      d = d.toUpperCase();
      e = e.toUpperCase();
      if ('' === d || p === e || (p === d ? n !== e : !p && !n)) {
        var r = !!(f && 0 < f && void 0 === l.update),
          q = { region: p, initial: 'granted' === b, update: l.update, quiet: r };
        if ('' !== d || !1 !== l.initial) k[a] = q;
        r &&
          D.setTimeout(function () {
            k[a] === q && q.quiet && ((q.quiet = !1), Dd(a), Cd(), ta('TAGGING', 2));
          }, f);
      }
    }
  }
  function Ad(a, b) {
    var c = yd();
    c.active = !0;
    if (void 0 != b) {
      var d = Ed(a),
        e = c.entries,
        f = (e[a] = e[a] || {});
      f.update = 'granted' === b;
      var h = Ed(a);
      f.quiet ? ((f.quiet = !1), Dd(a)) : h !== d && Dd(a);
    }
  }
  function Bd(a, b) {
    xd.push({ Hd: a, jh: b });
  }
  function Dd(a) {
    for (var b = 0; b < xd.length; ++b) {
      var c = xd[b];
      ya(c.Hd) && -1 !== c.Hd.indexOf(a) && (c.Df = !0);
    }
  }
  function Cd(a) {
    for (var b = 0; b < xd.length; ++b) {
      var c = xd[b];
      if (c.Df) {
        c.Df = !1;
        try {
          c.jh({ Xg: a });
        } catch (d) {}
      }
    }
  }
  var Ed = function (a) {
      var b = yd().entries[a] || {};
      return void 0 !== b.update ? b.update : void 0 !== b.initial ? b.initial : void 0;
    },
    Fd = function (a) {
      return (yd().entries[a] || {}).initial;
    },
    Gd = function (a) {
      return !(yd().entries[a] || {}).quiet;
    },
    Hd = function () {
      return wd(Hc) ? yd().active : !1;
    },
    Id = function () {
      return yd().usedDefault;
    },
    Jd = function (a, b) {
      yd().addListener(a, b);
    },
    Kd = function (a, b) {
      function c() {
        for (var e = 0; e < b.length; e++) if (!Gd(b[e])) return !0;
        return !1;
      }
      if (c()) {
        var d = !1;
        Jd(b, function (e) {
          d || c() || ((d = !0), a(e));
        });
      } else a({});
    },
    Ld = function (a, b) {
      function c() {
        for (var f = [], h = 0; h < d.length; h++) {
          var k = d[h];
          !1 === Ed(k) || e[k] || (f.push(k), (e[k] = !0));
        }
        return f;
      }
      var d = g(b) ? [b] : b,
        e = {};
      c().length !== d.length &&
        Jd(d, function (f) {
          var h = c();
          0 < h.length && ((f.Hd = h), a(f));
        });
    };
  function Md(a) {
    for (var b = [], c = 0; c < Nd.length; c++) {
      var d = a(Nd[c]);
      b[c] = !0 === d ? '1' : !1 === d ? '0' : '-';
    }
    return b.join('');
  }
  var Nd = [B.B, B.F],
    Od = function (a) {
      var b = a[B.ke];
      b && Ec(40);
      var c = a[B.me];
      c && Ec(41);
      for (var d = ya(b) ? b : [b], e = 0; e < d.length; ++e)
        for (var f in a)
          if (a.hasOwnProperty(f) && f !== B.ke && f !== B.me)
            if (-1 < za(Nd, f)) {
              var h = f,
                k = a[f],
                l = d[e];
              yd().set(h, k, l, 'US', 'US-CO', c);
            } else {
            }
    },
    Pd = function (a, b) {
      for (var c in a)
        if (a.hasOwnProperty(c))
          if (-1 < za(Nd, c)) {
            var d = c,
              e = a[c];
            yd().update(d, e);
          } else {
          }
      yd().notifyListeners(b);
    },
    J = function (a) {
      var b = Ed(a);
      return void 0 != b ? b : !0;
    },
    Qd = function () {
      return 'G1' + Md(Ed);
    },
    Rd = function (a, b) {
      Ld(a, b);
    },
    Sd = function (a, b) {
      Kd(a, b);
    };
  var Ud = function (a) {
      return Td ? F.querySelectorAll(a) : null;
    },
    Vd = function (a, b) {
      if (!Td) return null;
      if (Element.prototype.closest)
        try {
          return a.closest(b);
        } catch (e) {
          return null;
        }
      var c =
          Element.prototype.matches ||
          Element.prototype.webkitMatchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector,
        d = a;
      if (!F.documentElement.contains(d)) return null;
      do {
        try {
          if (c.call(d, b)) return d;
        } catch (e) {
          break;
        }
        d = d.parentElement || d.parentNode;
      } while (null !== d && 1 === d.nodeType);
      return null;
    },
    Wd = !1;
  if (F.querySelectorAll)
    try {
      var Xd = F.querySelectorAll(':root');
      Xd && 1 == Xd.length && Xd[0] == F.documentElement && (Wd = !0);
    } catch (a) {}
  var Td = Wd;
  var Yd = function (a) {
    if (F.hidden) return !0;
    var b = a.getBoundingClientRect();
    if (b.top == b.bottom || b.left == b.right || !D.getComputedStyle) return !0;
    var c = D.getComputedStyle(a, null);
    if ('hidden' === c.visibility) return !0;
    for (var d = a, e = c; d; ) {
      if ('none' === e.display) return !0;
      var f = e.opacity,
        h = e.filter;
      if (h) {
        var k = h.indexOf('opacity(');
        0 <= k &&
          ((h = h.substring(k + 8, h.indexOf(')', k))),
          '%' == h.charAt(h.length - 1) && (h = h.substring(0, h.length - 1)),
          (f = Math.min(h, f)));
      }
      if (void 0 !== f && 0 >= f) return !0;
      (d = d.parentElement) && (e = D.getComputedStyle(d, null));
    }
    return !1;
  };
  var Zd = function () {
      var a = F.body,
        b = F.documentElement || (a && a.parentElement),
        c,
        d;
      if (F.compatMode && 'BackCompat' !== F.compatMode) (c = b ? b.clientHeight : 0), (d = b ? b.clientWidth : 0);
      else {
        var e = function (f, h) {
          return f && h ? Math.min(f, h) : Math.max(f, h);
        };
        Ec(7);
        c = e(b ? b.clientHeight : 0, a ? a.clientHeight : 0);
        d = e(b ? b.clientWidth : 0, a ? a.clientWidth : 0);
      }
      return { width: d, height: c };
    },
    $d = function (a) {
      var b = Zd(),
        c = b.height,
        d = b.width,
        e = a.getBoundingClientRect(),
        f = e.bottom - e.top,
        h = e.right - e.left;
      return f && h
        ? (1 - Math.min((Math.max(0 - e.left, 0) + Math.max(e.right - d, 0)) / h, 1)) *
            (1 - Math.min((Math.max(0 - e.top, 0) + Math.max(e.bottom - c, 0)) / f, 1))
        : 0;
    };
  var ge = /:[0-9]+$/,
    he = function (a, b, c) {
      for (var d = a.split('&'), e = 0; e < d.length; e++) {
        var f = d[e].split('=');
        if (decodeURIComponent(f[0]).replace(/\+/g, ' ') === b) {
          var h = f.slice(1).join('=');
          return c ? h : decodeURIComponent(h).replace(/\+/g, ' ');
        }
      }
    },
    ke = function (a, b, c, d, e) {
      b && (b = String(b).toLowerCase());
      if ('protocol' === b || 'port' === b) a.protocol = ie(a.protocol) || ie(D.location.protocol);
      'port' === b
        ? (a.port = String(
            Number(a.hostname ? a.port : D.location.port) ||
              ('http' == a.protocol ? 80 : 'https' == a.protocol ? 443 : ''),
          ))
        : 'host' === b && (a.hostname = (a.hostname || D.location.hostname).replace(ge, '').toLowerCase());
      return je(a, b, c, d, e);
    },
    je = function (a, b, c, d, e) {
      var f,
        h = ie(a.protocol);
      b && (b = String(b).toLowerCase());
      switch (b) {
        case 'url_no_fragment':
          f = le(a);
          break;
        case 'protocol':
          f = h;
          break;
        case 'host':
          f = a.hostname.replace(ge, '').toLowerCase();
          if (c) {
            var k = /^www\d*\./.exec(f);
            k && k[0] && (f = f.substr(k[0].length));
          }
          break;
        case 'port':
          f = String(Number(a.port) || ('http' == h ? 80 : 'https' == h ? 443 : ''));
          break;
        case 'path':
          a.pathname || a.hostname || ta('TAGGING', 1);
          f = '/' == a.pathname.substr(0, 1) ? a.pathname : '/' + a.pathname;
          var l = f.split('/');
          0 <= za(d || [], l[l.length - 1]) && (l[l.length - 1] = '');
          f = l.join('/');
          break;
        case 'query':
          f = a.search.replace('?', '');
          e && (f = he(f, e, void 0));
          break;
        case 'extension':
          var n = a.pathname.split('.');
          f = 1 < n.length ? n[n.length - 1] : '';
          f = f.split('/')[0];
          break;
        case 'fragment':
          f = a.hash.replace('#', '');
          break;
        default:
          f = a && a.href;
      }
      return f;
    },
    ie = function (a) {
      return a ? a.replace(':', '').toLowerCase() : '';
    },
    le = function (a) {
      var b = '';
      if (a && a.href) {
        var c = a.href.indexOf('#');
        b = 0 > c ? a.href : a.href.substr(0, c);
      }
      return b;
    },
    me = function (a) {
      var b = F.createElement('a');
      a && (b.href = a);
      var c = b.pathname;
      '/' !== c[0] && (a || ta('TAGGING', 1), (c = '/' + c));
      var d = b.hostname.replace(ge, '');
      return {
        href: b.href,
        protocol: b.protocol,
        host: b.host,
        hostname: d,
        pathname: c,
        search: b.search,
        hash: b.hash,
        port: b.port,
      };
    },
    ne = function (a) {
      function b(n) {
        var p = n.split('=')[0];
        return 0 > d.indexOf(p) ? n : p + '=0';
      }
      function c(n) {
        return n
          .split('&')
          .map(b)
          .filter(function (p) {
            return void 0 != p;
          })
          .join('&');
      }
      var d = 'gclid dclid gbraid wbraid gclaw gcldc gclha gclgf gclgb _gl'.split(' '),
        e = me(a),
        f = a.split(/[?#]/)[0],
        h = e.search,
        k = e.hash;
      '?' === h[0] && (h = h.substring(1));
      '#' === k[0] && (k = k.substring(1));
      h = c(h);
      k = c(k);
      '' !== h && (h = '?' + h);
      '' !== k && (k = '#' + k);
      var l = '' + f + h + k;
      '/' === l[l.length - 1] && (l = l.substring(0, l.length - 1));
      return l;
    };
  var oe = new RegExp(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i),
    pe = new RegExp(/@(gmail|googlemail)\./i),
    ve = new RegExp(/support|noreply/i),
    we = 'SCRIPT STYLE IMG SVG PATH BR'.split(' '),
    xe = ['BR'];
  function ye(a) {
    var b;
    if (a === F.body) b = 'body';
    else {
      var c;
      if (a.id) c = '#' + a.id;
      else {
        var d;
        if (a.parentElement) {
          var e;
          a: {
            var f = a.parentElement;
            if (f) {
              for (var h = 0; h < f.childElementCount; h++)
                if (f.children[h] === a) {
                  e = h + 1;
                  break a;
                }
              e = -1;
            } else e = 1;
          }
          d = ye(a.parentElement) + '>:nth-child(' + e + ')';
        } else d = '';
        c = d;
      }
      b = c;
    }
    return b;
  }
  function ze(a, b) {
    if (1 >= a.length) return a;
    var c = a.filter(b);
    return 0 == c.length ? a : c;
  }
  function Ae(a) {
    if (0 == a.length) return null;
    var b;
    b = ze(a, function (c) {
      return !ve.test(c.wb);
    });
    b = ze(b, function (c) {
      return 'INPUT' === c.element.tagName.toUpperCase();
    });
    b = ze(b, function (c) {
      return !Yd(c.element);
    });
    return b[0];
  }
  var Be = function () {
      var a;
      var b = [],
        c = F.body;
      if (c) {
        for (var d = c.querySelectorAll('*'), e = 0; e < d.length && 1e4 > e; e++) {
          var f = d[e];
          if (!(0 <= we.indexOf(f.tagName.toUpperCase()))) {
            for (var h = !1, k = 0; k < f.childElementCount && 1e4 > k; k++)
              if (!(0 <= xe.indexOf(f.children[k].tagName.toUpperCase()))) {
                h = !0;
                break;
              }
            h || b.push(f);
          }
        }
        a = { elements: b, status: 1e4 < d.length ? '2' : '1' };
      } else a = { elements: b, status: '4' };
      for (var l = a, n = l.elements, p = [], r = 0; r < n.length; r++) {
        var q = n[r],
          t = q.textContent;
        q.value && (t = q.value);
        if (t) {
          var u = t.match(oe);
          if (u) {
            var v = u[0],
              x;
            if (D.location) {
              var z = je(D.location, 'host', !0);
              x = 0 <= v.toLowerCase().indexOf(z);
            } else x = !1;
            x || p.push({ element: q, wb: v });
          }
        }
      }
      var w = Ae(p),
        y = [];
      if (w) {
        var A = w.element,
          C = { wb: w.wb, tagName: A.tagName, type: 1 };
        C.querySelector = ye(A);
        C.isVisible = !Yd(A);
        y.push(C);
      }
      return { elements: y, status: 10 < p.length ? '3' : l.status };
    },
    Ce = function (a) {
      return a.tagName + ':' + a.isVisible + ':' + a.wb.length + ':' + pe.test(a.wb);
    };
  var Te = {},
    M = null,
    Ue = Math.random();
  Te.K = 'G-1YYCDQLM0S';
  Te.zc = '5j0';
  Te.ai = '';
  Te.Vf = 'ChAI8J2thQYQvKqa7fiky+EzEiUAFbvFArbzftq5aq/OdRpQUGQPVT5RLtkSS4SGXmtkleyTvW3EGgJNWw\x3d\x3d';
  var Ve = {
      __cl: !0,
      __ecl: !0,
      __ehl: !0,
      __evl: !0,
      __fal: !0,
      __fil: !0,
      __fsl: !0,
      __hl: !0,
      __jel: !0,
      __lcl: !0,
      __sdl: !0,
      __tl: !0,
      __ytl: !0,
    },
    We = { __paused: !0, __tg: !0 },
    Xe;
  for (Xe in Ve) Ve.hasOwnProperty(Xe) && (We[Xe] = !0);
  var Ye = 'www.googletagmanager.com/gtm.js';
  Ye = 'www.googletagmanager.com/gtag/js';
  var Ze = Ye,
    $e = Ka(''),
    af = null,
    bf = null,
    cf = 'https://www.googletagmanager.com/a?id=' + Te.K + '&cv=1',
    df = {},
    ef = {},
    ff = function () {
      var a = M.sequence || 1;
      M.sequence = a + 1;
      return a;
    };
  Te.Uf = '';
  var gf = {},
    hf = new Da(),
    jf = {},
    kf = {},
    nf = {
      name: 'dataLayer',
      set: function (a, b) {
        m(Xa(a, b), jf);
        lf();
      },
      get: function (a) {
        return mf(a, 2);
      },
      reset: function () {
        hf = new Da();
        jf = {};
        lf();
      },
    },
    mf = function (a, b) {
      return 2 != b ? hf.get(a) : of(a);
    },
    of = function (a) {
      var b,
        c = a.split('.');
      b = b || [];
      for (var d = jf, e = 0; e < c.length; e++) {
        if (null === d) return !1;
        if (void 0 === d) break;
        d = d[c[e]];
        if (-1 !== za(b, d)) return;
      }
      return d;
    },
    pf = function (a, b) {
      kf.hasOwnProperty(a) || (hf.set(a, b), m(Xa(a, b), jf), lf());
    },
    lf = function (a) {
      Fa(kf, function (b, c) {
        hf.set(b, c);
        m(Xa(b, void 0), jf);
        m(Xa(b, c), jf);
        a && delete kf[b];
      });
    },
    rf = function (a, b, c) {
      gf[a] = gf[a] || {};
      gf[a][b] = qf(b, c);
    },
    qf = function (a, b) {
      var c,
        d = 1 !== (void 0 === b ? 2 : b) ? of(a) : hf.get(a);
      'array' === ab(d) || 'object' === ab(d) ? (c = m(d)) : (c = d);
      return c;
    },
    sf = function (a, b) {
      if (gf[a]) return gf[a][b];
    },
    tf = function (a, b) {
      gf[a] && delete gf[a][b];
    };
  var wf = {},
    xf = function (a, b) {
      if (D._gtmexpgrp && D._gtmexpgrp.hasOwnProperty(a)) return D._gtmexpgrp[a];
      void 0 === wf[a] && (wf[a] = Math.floor(Math.random() * b));
      return wf[a];
    };
  function yf(a, b, c) {
    for (var d = [], e = b.split(';'), f = 0; f < e.length; f++) {
      var h = e[f].split('='),
        k = h[0].replace(/^\s*|\s*$/g, '');
      if (k && k == a) {
        var l = h
          .slice(1)
          .join('=')
          .replace(/^\s*|\s*$/g, '');
        l && c && (l = decodeURIComponent(l));
        d.push(l);
      }
    }
    return d;
  }
  function zf(a) {
    return wd(Ic) && !a.navigator.cookieEnabled ? !1 : 'null' !== a.origin;
  }
  var Cf = function (a, b, c, d) {
      return Af(d) ? yf(a, String(b || Bf()), c) : [];
    },
    Ff = function (a, b, c, d, e) {
      if (Af(e)) {
        var f = Df(a, d, e);
        if (1 === f.length) return f[0].id;
        if (0 !== f.length) {
          f = Ef(
            f,
            function (h) {
              return h.Gc;
            },
            b,
          );
          if (1 === f.length) return f[0].id;
          f = Ef(
            f,
            function (h) {
              return h.Ub;
            },
            c,
          );
          return f[0] ? f[0].id : void 0;
        }
      }
    };
  function Gf(a, b, c, d) {
    var e = Bf(),
      f = window;
    zf(f) && (f.document.cookie = a);
    var h = Bf();
    return e != h || (void 0 != c && 0 <= Cf(b, h, !1, d).indexOf(c));
  }
  var Kf = function (a, b, c) {
      function d(t, u, v) {
        if (null == v) return delete h[u], t;
        h[u] = v;
        return t + '; ' + u + '=' + v;
      }
      function e(t, u) {
        if (null == u) return delete h[u], t;
        h[u] = !0;
        return t + '; ' + u;
      }
      if (!Af(c.Ia)) return 2;
      var f;
      void 0 == b
        ? (f = a + '=deleted; expires=' + new Date(0).toUTCString())
        : (c.encode && (b = encodeURIComponent(b)), (b = Hf(b)), (f = a + '=' + b));
      var h = {};
      f = d(f, 'path', c.path);
      var k;
      c.expires instanceof Date ? (k = c.expires.toUTCString()) : null != c.expires && (k = '' + c.expires);
      f = d(f, 'expires', k);
      f = d(f, 'max-age', c.oi);
      f = d(f, 'samesite', c.ri);
      c.si && (f = e(f, 'secure'));
      var l = c.domain;
      if ('auto' === l) {
        for (var n = If(), p = 0; p < n.length; ++p) {
          var r = 'none' !== n[p] ? n[p] : void 0,
            q = d(f, 'domain', r);
          q = e(q, c.flags);
          if (!Jf(r, c.path) && Gf(q, a, b, c.Ia)) return 0;
        }
        return 1;
      }
      l && 'none' !== l && (f = d(f, 'domain', l));
      f = e(f, c.flags);
      return Jf(l, c.path) ? 1 : Gf(f, a, b, c.Ia) ? 0 : 1;
    },
    Lf = function (a, b, c) {
      null == c.path && (c.path = '/');
      c.domain || (c.domain = 'auto');
      return Kf(a, b, c);
    };
  function Ef(a, b, c) {
    for (var d = [], e = [], f, h = 0; h < a.length; h++) {
      var k = a[h],
        l = b(k);
      l === c ? d.push(k) : void 0 === f || l < f ? ((e = [k]), (f = l)) : l === f && e.push(k);
    }
    return 0 < d.length ? d : e;
  }
  function Df(a, b, c) {
    for (var d = [], e = Cf(a, void 0, void 0, c), f = 0; f < e.length; f++) {
      var h = e[f].split('.'),
        k = h.shift();
      if (!b || -1 !== b.indexOf(k)) {
        var l = h.shift();
        l && ((l = l.split('-')), d.push({ id: h.join('.'), Gc: 1 * l[0] || 1, Ub: 1 * l[1] || 1 }));
      }
    }
    return d;
  }
  var Hf = function (a) {
      a && 1200 < a.length && (a = a.substring(0, 1200));
      return a;
    },
    Mf = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/,
    Nf = /(^|\.)doubleclick\.net$/i,
    Jf = function (a, b) {
      return Nf.test(window.document.location.hostname) || ('/' === b && Mf.test(a));
    },
    Bf = function () {
      return zf(window) ? window.document.cookie : '';
    },
    If = function () {
      var a = [],
        b = window.document.location.hostname.split('.');
      if (4 === b.length) {
        var c = b[b.length - 1];
        if (parseInt(c, 10).toString() === c) return ['none'];
      }
      for (var d = b.length - 2; 0 <= d; d--) a.push(b.slice(d).join('.'));
      var e = window.document.location.hostname;
      Nf.test(e) || Mf.test(e) || a.push('none');
      return a;
    },
    Af = function (a) {
      if (!wd(Hc) || !a || !Hd()) return !0;
      if (!Gd(a)) return !1;
      var b = Ed(a);
      return null == b ? !0 : !!b;
    };
  var Of = function () {
      return [Math.round(2147483647 * Math.random()), Math.round(Pa() / 1e3)].join('.');
    },
    Uf = function (a, b, c, d, e) {
      var f = Pf(b);
      return Ff(a, f, Tf(c), d, e);
    },
    Vf = function (a, b, c, d) {
      var e = '' + Pf(c),
        f = Tf(d);
      1 < f && (e += '-' + f);
      return [b, e, a].join('.');
    },
    Pf = function (a) {
      if (!a) return 1;
      a = 0 === a.indexOf('.') ? a.substr(1) : a;
      return a.split('.').length;
    },
    Tf = function (a) {
      if (!a || '/' === a) return 1;
      '/' !== a[0] && (a = '/' + a);
      '/' !== a[a.length - 1] && (a += '/');
      return a.split('/').length - 1;
    };
  function Wf(a, b, c) {
    var d,
      e = Number(null != a.Wa ? a.Wa : void 0);
    0 !== e && (d = new Date((b || Pa()) + 1e3 * (e || 7776e3)));
    return { path: a.path, domain: a.domain, flags: a.flags, encode: !!c, expires: d };
  }
  var Xf = ['1'],
    Yf = {},
    bg = function (a) {
      var b = Zf(a.prefix);
      if (!Yf[b] && !$f(b, a.path, a.domain)) {
        var c = Of();
        if (0 === ag(b, c, a)) {
          var d = ed('google_tag_data', {});
          d._gcl_au ? ta('GTM', 57) : (d._gcl_au = c);
        }
        $f(b, a.path, a.domain);
      }
    };
  function ag(a, b, c) {
    var d = Vf(b, '1', c.domain, c.path),
      e = Wf(c);
    e.Ia = 'ad_storage';
    return Lf(a, d, e);
  }
  function $f(a, b, c) {
    var d = Uf(a, b, c, Xf, 'ad_storage');
    d && (Yf[a] = d);
    return d;
  }
  function Zf(a) {
    return (a || '_gcl') + '_au';
  }
  var cg = function (a) {
    for (
      var b = [],
        c = F.cookie.split(';'),
        d = new RegExp('^\\s*' + (a || '_gac') + '_(UA-\\d+-\\d+)=\\s*(.+?)\\s*$'),
        e = 0;
      e < c.length;
      e++
    ) {
      var f = c[e].match(d);
      f && b.push({ fe: f[1], value: f[2], timestamp: Number(f[2].split('.')[1]) || 0 });
    }
    b.sort(function (h, k) {
      return k.timestamp - h.timestamp;
    });
    return b;
  };
  function dg(a, b) {
    var c = cg(a),
      d = {};
    if (!c || !c.length) return d;
    for (var e = 0; e < c.length; e++) {
      var f = c[e].value.split('.');
      if (!('1' !== f[0] || (b && 3 > f.length) || (!b && 3 !== f.length)) && Number(f[1])) {
        d[c[e].fe] || (d[c[e].fe] = []);
        var h = { version: f[0], timestamp: 1e3 * Number(f[1]), na: f[2] };
        b && 3 < f.length && (h.labels = f.slice(3));
        d[c[e].fe].push(h);
      }
    }
    return d;
  }
  function eg() {
    for (var a = fg, b = {}, c = 0; c < a.length; ++c) b[a[c]] = c;
    return b;
  }
  function gg() {
    var a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    a += a.toLowerCase() + '0123456789-_';
    return a + '.';
  }
  var fg, hg;
  function ig(a) {
    function b(l) {
      for (; d < a.length; ) {
        var n = a.charAt(d++),
          p = hg[n];
        if (null != p) return p;
        if (!/^[\s\xa0]*$/.test(n)) throw Error('Unknown base64 encoding at char: ' + n);
      }
      return l;
    }
    fg = fg || gg();
    hg = hg || eg();
    for (var c = '', d = 0; ; ) {
      var e = b(-1),
        f = b(0),
        h = b(64),
        k = b(64);
      if (64 === k && -1 === e) return c;
      c += String.fromCharCode((e << 2) | (f >> 4));
      64 != h &&
        ((c += String.fromCharCode(((f << 4) & 240) | (h >> 2))),
        64 != k && (c += String.fromCharCode(((h << 6) & 192) | k)));
    }
  }
  var jg;
  var ng = function () {
      var a = kg,
        b = lg,
        c = mg(),
        d = function (h) {
          a(h.target || h.srcElement || {});
        },
        e = function (h) {
          b(h.target || h.srcElement || {});
        };
      if (!c.init) {
        kd(F, 'mousedown', d);
        kd(F, 'keyup', d);
        kd(F, 'submit', e);
        var f = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function () {
          b(this);
          f.call(this);
        };
        c.init = !0;
      }
    },
    og = function (a, b, c, d, e) {
      var f = { callback: a, domains: b, fragment: 2 === c, placement: c, forms: d, sameHost: e };
      mg().decorators.push(f);
    },
    pg = function (a, b, c) {
      for (var d = mg().decorators, e = {}, f = 0; f < d.length; ++f) {
        var h = d[f],
          k;
        if ((k = !c || h.forms))
          a: {
            var l = h.domains,
              n = a,
              p = !!h.sameHost;
            if (l && (p || n !== F.location.hostname))
              for (var r = 0; r < l.length; r++)
                if (l[r] instanceof RegExp) {
                  if (l[r].test(n)) {
                    k = !0;
                    break a;
                  }
                } else if (0 <= n.indexOf(l[r]) || (p && 0 <= l[r].indexOf(n))) {
                  k = !0;
                  break a;
                }
            k = !1;
          }
        if (k) {
          var q = h.placement;
          void 0 == q && (q = h.fragment ? 2 : 1);
          q === b && Ta(e, h.callback());
        }
      }
      return e;
    },
    mg = function () {
      var a = ed('google_tag_data', {}),
        b = a.gl;
      (b && b.decorators) || ((b = { decorators: [] }), (a.gl = b));
      return b;
    };
  var qg = /(.*?)\*(.*?)\*(.*)/,
    rg = /^https?:\/\/([^\/]*?)\.?cdn\.ampproject\.org\/?(.*)/,
    sg = /^(?:www\.|m\.|amp\.)+/,
    tg = /([^?#]+)(\?[^#]*)?(#.*)?/;
  function ug(a) {
    return new RegExp('(.*?)(^|&)' + a + '=([^&]*)&?(.*)');
  }
  var wg = function (a) {
      var b = [],
        c;
      for (c in a)
        if (a.hasOwnProperty(c)) {
          var d = a[c];
          if (void 0 !== d && d === d && null !== d && '[object Object]' !== d.toString()) {
            b.push(c);
            var e = b,
              f = e.push,
              h,
              k = String(d);
            fg = fg || gg();
            hg = hg || eg();
            for (var l = [], n = 0; n < k.length; n += 3) {
              var p = n + 1 < k.length,
                r = n + 2 < k.length,
                q = k.charCodeAt(n),
                t = p ? k.charCodeAt(n + 1) : 0,
                u = r ? k.charCodeAt(n + 2) : 0,
                v = q >> 2,
                x = ((q & 3) << 4) | (t >> 4),
                z = ((t & 15) << 2) | (u >> 6),
                w = u & 63;
              r || ((w = 64), p || (z = 64));
              l.push(fg[v], fg[x], fg[z], fg[w]);
            }
            h = l.join('');
            f.call(e, h);
          }
        }
      var y = b.join('*');
      return ['1', vg(y), y].join('*');
    },
    vg = function (a, b) {
      var c = [
          window.navigator.userAgent,
          new Date().getTimezoneOffset(),
          window.navigator.userLanguage || window.navigator.language,
          Math.floor(new Date().getTime() / 60 / 1e3) - (void 0 === b ? 0 : b),
          a,
        ].join('*'),
        d;
      if (!(d = jg)) {
        for (var e = Array(256), f = 0; 256 > f; f++) {
          for (var h = f, k = 0; 8 > k; k++) h = h & 1 ? (h >>> 1) ^ 3988292384 : h >>> 1;
          e[f] = h;
        }
        d = e;
      }
      jg = d;
      for (var l = 4294967295, n = 0; n < c.length; n++) l = (l >>> 8) ^ jg[(l ^ c.charCodeAt(n)) & 255];
      return ((l ^ -1) >>> 0).toString(36);
    },
    yg = function () {
      return function (a) {
        var b = me(D.location.href),
          c = b.search.replace('?', ''),
          d = he(c, '_gl', !0) || '';
        a.query = xg(d) || {};
        var e = ke(b, 'fragment').match(ug('_gl'));
        a.fragment = xg((e && e[3]) || '') || {};
      };
    },
    zg = function (a) {
      var b = yg(),
        c = mg();
      c.data || ((c.data = { query: {}, fragment: {} }), b(c.data));
      var d = {},
        e = c.data;
      e && (Ta(d, e.query), a && Ta(d, e.fragment));
      return d;
    },
    xg = function (a) {
      var b;
      b = void 0 === b ? 3 : b;
      try {
        if (a) {
          var c;
          a: {
            for (var d = a, e = 0; 3 > e; ++e) {
              var f = qg.exec(d);
              if (f) {
                c = f;
                break a;
              }
              d = decodeURIComponent(d);
            }
            c = void 0;
          }
          var h = c;
          if (h && '1' === h[1]) {
            var k = h[3],
              l;
            a: {
              for (var n = h[2], p = 0; p < b; ++p)
                if (n === vg(k, p)) {
                  l = !0;
                  break a;
                }
              l = !1;
            }
            if (l) {
              for (var r = {}, q = k ? k.split('*') : [], t = 0; t < q.length; t += 2) r[q[t]] = ig(q[t + 1]);
              return r;
            }
          }
        }
      } catch (u) {}
    };
  function Ag(a, b, c, d) {
    function e(p) {
      var r = p,
        q = ug(a).exec(r),
        t = r;
      if (q) {
        var u = q[2],
          v = q[4];
        t = q[1];
        v && (t = t + u + v);
      }
      p = t;
      var x = p.charAt(p.length - 1);
      p && '&' !== x && (p += '&');
      return p + n;
    }
    d = void 0 === d ? !1 : d;
    var f = tg.exec(c);
    if (!f) return '';
    var h = f[1],
      k = f[2] || '',
      l = f[3] || '',
      n = a + '=' + b;
    d ? (l = '#' + e(l.substring(1))) : (k = '?' + e(k.substring(1)));
    return '' + h + k + l;
  }
  function Bg(a, b) {
    var c = 'FORM' === (a.tagName || '').toUpperCase(),
      d = pg(b, 1, c),
      e = pg(b, 2, c),
      f = pg(b, 3, c);
    if (Ua(d)) {
      var h = wg(d);
      c ? Cg('_gl', h, a) : Dg('_gl', h, a, !1);
    }
    if (!c && Ua(e)) {
      var k = wg(e);
      Dg('_gl', k, a, !0);
    }
    for (var l in f)
      if (f.hasOwnProperty(l))
        a: {
          var n = l,
            p = f[l],
            r = a;
          if (r.tagName) {
            if ('a' === r.tagName.toLowerCase()) {
              Dg(n, p, r, void 0);
              break a;
            }
            if ('form' === r.tagName.toLowerCase()) {
              Cg(n, p, r);
              break a;
            }
          }
          'string' == typeof r && Ag(n, p, r, void 0);
        }
  }
  function Dg(a, b, c, d) {
    if (c.href) {
      var e = Ag(a, b, c.href, void 0 === d ? !1 : d);
      Qc.test(e) && (c.href = e);
    }
  }
  function Cg(a, b, c) {
    if (c && c.action) {
      var d = (c.method || '').toLowerCase();
      if ('get' === d) {
        for (var e = c.childNodes || [], f = !1, h = 0; h < e.length; h++) {
          var k = e[h];
          if (k.name === a) {
            k.setAttribute('value', b);
            f = !0;
            break;
          }
        }
        if (!f) {
          var l = F.createElement('input');
          l.setAttribute('type', 'hidden');
          l.setAttribute('name', a);
          l.setAttribute('value', b);
          c.appendChild(l);
        }
      } else if ('post' === d) {
        var n = Ag(a, b, c.action);
        Qc.test(n) && (c.action = n);
      }
    }
  }
  var kg = function (a) {
      try {
        var b;
        a: {
          for (var c = a, d = 100; c && 0 < d; ) {
            if (c.href && c.nodeName.match(/^a(?:rea)?$/i)) {
              b = c;
              break a;
            }
            c = c.parentNode;
            d--;
          }
          b = null;
        }
        var e = b;
        if (e) {
          var f = e.protocol;
          ('http:' !== f && 'https:' !== f) || Bg(e, e.hostname);
        }
      } catch (h) {}
    },
    lg = function (a) {
      try {
        if (a.action) {
          var b = ke(me(a.action), 'host');
          Bg(a, b);
        }
      } catch (c) {}
    },
    Eg = function (a, b, c, d) {
      ng();
      og(a, b, 'fragment' === c ? 2 : 1, !!d, !1);
    },
    Fg = function (a, b) {
      ng();
      og(a, [je(D.location, 'host', !0)], b, !0, !0);
    },
    Gg = function () {
      var a = F.location.hostname,
        b = rg.exec(F.referrer);
      if (!b) return !1;
      var c = b[2],
        d = b[1],
        e = '';
      if (c) {
        var f = c.split('/'),
          h = f[1];
        e = 's' === h ? decodeURIComponent(f[2]) : decodeURIComponent(h);
      } else if (d) {
        if (0 === d.indexOf('xn--')) return !1;
        e = d.replace(/-/g, '.').replace(/\.\./g, '-');
      }
      var k = a.replace(sg, ''),
        l = e.replace(sg, ''),
        n;
      if (!(n = k === l)) {
        var p = '.' + l;
        n = k.substring(k.length - p.length, k.length) === p;
      }
      return n;
    },
    Hg = function (a, b) {
      return !1 === a ? !1 : a || b || Gg();
    };
  var Ig = {};
  var Jg = /^\w+$/,
    Kg = /^[\w-]+$/,
    Lg = { aw: '_aw', dc: '_dc', gf: '_gf', ha: '_ha', gp: '_gp', gb: '_gb' },
    Mg = function () {
      if (!wd(Hc) || !Hd()) return !0;
      var a = Ed('ad_storage');
      return null == a ? !0 : !!a;
    },
    Ng = function (a, b) {
      Gd('ad_storage')
        ? Mg()
          ? a()
          : Ld(a, 'ad_storage')
        : b
        ? ta('TAGGING', 3)
        : Kd(
            function () {
              Ng(a, !0);
            },
            ['ad_storage'],
          );
    },
    Pg = function (a) {
      return Og(a).map(function (b) {
        return b.na;
      });
    },
    Og = function (a) {
      var b = [];
      if (!zf(D) || !F.cookie) return b;
      var c = Cf(a, F.cookie, void 0, 'ad_storage');
      if (!c || 0 == c.length) return b;
      for (var d = {}, e = 0; e < c.length; d = { $b: d.$b }, e++) {
        var f = Qg(c[e]);
        if (null != f) {
          var h = f,
            k = h.version;
          d.$b = h.na;
          var l = h.timestamp,
            n = h.labels,
            p = Ba(
              b,
              (function (r) {
                return function (q) {
                  return q.na === r.$b;
                };
              })(d),
            );
          p
            ? ((p.timestamp = Math.max(p.timestamp, l)), (p.labels = Rg(p.labels, n || [])))
            : b.push({ version: k, na: d.$b, timestamp: l, labels: n });
        }
      }
      b.sort(function (r, q) {
        return q.timestamp - r.timestamp;
      });
      return Sg(b);
    };
  function Rg(a, b) {
    for (var c = {}, d = [], e = 0; e < a.length; e++) (c[a[e]] = !0), d.push(a[e]);
    for (var f = 0; f < b.length; f++) c[b[f]] || d.push(b[f]);
    return d;
  }
  function Tg(a) {
    return a && 'string' == typeof a && a.match(Jg) ? a : '_gcl';
  }
  var Vg = function () {
      var a = me(D.location.href),
        b = ke(a, 'query', !1, void 0, 'gclid'),
        c = ke(a, 'query', !1, void 0, 'gclsrc'),
        d = ke(a, 'query', !1, void 0, 'wbraid'),
        e = ke(a, 'query', !1, void 0, 'dclid');
      if (!b || !c || !d) {
        var f = a.hash.replace('#', '');
        b = b || he(f, 'gclid', void 0);
        c = c || he(f, 'gclsrc', void 0);
        d = d || he(f, 'wbraid', void 0);
      }
      return Ug(b, c, e, d);
    },
    Ug = function (a, b, c, d) {
      var e = {},
        f = function (h, k) {
          e[k] || (e[k] = []);
          e[k].push(h);
        };
      e.gclid = a;
      e.gclsrc = b;
      e.dclid = c;
      void 0 !== d && Kg.test(d) && ((e.gbraid = d), f(d, 'gb'));
      if (void 0 !== a && a.match(Kg))
        switch (b) {
          case void 0:
            f(a, 'aw');
            break;
          case 'aw.ds':
            f(a, 'aw');
            f(a, 'dc');
            break;
          case 'ds':
            f(a, 'dc');
            break;
          case '3p.ds':
            f(a, 'dc');
            break;
          case 'gf':
            f(a, 'gf');
            break;
          case 'ha':
            f(a, 'ha');
        }
      c && f(c, 'dc');
      return e;
    },
    Wg = function (a, b) {
      switch (a) {
        case void 0:
        case 'aw':
          return 'aw' === b;
        case 'aw.ds':
          return 'aw' === b || 'dc' === b;
        case 'ds':
        case '3p.ds':
          return 'dc' === b;
        case 'gf':
          return 'gf' === b;
        case 'ha':
          return 'ha' === b;
      }
      return !1;
    },
    Yg = function (a) {
      var b = Vg();
      Ng(function () {
        Xg(b, a);
      });
    };
  function Xg(a, b, c, d) {
    function e(p, r) {
      var q = Zg(p, f);
      q && (Lf(q, r, h), (k = !0));
    }
    b = b || {};
    d = d || [];
    var f = Tg(b.prefix);
    c = c || Pa();
    var h = Wf(b, c, !0);
    h.Ia = 'ad_storage';
    var k = !1,
      l = Math.round(c / 1e3),
      n = function (p) {
        var r = ['GCL', l, p];
        0 < d.length && r.push(d.join('.'));
        return r.join('.');
      };
    a.aw && e('aw', n(a.aw[0]));
    a.dc && e('dc', n(a.dc[0]));
    a.gf && e('gf', n(a.gf[0]));
    a.ha && e('ha', n(a.ha[0]));
    a.gp && e('gp', n(a.gp[0]));
    (void 0 == Ig.enable_gbraid_cookie_write ? 0 : Ig.enable_gbraid_cookie_write) && !k && a.gb && e('gb', n(a.gb[0]));
  }
  var ah = function (a, b) {
      var c = zg(!0);
      Ng(function () {
        for (var d = Tg(b.prefix), e = 0; e < a.length; ++e) {
          var f = a[e];
          if (void 0 !== Lg[f]) {
            var h = Zg(f, d),
              k = c[h];
            if (k) {
              var l = Math.min($g(k), Pa()),
                n;
              b: {
                var p = l,
                  r = h;
                if (zf(D))
                  for (var q = Cf(r, F.cookie, void 0, 'ad_storage'), t = 0; t < q.length; ++t)
                    if ($g(q[t]) > p) {
                      n = !0;
                      break b;
                    }
                n = !1;
              }
              if (!n) {
                var u = Wf(b, l, !0);
                u.Ia = 'ad_storage';
                Lf(h, k, u);
              }
            }
          }
        }
        Xg(Ug(c.gclid, c.gclsrc), b);
      });
    },
    Zg = function (a, b) {
      var c = Lg[a];
      if (void 0 !== c) return b + c;
    },
    $g = function (a) {
      return 0 !== bh(a.split('.')).length ? 1e3 * (Number(a.split('.')[1]) || 0) : 0;
    };
  function Qg(a) {
    var b = bh(a.split('.'));
    return 0 === b.length
      ? null
      : { version: b[0], na: b[2], timestamp: 1e3 * (Number(b[1]) || 0), labels: b.slice(3) };
  }
  function bh(a) {
    return 3 > a.length || ('GCL' !== a[0] && '1' !== a[0]) || !/^\d+$/.test(a[1]) || !Kg.test(a[2]) ? [] : a;
  }
  var ch = function (a, b, c, d, e) {
      if (ya(b) && zf(D)) {
        var f = Tg(e),
          h = function () {
            for (var k = {}, l = 0; l < a.length; ++l) {
              var n = Zg(a[l], f);
              if (n) {
                var p = Cf(n, F.cookie, void 0, 'ad_storage');
                p.length && (k[n] = p.sort()[p.length - 1]);
              }
            }
            return k;
          };
        Ng(function () {
          Eg(h, b, c, d);
        });
      }
    },
    Sg = function (a) {
      return a.filter(function (b) {
        return Kg.test(b.na);
      });
    },
    dh = function (a, b) {
      if (zf(D)) {
        for (var c = Tg(b.prefix), d = {}, e = 0; e < a.length; e++) Lg[a[e]] && (d[a[e]] = Lg[a[e]]);
        Ng(function () {
          Fa(d, function (f, h) {
            var k = Cf(c + h, F.cookie, void 0, 'ad_storage');
            k.sort(function (t, u) {
              return $g(u) - $g(t);
            });
            if (k.length) {
              var l = k[0],
                n = $g(l),
                p = 0 !== bh(l.split('.')).length ? l.split('.').slice(3) : [],
                r = {},
                q;
              q = 0 !== bh(l.split('.')).length ? l.split('.')[2] : void 0;
              r[f] = [q];
              Xg(r, b, n, p);
            }
          });
        });
      }
    };
  function eh(a, b) {
    for (var c = 0; c < b.length; ++c) if (a[b[c]]) return !0;
    return !1;
  }
  var fh = function (a) {
    function b(e, f, h) {
      h && (e[f] = h);
    }
    if (Hd()) {
      var c = Vg();
      if (eh(c, a)) {
        var d = {};
        b(d, 'gclid', c.gclid);
        b(d, 'dclid', c.dclid);
        b(d, 'gclsrc', c.gclsrc);
        b(d, 'wbraid', c.gbraid);
        Fg(function () {
          return d;
        }, 3);
        Fg(function () {
          var e = {};
          return (e._up = '1'), e;
        }, 1);
      }
    }
  };
  function gh(a, b) {
    var c = Tg(b),
      d = Zg(a, c);
    if (!d) return 0;
    for (var e = Og(d), f = 0, h = 0; h < e.length; h++) f = Math.max(f, e[h].timestamp);
    return f;
  }
  function hh(a) {
    var b = 0,
      c;
    for (c in a) for (var d = a[c], e = 0; e < d.length; e++) b = Math.max(b, Number(d[e].timestamp));
    return b;
  }
  var ih = /^\d+\.fls\.doubleclick\.net$/;
  function jh(a, b) {
    Gd(B.B)
      ? J(B.B)
        ? a()
        : Ld(a, B.B)
      : b
      ? Ec(42)
      : Sd(
          function () {
            jh(a, !0);
          },
          [B.B],
        );
  }
  function kh(a) {
    var b = me(D.location.href),
      c = ke(b, 'host', !1);
    if (c && c.match(ih)) {
      var d = ke(b, 'path').split(a + '=');
      if (1 < d.length) return d[1].split(';')[0].split('?')[0];
    }
  }
  function lh(a, b, c) {
    if ('aw' === a || 'dc' === a || 'gb' === a) {
      var d = kh('gcl' + a);
      if (d) return d.split('.');
    }
    var e = Tg(b);
    if ('_gcl' == e) {
      c = void 0 === c ? !0 : c;
      var f = !J(B.B) && c,
        h;
      h = Vg()[a] || [];
      if (0 < h.length) return f ? ['0'] : h;
    }
    var k = Zg(a, e);
    return k ? Pg(k) : [];
  }
  function mh(a) {
    var b = [];
    Fa(a, function (c, d) {
      d = Sg(d);
      for (var e = [], f = 0; f < d.length; f++) e.push(d[f].na);
      e.length && b.push(c + ':' + e.join(','));
    });
    return b.join(';');
  }
  var nh = function (a) {
      var b = kh('gac');
      return b ? (!J(B.B) && a ? '0' : decodeURIComponent(b)) : mh(Mg() ? dg() : {});
    },
    oh = function (a) {
      var b = kh('gacgb');
      return b ? (!J(B.B) && a ? '0' : decodeURIComponent(b)) : mh(Mg() ? dg('_gac_gb', !0) : {});
    },
    ph = function (a, b, c) {
      var d = Vg(),
        e = [],
        f = d.gclid,
        h = d.dclid,
        k = d.gclsrc || 'aw';
      !f || ('aw.ds' !== k && 'aw' !== k && 'ds' !== k) || (c && !Wg(k, c)) || e.push({ na: f, Ld: k });
      !h || (c && 'dc' !== c) || e.push({ na: h, Ld: 'ds' });
      jh(function () {
        bg(b);
        var l = Yf[Zf(b.prefix)],
          n = !1;
        if (l && 0 < e.length)
          for (var p = (M.joined_auid = M.joined_auid || {}), r = 0; r < e.length; r++) {
            var q = e[r],
              t = q.na,
              u = q.Ld,
              v = (b.prefix || '_gcl') + '.' + u + '.' + t;
            if (!p[v]) {
              var x = 'https://adservice.google.com/pagead/regclk';
              x = 'gb' === u ? x + '?gbraid=' + t + '&auid=' + l : x + '?gclid=' + t + '&auid=' + l + '&gclsrc=' + u;
              td(x);
              n = p[v] = !0;
            }
          }
        null == a && (a = n);
        if (a && l) {
          var z = Zf(b.prefix),
            w = Yf[z];
          w && ag(z, w, b);
        }
      });
    },
    qh = function (a) {
      var b;
      if (kh('gclaw') || kh('gac') || 0 < (Vg().aw || []).length) b = !1;
      else {
        var c;
        if (0 < (Vg().gb || []).length) c = !0;
        else {
          var d = Math.max(gh('aw', a), hh(Mg() ? dg() : {}));
          c = Math.max(gh('gb', a), hh(Mg() ? dg('_gac_gb', !0) : {})) > d;
        }
        b = c;
      }
      return b;
    };
  var rh = /[A-Z]+/,
    sh = /\s/,
    th = function (a) {
      if (g(a) && ((a = Oa(a)), !sh.test(a))) {
        var b = a.indexOf('-');
        if (!(0 > b)) {
          var c = a.substring(0, b);
          if (rh.test(c)) {
            for (var d = a.substring(b + 1).split('/'), e = 0; e < d.length; e++) if (!d[e]) return;
            return { id: a, prefix: c, containerId: c + '-' + d[0], J: d };
          }
        }
      }
    },
    vh = function (a) {
      for (var b = {}, c = 0; c < a.length; ++c) {
        var d = th(a[c]);
        d && (b[d.id] = d);
      }
      uh(b);
      var e = [];
      Fa(b, function (f, h) {
        e.push(h);
      });
      return e;
    };
  function uh(a) {
    var b = [],
      c;
    for (c in a)
      if (a.hasOwnProperty(c)) {
        var d = a[c];
        'AW' === d.prefix && d.J[1] && b.push(d.containerId);
      }
    for (var e = 0; e < b.length; ++e) delete a[b[e]];
  }
  var wh = function () {
    var a = !1;
    return a;
  };
  var yh = function (a, b, c, d) {
      return (2 === xh() || d || 'http:' != D.location.protocol ? a : b) + c;
    },
    xh = function () {
      var a = hd(),
        b;
      if (1 === a)
        a: {
          var c = Ze;
          c = c.toLowerCase();
          for (
            var d = 'https://' + c, e = 'http://' + c, f = 1, h = F.getElementsByTagName('script'), k = 0;
            k < h.length && 100 > k;
            k++
          ) {
            var l = h[k].src;
            if (l) {
              l = l.toLowerCase();
              if (0 === l.indexOf(e)) {
                b = 3;
                break a;
              }
              1 === f && 0 === l.indexOf(d) && (f = 2);
            }
          }
          b = f;
        }
      else b = a;
      return b;
    };
  var Lh = function (a) {
      if (J(B.B)) return a;
      a = a.replace(/&url=([^&#]+)/, function (b, c) {
        var d = ne(decodeURIComponent(c));
        return '&url=' + encodeURIComponent(d);
      });
      a = a.replace(/&ref=([^&#]+)/, function (b, c) {
        var d = ne(decodeURIComponent(c));
        return '&ref=' + encodeURIComponent(d);
      });
      return a;
    },
    Mh = function () {
      var a;
      if (!(a = $e)) {
        var b;
        if (!0 === D._gtmdgs) b = !0;
        else {
          var c = (cd && cd.userAgent) || '';
          b =
            0 > c.indexOf('Safari') ||
            /Chrome|Coast|Opera|Edg|Silk|Android/.test(c) ||
            11 > ((/Version\/([\d]+)/.exec(c) || [])[1] || '')
              ? !1
              : !0;
        }
        a = !b;
      }
      if (a) return -1;
      var d = Ja('1');
      return xf(1, 100) < d ? xf(2, 2) : -1;
    },
    Nh = function (a) {
      var b;
      if (!a || !a.length) return;
      for (var c = [], d = 0; d < a.length; ++d) {
        var e = a[d];
        e && e.estimated_delivery_date ? c.push('' + e.estimated_delivery_date) : c.push('');
      }
      b = c.join(',');
      return b;
    };
  var Oh = new RegExp(/^(.*\.)?(google|youtube|blogger|withgoogle)(\.com?)?(\.[a-z]{2})?\.?$/),
    Ph = {
      cl: ['ecl'],
      customPixels: ['nonGooglePixels'],
      ecl: ['cl'],
      ehl: ['hl'],
      hl: ['ehl'],
      html: ['customScripts', 'customPixels', 'nonGooglePixels', 'nonGoogleScripts', 'nonGoogleIframes'],
      customScripts: ['html', 'customPixels', 'nonGooglePixels', 'nonGoogleScripts', 'nonGoogleIframes'],
      nonGooglePixels: [],
      nonGoogleScripts: ['nonGooglePixels'],
      nonGoogleIframes: ['nonGooglePixels'],
    },
    Qh = {
      cl: ['ecl'],
      customPixels: ['customScripts', 'html'],
      ecl: ['cl'],
      ehl: ['hl'],
      hl: ['ehl'],
      html: ['customScripts'],
      customScripts: ['html'],
      nonGooglePixels: ['customPixels', 'customScripts', 'html', 'nonGoogleScripts', 'nonGoogleIframes'],
      nonGoogleScripts: ['customScripts', 'html'],
      nonGoogleIframes: ['customScripts', 'html', 'nonGoogleScripts'],
    },
    Rh = 'google customPixels customScripts html nonGooglePixels nonGoogleScripts nonGoogleIframes'.split(' ');
  var Sh = function () {
      var a = !1;
      a = !0;
      return a;
    },
    Uh = function (a) {
      var b = mf('gtm.allowlist') || mf('gtm.whitelist');
      b && Ec(9);
      Sh() && (b = 'google gtagfl lcl zone oid op'.split(' '));
      var c = b && Va(Na(b), Ph),
        d = mf('gtm.blocklist') || mf('gtm.blacklist');
      d || ((d = mf('tagTypeBlacklist')) && Ec(3));
      d ? Ec(8) : (d = []);
      Th() && ((d = Na(d)), d.push('nonGooglePixels', 'nonGoogleScripts', 'sandboxedScripts'));
      0 <= za(Na(d), 'google') && Ec(2);
      var e = d && Va(Na(d), Qh),
        f = {};
      return function (h) {
        var k = h && h[eb.Sa];
        if (!k || 'string' != typeof k) return !0;
        k = k.replace(/^_*/, '');
        if (void 0 !== f[k]) return f[k];
        var l = ef[k] || [],
          n = a(k, l);
        if (b) {
          var p;
          if ((p = n))
            a: {
              if (0 > za(c, k))
                if (l && 0 < l.length)
                  for (var r = 0; r < l.length; r++) {
                    if (0 > za(c, l[r])) {
                      Ec(11);
                      p = !1;
                      break a;
                    }
                  }
                else {
                  p = !1;
                  break a;
                }
              p = !0;
            }
          n = p;
        }
        var q = !1;
        if (d) {
          var t = 0 <= za(e, k);
          if (t) q = t;
          else {
            var u = Ea(e, l || []);
            u && Ec(10);
            q = u;
          }
        }
        var v = !n || q;
        v || !(0 <= za(l, 'sandboxedScripts')) || (c && -1 !== za(c, 'sandboxedScripts')) || (v = Ea(e, Rh));
        return (f[k] = v);
      };
    },
    Th = function () {
      return Oh.test(D.location && D.location.hostname);
    };
  var Vh = {
      active: !0,
      isAllowed: function () {
        return !0;
      },
    },
    Wh = function (a) {
      var b = M.zones;
      return b ? b.checkState(Te.K, a) : Vh;
    },
    Xh = function (a) {
      var b = M.zones;
      !b && a && (b = M.zones = a());
      return b;
    };
  var Yh = function () {},
    Zh = function () {};
  var $h = !1,
    ai = 0,
    bi = [];
  function ci(a) {
    if (!$h) {
      var b = F.createEventObject,
        c = 'complete' == F.readyState,
        d = 'interactive' == F.readyState;
      if (!a || 'readystatechange' != a.type || c || (!b && d)) {
        $h = !0;
        for (var e = 0; e < bi.length; e++) I(bi[e]);
      }
      bi.push = function () {
        for (var f = 0; f < arguments.length; f++) I(arguments[f]);
        return 0;
      };
    }
  }
  function di() {
    if (!$h && 140 > ai) {
      ai++;
      try {
        F.documentElement.doScroll('left'), ci();
      } catch (a) {
        D.setTimeout(di, 50);
      }
    }
  }
  var ei = function (a) {
    $h ? a() : bi.push(a);
  };
  var gi = function (a, b) {
      this.m = !1;
      this.H = [];
      this.W = { tags: [] };
      this.da = !1;
      this.o = this.C = 0;
      fi(this, a, b);
    },
    hi = function (a, b, c, d) {
      if (We.hasOwnProperty(b) || '__zone' === b) return -1;
      var e = {};
      cb(d) && (e = m(d, e));
      e.id = c;
      e.status = 'timeout';
      return a.W.tags.push(e) - 1;
    },
    ii = function (a, b, c, d) {
      var e = a.W.tags[b];
      e && ((e.status = c), (e.executionTime = d));
    },
    ji = function (a) {
      if (!a.m) {
        for (var b = a.H, c = 0; c < b.length; c++) b[c]();
        a.m = !0;
        a.H.length = 0;
      }
    },
    fi = function (a, b, c) {
      wa(b) && ki(a, b);
      c &&
        D.setTimeout(function () {
          return ji(a);
        }, Number(c));
    },
    ki = function (a, b) {
      var c = Sa(function () {
        return I(function () {
          b(Te.K, a.W);
        });
      });
      a.m ? c() : a.H.push(c);
    },
    li = function (a) {
      a.C++;
      return Sa(function () {
        a.o++;
        a.da && a.o >= a.C && ji(a);
      });
    };
  var mi = function () {
      function a(d) {
        return !xa(d) || 0 > d ? 0 : d;
      }
      if (!M._li && D.performance && D.performance.timing) {
        var b = D.performance.timing.navigationStart,
          c = xa(nf.get('gtm.start')) ? nf.get('gtm.start') : 0;
        M._li = { cst: a(c - b), cbt: a(bf - b) };
      }
    },
    ni = function (a) {
      D.performance && D.performance.mark(Te.K + '_' + a + '_start');
    },
    oi = function (a) {
      if (D.performance) {
        var b = Te.K + '_' + a + '_start',
          c = Te.K + '_' + a + '_duration';
        D.performance.measure(c, b);
        var d = D.performance.getEntriesByName(c)[0];
        D.performance.clearMarks(b);
        D.performance.clearMeasures(c);
        var e = M._p || {};
        void 0 === e[a] && ((e[a] = d.duration), (M._p = e));
        return d.duration;
      }
    },
    ti = function () {
      if (D.performance && D.performance.now) {
        var a = M._p || {};
        a.PAGEVIEW = D.performance.now();
        M._p = a;
      }
    };
  var ui = {},
    vi = function () {
      return D.GoogleAnalyticsObject && D[D.GoogleAnalyticsObject];
    },
    wi = !1;
  var Bi = function (a) {},
    Ai = function () {
      return D.GoogleAnalyticsObject || 'ga';
    },
    Ci = function (a, b) {
      return function () {
        var c = vi(),
          d = c && c.getByName && c.getByName(a);
        if (d) {
          var e = d.get('sendHitTask');
          d.set('sendHitTask', function (f) {
            var h = f.get('hitPayload'),
              k = f.get('hitCallback'),
              l = 0 > h.indexOf('&tid=' + b);
            l &&
              (f.set('hitPayload', h.replace(/&tid=UA-[0-9]+-[0-9]+/, '&tid=' + b), !0),
              f.set('hitCallback', void 0, !0));
            e(f);
            l && (f.set('hitPayload', h, !0), f.set('hitCallback', k, !0), f.set('_x_19', void 0, !0), e(f));
          });
        }
      };
    };
  var Ki = function () {},
    Li = function () {
      return (
        '&tc=' +
        Nb.filter(function (a) {
          return a;
        }).length
      );
    },
    Oi = function () {
      2022 <= Mi().length && Ni();
    },
    Qi = function () {
      Pi || (Pi = D.setTimeout(Ni, 500));
    },
    Ni = function () {
      Pi && (D.clearTimeout(Pi), (Pi = void 0));
      void 0 === Ri ||
        (Si[Ri] && !Ti && !Ui) ||
        (Vi[Ri] || Wi.uh() || 0 >= Xi--
          ? (Ec(1), (Vi[Ri] = !0))
          : (Wi.Mh(), jd(Mi()), (Si[Ri] = !0), (Yi = Zi = $i = Ui = Ti = '')));
    },
    Mi = function () {
      var a = Ri;
      if (void 0 === a) return '';
      var b = ua('GTM'),
        c = ua('TAGGING');
      return [
        aj,
        Si[a] ? '' : '&es=1',
        bj[a],
        b ? '&u=' + b : '',
        c ? '&ut=' + c : '',
        Li(),
        Ti,
        Ui,
        $i,
        Zi,
        Ki(),
        Yi,
        '&z=0',
      ].join('');
    },
    dj = function () {
      aj = cj();
    },
    cj = function () {
      return [cf, '&v=3&t=t', '&pid=' + Ca(), '&rv=' + Te.zc].join('');
    },
    Ji = Object.keys({ $h: 'L', gi: 'S', ii: 'Y' }).length,
    ej = '0.005000' > Math.random(),
    aj = cj(),
    Si = {},
    Ti = '',
    Ui = '',
    Yi = '',
    Zi = '',
    Ii = {},
    Hi = !1,
    $i = '',
    Ri = void 0,
    bj = {},
    Vi = {},
    Pi = void 0,
    Wi = (function (a, b) {
      var c = 0,
        d = 0;
      return {
        uh: function () {
          if (c < a) return !1;
          Pa() - d >= b && (c = 0);
          return c >= a;
        },
        Mh: function () {
          Pa() - d >= b && (c = 0);
          c++;
          d = Pa();
        },
      };
    })(2, 1e3),
    Xi = 1e3,
    fj = function (a, b, c) {
      if (ej && !Vi[a] && b) {
        a !== Ri && (Ni(), (Ri = a));
        var d,
          e = String(b[eb.Sa] || '').replace(/_/g, '');
        0 === e.indexOf('cvt') && (e = 'cvt');
        d = e;
        var f = c + d;
        Ti = Ti ? Ti + '.' + f : '&tr=' + f;
        var h = b['function'];
        if (!h) throw Error('Error: No function name given for function call.');
        var k = (Pb[h] ? '1' : '2') + d;
        Yi = Yi ? Yi + '.' + k : '&ti=' + k;
        Qi();
        Oi();
      }
    };
  var hj = function (a, b, c) {
      if (ej && !Vi[a]) {
        a !== Ri && (Ni(), (Ri = a));
        var d = c + b;
        Ui = Ui ? Ui + '.' + d : '&epr=' + d;
        Qi();
        Oi();
      }
    },
    ij = function (a, b, c) {};
  function jj(a, b, c, d) {
    var e = Nb[a],
      f = kj(a, b, c, d);
    if (!f) return null;
    var h = Ub(e[eb.ef], c, []);
    if (h && h.length) {
      var k = h[0];
      f = jj(k.index, { onSuccess: f, onFailure: 1 === k.vf ? b.terminate : f, terminate: b.terminate }, c, d);
    }
    return f;
  }
  function kj(a, b, c, d) {
    function e() {
      if (f[eb.Gg]) k();
      else {
        var x = Vb(f, c, []);
        var y = hi(c.Ta, String(f[eb.Sa]), Number(f[eb.ff]), x[eb.Hg]),
          A = !1;
        x.vtp_gtmOnSuccess = function () {
          if (!A) {
            A = !0;
            var H = Pa() - G;
            fj(c.id, Nb[a], '5');
            ii(c.Ta, y, 'success', H);
            h();
          }
        };
        x.vtp_gtmOnFailure = function () {
          if (!A) {
            A = !0;
            var H = Pa() - G;
            fj(c.id, Nb[a], '6');
            ii(c.Ta, y, 'failure', H);
            k();
          }
        };
        x.vtp_gtmTagId = f.tag_id;
        x.vtp_gtmEventId = c.id;
        fj(c.id, f, '1');
        var C = function () {
          var H = Pa() - G;
          fj(c.id, f, '7');
          ii(c.Ta, y, 'exception', H);
          A || ((A = !0), k());
        };
        var G = Pa();
        try {
          Tb(x, c);
        } catch (H) {
          C(H);
        }
      }
    }
    var f = Nb[a],
      h = b.onSuccess,
      k = b.onFailure,
      l = b.terminate;
    if (c.Rd(f)) return null;
    var n = Ub(f[eb.hf], c, []);
    if (n && n.length) {
      var p = n[0],
        r = jj(p.index, { onSuccess: h, onFailure: k, terminate: l }, c, d);
      if (!r) return null;
      h = r;
      k = 2 === p.vf ? l : r;
    }
    if (f[eb.Ye] || f[eb.Jg]) {
      var q = f[eb.Ye] ? Ob : c.Th,
        t = h,
        u = k;
      if (!q[a]) {
        e = Sa(e);
        var v = lj(a, q, e);
        h = v.onSuccess;
        k = v.onFailure;
      }
      return function () {
        q[a](t, u);
      };
    }
    return e;
  }
  function lj(a, b, c) {
    var d = [],
      e = [];
    b[a] = mj(d, e, c);
    return {
      onSuccess: function () {
        b[a] = nj;
        for (var f = 0; f < d.length; f++) d[f]();
      },
      onFailure: function () {
        b[a] = oj;
        for (var f = 0; f < e.length; f++) e[f]();
      },
    };
  }
  function mj(a, b, c) {
    return function (d, e) {
      a.push(d);
      b.push(e);
      c();
    };
  }
  function nj(a) {
    a();
  }
  function oj(a, b) {
    b();
  }
  var rj = function (a, b) {
    for (var c = [], d = 0; d < Nb.length; d++)
      if (a[d]) {
        var e = Nb[d];
        var f = li(b.Ta);
        try {
          var h = jj(d, { onSuccess: f, onFailure: f, terminate: f }, b, d);
          if (h) {
            var k = c,
              l = k.push,
              n = d,
              p = e['function'];
            if (!p) throw 'Error: No function name given for function call.';
            var r = Pb[p];
            l.call(k, { Mf: n, Ef: r ? r.priorityOverride || 0 : 0, ih: h });
          } else pj(d, b), f();
        } catch (u) {
          f();
        }
      }
    var q = b.Ta;
    q.da = !0;
    q.o >= q.C && ji(q);
    c.sort(qj);
    for (var t = 0; t < c.length; t++) c[t].ih();
    return 0 < c.length;
  };
  function qj(a, b) {
    var c,
      d = b.Ef,
      e = a.Ef;
    c = d > e ? 1 : d < e ? -1 : 0;
    var f;
    if (0 !== c) f = c;
    else {
      var h = a.Mf,
        k = b.Mf;
      f = h > k ? 1 : h < k ? -1 : 0;
    }
    return f;
  }
  function pj(a, b) {
    if (!ej) return;
    var c = function (d) {
      var e = b.Rd(Nb[d]) ? '3' : '4',
        f = Ub(Nb[d][eb.ef], b, []);
      f && f.length && c(f[0].index);
      fj(b.id, Nb[d], e);
      var h = Ub(Nb[d][eb.hf], b, []);
      h && h.length && c(h[0].index);
    };
    c(a);
  }
  var sj = !1,
    yj = function (a) {
      var b = a['gtm.uniqueEventId'],
        c = a.event;
      if ('gtm.js' === c) {
        if (sj) return !1;
        sj = !0;
      }
      var f = Wh(b),
        h = !1;
      if (!f.active) {
        if ('gtm.js' !== c) return !1;
        h = !0;
        f = Wh(Number.MAX_SAFE_INTEGER);
      }
      ej &&
        !Vi[b] &&
        Ri !== b &&
        (Ni(),
        (Ri = b),
        (Yi = Ti = ''),
        (bj[b] = '&e=' + (0 === c.indexOf('gtm.') ? encodeURIComponent(c) : '*') + '&eid=' + b),
        Qi());
      var k = a.eventCallback,
        l = a.eventTimeout,
        n = {
          id: b,
          name: c,
          Rd: Uh(f.isAllowed),
          Th: [],
          Af: function () {
            Ec(6);
          },
          pf: tj(b),
          Ta: new gi(k, l),
        };
      n.nf = uj();
      vj(b, n.Ta);
      var p = Zb(n);
      h && (p = wj(p));
      var r = rj(p, n);
      ('gtm.js' !== c && 'gtm.sync' !== c) || Bi(Te.K);
      switch (c) {
        case 'gtm.init':
          r && Ec(20);
      }
      return xj(p, r);
    };
  function tj(a) {
    return function (b) {
      ej && (db(b) || ij(a, 'input', b));
    };
  }
  function vj(a, b) {
    rf(a, 'event', 1);
    rf(a, 'ecommerce', 1);
    rf(a, 'gtm');
    rf(a, 'eventModel');
  }
  function uj() {
    var a = {};
    a.event = qf('event', 1);
    a.ecommerce = qf('ecommerce', 1);
    a.gtm = qf('gtm');
    a.eventModel = qf('eventModel');
    return a;
  }
  function wj(a) {
    for (var b = [], c = 0; c < a.length; c++) a[c] && Ve[String(Nb[c][eb.Sa])] && (b[c] = !0);
    return b;
  }
  function xj(a, b) {
    if (!b) return b;
    for (var c = 0; c < a.length; c++) if (a[c] && Nb[c] && !We[String(Nb[c][eb.Sa])]) return !0;
    return !1;
  }
  function zj(a, b) {
    if (a) {
      var c = '' + a;
      0 !== c.indexOf('http://') && 0 !== c.indexOf('https://') && (c = 'https://' + c);
      '/' === c[c.length - 1] && (c = c.substring(0, c.length - 1));
      return me('' + c + b).href;
    }
  }
  function Aj(a, b) {
    return Bj() ? zj(a, b) : void 0;
  }
  function Bj() {
    var a = !1;
    return a;
  }
  var Cj = function () {
      this.eventModel = {};
      this.targetConfig = {};
      this.containerConfig = {};
      this.remoteConfig = {};
      this.globalConfig = {};
      this.onSuccess = function () {};
      this.onFailure = function () {};
      this.setContainerTypeLoaded = function () {};
      this.getContainerTypeLoaded = function () {};
      this.eventId = void 0;
      this.isGtmEvent = !1;
    },
    Dj = function (a) {
      var b = new Cj();
      b.eventModel = a;
      return b;
    },
    Ej = function (a, b) {
      a.targetConfig = b;
      return a;
    },
    Fj = function (a, b) {
      a.containerConfig = b;
      return a;
    },
    Gj = function (a, b) {
      a.remoteConfig = b;
      return a;
    },
    Hj = function (a, b) {
      a.globalConfig = b;
      return a;
    },
    Ij = function (a, b) {
      a.onSuccess = b;
      return a;
    },
    Jj = function (a, b) {
      a.setContainerTypeLoaded = b;
      return a;
    },
    Kj = function (a, b) {
      a.getContainerTypeLoaded = b;
      return a;
    },
    Lj = function (a, b) {
      a.onFailure = b;
      return a;
    };
  Cj.prototype.getWithConfig = function (a) {
    if (void 0 !== this.eventModel[a]) return this.eventModel[a];
    if (void 0 !== this.targetConfig[a]) return this.targetConfig[a];
    if (void 0 !== this.containerConfig[a]) return this.containerConfig[a];
    if (void 0 !== this.remoteConfig[a]) return this.remoteConfig[a];
    if (void 0 !== this.globalConfig[a]) return this.globalConfig[a];
  };
  var Mj = function (a) {
    function b(e) {
      Fa(e, function (f) {
        c[f] = null;
      });
    }
    var c = {};
    b(a.eventModel);
    b(a.targetConfig);
    b(a.containerConfig);
    b(a.globalConfig);
    var d = [];
    Fa(c, function (e) {
      d.push(e);
    });
    return d;
  };
  var Nj;
  if (3 === Te.zc.length) Nj = 'g';
  else {
    var Oj = 'G';
    Oj = 'g';
    Nj = Oj;
  }
  var Pj = { '': 'n', 'UA': 'u', 'AW': 'a', 'DC': 'd', 'G': 'e', 'GF': 'f', 'HA': 'h', 'GTM': Nj, 'OPT': 'o' },
    Qj = function (a) {
      var b = Te.K.split('-'),
        c = b[0].toUpperCase(),
        d = Pj[c] || 'i',
        e = a && 'GTM' === c ? b[1] : 'OPT' === c ? b[1] : '',
        f;
      if (3 === Te.zc.length) {
        var h = 'w';
        h = wh() ? 's' : 'o';
        f = '2' + h;
      } else f = '';
      return f + d + Te.zc + e;
    };
  var Rj = function (a, b) {
    a.addEventListener && a.addEventListener.call(a, 'message', b, !1);
  };
  var Sj = function () {
    return Uc('iPhone') && !Uc('iPod') && !Uc('iPad');
  };
  Uc('Opera');
  Uc('Trident') || Uc('MSIE');
  Uc('Edge');
  !Uc('Gecko') ||
    (-1 != Rc.toLowerCase().indexOf('webkit') && !Uc('Edge')) ||
    Uc('Trident') ||
    Uc('MSIE') ||
    Uc('Edge');
  -1 != Rc.toLowerCase().indexOf('webkit') && !Uc('Edge') && Uc('Mobile');
  Uc('Macintosh');
  Uc('Windows');
  Uc('Linux') || Uc('CrOS');
  var Tj = pa.navigator || null;
  Tj && (Tj.appVersion || '').indexOf('X11');
  Uc('Android');
  Sj();
  Uc('iPad');
  Uc('iPod');
  Sj() || Uc('iPad') || Uc('iPod');
  Rc.toLowerCase().indexOf('kaios');
  var Uj = function (a, b) {
    for (var c = a, d = 0; 50 > d; ++d) {
      var e;
      try {
        e = !(!c.frames || !c.frames[b]);
      } catch (k) {
        e = !1;
      }
      if (e) return c;
      var f;
      a: {
        try {
          var h = c.parent;
          if (h && h != c) {
            f = h;
            break a;
          }
        } catch (k) {}
        f = null;
      }
      if (!(c = f)) break;
    }
    return null;
  };
  var Vj = function () {};
  var Wj = function (a) {
      void 0 !== a.addtlConsent && 'string' !== typeof a.addtlConsent && (a.addtlConsent = void 0);
      void 0 !== a.gdprApplies && 'boolean' !== typeof a.gdprApplies && (a.gdprApplies = void 0);
      return (void 0 !== a.tcString && 'string' !== typeof a.tcString) ||
        (void 0 !== a.listenerId && 'number' !== typeof a.listenerId)
        ? 2
        : a.cmpStatus && 'error' !== a.cmpStatus
        ? 0
        : 3;
    },
    Xj = function (a, b) {
      this.o = a;
      this.m = null;
      this.H = {};
      this.da = 0;
      this.W = void 0 === b ? 500 : b;
      this.C = null;
    };
  oa(Xj, Vj);
  var Zj = function (a) {
    return 'function' === typeof a.o.__tcfapi || null != Yj(a);
  };
  Xj.prototype.addEventListener = function (a) {
    var b = {},
      c = Kc(function () {
        return a(b);
      }),
      d = 0;
    -1 !== this.W &&
      (d = setTimeout(function () {
        b.tcString = 'tcunavailable';
        b.internalErrorState = 1;
        c();
      }, this.W));
    var e = function (f, h) {
      clearTimeout(d);
      f
        ? ((b = f),
          (b.internalErrorState = Wj(b)),
          (h && 0 === b.internalErrorState) || ((b.tcString = 'tcunavailable'), h || (b.internalErrorState = 3)))
        : ((b.tcString = 'tcunavailable'), (b.internalErrorState = 3));
      a(b);
    };
    try {
      ak(this, 'addEventListener', e);
    } catch (f) {
      (b.tcString = 'tcunavailable'), (b.internalErrorState = 3), d && (clearTimeout(d), (d = 0)), c();
    }
  };
  Xj.prototype.removeEventListener = function (a) {
    a && a.listenerId && ak(this, 'removeEventListener', null, a.listenerId);
  };
  var ck = function (a, b, c) {
      var d;
      d = void 0 === d ? '755' : d;
      var e;
      a: {
        if (a.publisher && a.publisher.restrictions) {
          var f = a.publisher.restrictions[b];
          if (void 0 !== f) {
            e = f[void 0 === d ? '755' : d];
            break a;
          }
        }
        e = void 0;
      }
      var h = e;
      if (0 === h) return !1;
      var k = c;
      2 === c ? ((k = 0), 2 === h && (k = 1)) : 3 === c && ((k = 1), 1 === h && (k = 0));
      var l;
      if (0 === k)
        if (a.purpose && a.vendor) {
          var n = bk(a.vendor.consents, void 0 === d ? '755' : d);
          l =
            n && '1' === b && a.purposeOneTreatment && ('DE' === a.publisherCC || (wd(Gc) && 'CH' === a.publisherCC))
              ? !0
              : n && bk(a.purpose.consents, b);
        } else l = !0;
      else
        l =
          1 === k
            ? a.purpose && a.vendor
              ? bk(a.purpose.legitimateInterests, b) && bk(a.vendor.legitimateInterests, void 0 === d ? '755' : d)
              : !0
            : !0;
      return l;
    },
    bk = function (a, b) {
      return !(!a || !a[b]);
    },
    ak = function (a, b, c, d) {
      c || (c = function () {});
      if ('function' === typeof a.o.__tcfapi) {
        var e = a.o.__tcfapi;
        e(b, 2, c, d);
      } else if (Yj(a)) {
        dk(a);
        var f = ++a.da;
        a.H[f] = c;
        if (a.m) {
          var h = {};
          a.m.postMessage(((h.__tcfapiCall = { command: b, version: 2, callId: f, parameter: d }), h), '*');
        }
      } else c({}, !1);
    },
    Yj = function (a) {
      if (a.m) return a.m;
      a.m = Uj(a.o, '__tcfapiLocator');
      return a.m;
    },
    dk = function (a) {
      a.C ||
        ((a.C = function (b) {
          try {
            var c;
            c = ('string' === typeof b.data ? JSON.parse(b.data) : b.data).__tcfapiReturn;
            a.H[c.callId](c.returnValue, c.success);
          } catch (d) {}
        }),
        Rj(a.o, a.C));
    };
  var ek = !0;
  ek = !1;
  var fk = { 1: 0, 3: 0, 4: 0, 7: 3, 9: 3, 10: 3 };
  function gk(a, b) {
    if ('' === a) return b;
    var c = Number(a);
    return isNaN(c) ? b : c;
  }
  var hk = gk('', 550),
    ik = gk('', 500);
  function jk() {
    var a = M.tcf || {};
    return (M.tcf = a);
  }
  var kk = function (a, b) {
      this.C = a;
      this.m = b;
      this.o = Pa();
    },
    lk = function (a) {},
    mk = function (a) {},
    sk = function () {
      var a = jk(),
        b = new Xj(D, ek ? 3e3 : -1),
        c = new kk(b, a);
      if (
        (nk() ? !0 === D.gtag_enable_tcf_support : !1 !== D.gtag_enable_tcf_support) &&
        !a.active &&
        ('function' === typeof D.__tcfapi || Zj(b))
      ) {
        a.active = !0;
        a.Vb = {};
        ok();
        var d = null;
        ek
          ? (d = D.setTimeout(function () {
              pk(a);
              qk(a);
              d = null;
            }, ik))
          : (a.tcString = 'tcunavailable');
        try {
          b.addEventListener(function (e) {
            d && (clearTimeout(d), (d = null));
            if (0 !== e.internalErrorState) pk(a), qk(a), lk(c);
            else {
              var f;
              a.gdprApplies = e.gdprApplies;
              if (!1 === e.gdprApplies) (f = rk()), b.removeEventListener(e);
              else if (
                'tcloaded' === e.eventStatus ||
                'useractioncomplete' === e.eventStatus ||
                'cmpuishown' === e.eventStatus
              ) {
                var h = {},
                  k;
                for (k in fk)
                  if (fk.hasOwnProperty(k))
                    if ('1' === k) {
                      var l,
                        n = e,
                        p = !0;
                      p = void 0 === p ? !1 : p;
                      var r;
                      var q = n;
                      !1 === q.gdprApplies
                        ? (r = !0)
                        : (void 0 === q.internalErrorState && (q.internalErrorState = Wj(q)),
                          (r =
                            'error' === q.cmpStatus ||
                            0 !== q.internalErrorState ||
                            ('loaded' === q.cmpStatus &&
                              ('tcloaded' === q.eventStatus || 'useractioncomplete' === q.eventStatus))
                              ? !0
                              : !1));
                      l = r
                        ? !1 === n.gdprApplies ||
                          'tcunavailable' === n.tcString ||
                          (void 0 === n.gdprApplies && !p) ||
                          'string' !== typeof n.tcString ||
                          !n.tcString.length
                          ? !0
                          : ck(n, '1', 0)
                        : !1;
                      h['1'] = l;
                    } else h[k] = ck(e, k, fk[k]);
                f = h;
              }
              f && ((a.tcString = e.tcString || 'tcempty'), (a.Vb = f), qk(a), lk(c));
            }
          }),
            mk(c);
        } catch (e) {
          d && (clearTimeout(d), (d = null)), pk(a), qk(a);
        }
      }
    };
  function pk(a) {
    a.type = 'e';
    a.tcString = 'tcunavailable';
    ek && (a.Vb = rk());
  }
  function ok() {
    var a = {},
      b = ((a.ad_storage = 'denied'), (a.wait_for_update = hk), a);
    Od(b);
  }
  var nk = function () {
    var a = !1;
    a = !0;
    return a;
  };
  function rk() {
    var a = {},
      b;
    for (b in fk) fk.hasOwnProperty(b) && (a[b] = !0);
    return a;
  }
  function qk(a) {
    var b = {},
      c = ((b.ad_storage = a.Vb['1'] ? 'granted' : 'denied'), b);
    tk();
    Pd(c, 0);
  }
  var uk = function () {
      var a = jk();
      if (a.active && void 0 !== a.loadTime) return Number(a.loadTime);
    },
    tk = function () {
      var a = jk();
      return a.active ? a.tcString || '' : '';
    },
    vk = function () {
      var a = jk();
      return a.active && void 0 !== a.gdprApplies ? (a.gdprApplies ? '1' : '0') : '';
    },
    wk = function (a) {
      if (!fk.hasOwnProperty(String(a))) return !0;
      var b = jk();
      return b.active && b.Vb ? !!b.Vb[String(a)] : !0;
    };
  var xk = !1;
  function yk(a) {
    var b = String(D.location).split(/[?#]/)[0],
      c = Te.Vf || D._CONSENT_MODE_SALT,
      d;
    if (a) {
      var e;
      if (c) {
        var f = b + a + c,
          h = 1,
          k,
          l,
          n;
        if (f)
          for (h = 0, l = f.length - 1; 0 <= l; l--)
            (n = f.charCodeAt(l)),
              (h = ((h << 6) & 268435455) + n + (n << 14)),
              (k = h & 266338304),
              (h = 0 != k ? h ^ (k >> 21) : h);
        e = String(h);
      } else e = '0';
      d = e;
    } else d = '';
    return d;
  }
  function zk(a) {
    function b(u) {
      var v;
      M.reported_gclid || (M.reported_gclid = {});
      v = M.reported_gclid;
      var x;
      x = xk && h && (!Hd() || J(B.B)) ? l + '.' + (f.prefix || '_gcl') + (u ? 'gcu' : 'gcs') : l + (u ? 'gcu' : 'gcs');
      if (!v[x]) {
        v[x] = !0;
        var z = [],
          w = {},
          y = function (O, N) {
            N && (z.push(O + '=' + encodeURIComponent(N)), (w[O] = !0));
          },
          A = 'https://www.google.com';
        if (Hd()) {
          var C = J(B.B);
          y('gcs', Qd());
          u && y('gcu', '1');
          Id() && y('gcd', 'G1' + Md(Fd));
          M.dedupe_gclid || (M.dedupe_gclid = '' + Of());
          y('rnd', M.dedupe_gclid);
          if ((!l || (n && 'aw.ds' !== n)) && J(B.B)) {
            var G = Pg('_gcl_aw');
            y('gclaw', G.join('.'));
          }
          y('url', String(D.location).split(/[?#]/)[0]);
          y('dclid', Ak(d, p));
          var H = !1;
          H = !0;
          C || (!d && !H) || (A = 'https://pagead2.googlesyndication.com');
        }
        y('gdpr_consent', tk()), y('gdpr', vk());
        '1' === zg(!1)._up && y('gtm_up', '1');
        y('gclid', Ak(d, l));
        y('gclsrc', n);
        if (!(w.gclid || w.dclid || w.gclaw) && (y('gbraid', Ak(d, r)), !w.gbraid && Hd() && J(B.B))) {
          var E = Pg('_gcl_gb');
          y('gclgb', E.join('.'));
        }
        y('gtm', Qj(!e));
        xk && h && J(B.B) && (bg(f || {}), y('auid', Yf[Zf(f.prefix)] || ''));
        a.rf && y('did', a.rf);
        var P = A + '/pagead/landing?' + z.join('&');
        td(P);
      }
    }
    var c = !!a.Gd,
      d = !!a.wa,
      e = a.R,
      f = void 0 === a.Ec ? {} : a.Ec,
      h = void 0 === a.Kc ? !0 : a.Kc,
      k = Vg(),
      l = k.gclid || '',
      n = k.gclsrc,
      p = k.dclid || '',
      r = k.gbraid || '',
      q = !c && ((!l || (n && 'aw.ds' !== n) ? !1 : !0) || r),
      t = Hd();
    if (q || t)
      t
        ? Sd(
            function () {
              b();
              J(B.B) ||
                Rd(function (u) {
                  return b(!0, u.Xg);
                }, B.B);
            },
            [B.B],
          )
        : b();
  }
  function Ak(a, b) {
    var c = a && !J(B.B);
    return b && c ? '0' : b;
  }
  var wl = function () {
      var a = !0;
      (wk(7) && wk(9) && wk(10)) || (a = !1);
      var b = !0;
      b = !1;
      b && !vl() && (a = !1);
      return a;
    },
    vl = function () {
      var a = !0;
      (wk(3) && wk(4)) || (a = !1);
      return a;
    };
  var Ul = !1;
  function Vl() {
    var a = M;
    return (a.gcq = a.gcq || new Wl());
  }
  var Xl = function (a, b, c) {
      Vl().register(a, b, c);
    },
    Yl = function (a, b, c, d) {
      Vl().push('event', [b, a], c, d);
    },
    Zl = function (a, b) {
      Vl().push('config', [a], b);
    },
    $l = function (a, b, c, d) {
      Vl().push('get', [a, b], c, d);
    },
    am = {},
    bm = function () {
      this.status = 1;
      this.containerConfig = {};
      this.targetConfig = {};
      this.remoteConfig = {};
      this.o = null;
      this.m = !1;
    },
    cm = function (a, b, c, d, e) {
      this.type = a;
      this.C = b;
      this.R = c || '';
      this.m = d;
      this.o = e;
    },
    Wl = function () {
      this.H = {};
      this.o = {};
      this.m = [];
      this.C = { AW: !1, UA: !1 };
      this.enableDeferrableCommandAfterConfig = Ul;
    },
    dm = function (a, b) {
      var c = th(b);
      return (a.H[c.containerId] = a.H[c.containerId] || new bm());
    },
    em = function (a, b, c) {
      if (b) {
        var d = th(b);
        if (d && 1 === dm(a, b).status) {
          dm(a, b).status = 2;
          var e = {};
          ej &&
            (e.timeoutId = D.setTimeout(function () {
              Ec(38);
              Qi();
            }, 3e3));
          a.push('require', [e], d.containerId);
          am[d.containerId] = Pa();
          if (wh()) {
          } else {
            var h = '/gtag/js?id=' + encodeURIComponent(d.containerId) + '&l=dataLayer&cx=c',
              k = ('http:' != D.location.protocol ? 'https:' : 'http:') + ('//www.googletagmanager.com' + h),
              l = Aj(c, h) || k;
            gd(l);
          }
        }
      }
    },
    fm = function (a, b, c, d) {
      if (d.R) {
        var e = dm(a, d.R),
          f = e.o;
        if (f) {
          var h = m(c),
            k = m(e.targetConfig[d.R]),
            l = m(e.containerConfig),
            n = m(e.remoteConfig),
            p = m(a.o),
            r = mf('gtm.uniqueEventId'),
            q = th(d.R).prefix,
            t = Kj(
              Jj(
                Lj(
                  Ij(Hj(Gj(Fj(Ej(Dj(h), k), l), n), p), function () {
                    hj(r, q, '2');
                  }),
                  function () {
                    hj(r, q, '3');
                  },
                ),
                function (u, v) {
                  a.C[u] = v;
                },
              ),
              function (u) {
                return a.C[u];
              },
            );
          try {
            hj(r, q, '1');
            f(d.R, b, d.C, t);
          } catch (u) {
            hj(r, q, '4');
          }
        }
      }
    };
  aa = Wl.prototype;
  aa.register = function (a, b, c) {
    var d = dm(this, a);
    if (3 !== d.status) {
      d.o = b;
      d.status = 3;
      if (c) {
        m(d.remoteConfig, c);
        d.remoteConfig = c;
      }
      var e = th(a),
        f = am[e.containerId];
      if (void 0 !== f) {
        var h = M[e.containerId].bootstrap,
          k = e.prefix.toUpperCase();
        M[e.containerId]._spx && (k = k.toLowerCase());
        var l = mf('gtm.uniqueEventId'),
          n = k,
          p = Pa() - h;
        if (ej && !Vi[l]) {
          l !== Ri && (Ni(), (Ri = l));
          var r = n + '.' + Math.floor(h - f) + '.' + Math.floor(p);
          Zi = Zi ? Zi + ',' + r : '&cl=' + r;
        }
        delete am[e.containerId];
      }
      this.flush();
    }
  };
  aa.push = function (a, b, c, d) {
    var e = Math.floor(Pa() / 1e3);
    em(this, c, b[0][B.ka] || this.o[B.ka]);
    Ul && c && dm(this, c).m && (d = !1);
    this.m.push(new cm(a, e, c, b, d));
    d || this.flush();
  };
  aa.insert = function (a, b, c) {
    var d = Math.floor(Pa() / 1e3);
    0 < this.m.length ? this.m.splice(1, 0, new cm(a, d, c, b, !1)) : this.m.push(new cm(a, d, c, b, !1));
  };
  aa.flush = function (a) {
    for (var b = this, c = [], d = !1, e = {}; this.m.length; ) {
      var f = this.m[0];
      if (f.o) Ul ? (!f.R || dm(this, f.R).m ? ((f.o = !1), this.m.push(f)) : c.push(f)) : ((f.o = !1), this.m.push(f));
      else
        switch (f.type) {
          case 'require':
            if (3 !== dm(this, f.R).status && !a) {
              Ul && this.m.push.apply(this.m, c);
              return;
            }
            ej && D.clearTimeout(f.m[0].timeoutId);
            break;
          case 'set':
            Fa(f.m[0], function (q, t) {
              m(Xa(q, t), b.o);
            });
            break;
          case 'config':
            e.xa = {};
            Fa(
              f.m[0],
              (function (q) {
                return function (t, u) {
                  m(Xa(t, u), q.xa);
                };
              })(e),
            );
            var h = !!e.xa[B.uc];
            delete e.xa[B.uc];
            var k = dm(this, f.R),
              l = th(f.R),
              n = l.containerId === l.id;
            h || (n ? (k.containerConfig = {}) : (k.targetConfig[f.R] = {}));
            (k.m && h) || fm(this, B.ia, e.xa, f);
            k.m = !0;
            delete e.xa[B.Ib];
            n ? m(e.xa, k.containerConfig) : m(e.xa, k.targetConfig[f.R]);
            Ul && (d = !0);
            break;
          case 'event':
            e.Zb = {};
            Fa(
              f.m[0],
              (function (q) {
                return function (t, u) {
                  m(Xa(t, u), q.Zb);
                };
              })(e),
            );
            fm(this, f.m[1], e.Zb, f);
            break;
          case 'get':
            var p = {},
              r = ((p[B.La] = f.m[0]), (p[B.Ka] = f.m[1]), p);
            fm(this, B.za, r, f);
        }
      this.m.shift();
      e = { xa: e.xa, Zb: e.Zb };
    }
    Ul && (this.m.push.apply(this.m, c), d && this.flush());
  };
  aa.getRemoteConfig = function (a) {
    return dm(this, a).remoteConfig;
  };
  var gm = function (a, b, c) {
      var d = {
        'event': b,
        'gtm.element': a,
        'gtm.elementClasses': ud(a, 'className'),
        'gtm.elementId': a['for'] || md(a, 'id') || '',
        'gtm.elementTarget': a.formTarget || ud(a, 'target') || '',
      };
      c && (d['gtm.triggers'] = c.join(','));
      d['gtm.elementUrl'] =
        (a.attributes && a.attributes.formaction ? a.formAction : '') ||
        a.action ||
        ud(a, 'href') ||
        a.src ||
        a.code ||
        a.codebase ||
        '';
      return d;
    },
    hm = function (a) {
      M.hasOwnProperty('autoEventsSettings') || (M.autoEventsSettings = {});
      var b = M.autoEventsSettings;
      b.hasOwnProperty(a) || (b[a] = {});
      return b[a];
    },
    im = function (a, b, c) {
      hm(a)[b] = c;
    },
    jm = function (a, b, c, d) {
      var e = hm(a),
        f = Ra(e, b, d);
      e[b] = c(f);
    },
    km = function (a, b, c) {
      var d = hm(a);
      return Ra(d, b, c);
    };
  var lm = !!D.MutationObserver,
    mm = void 0,
    nm = function (a) {
      if (!mm) {
        var b = function () {
          var c = F.body;
          if (c)
            if (lm)
              new MutationObserver(function () {
                for (var e = 0; e < mm.length; e++) I(mm[e]);
              }).observe(c, { childList: !0, subtree: !0 });
            else {
              var d = !1;
              kd(c, 'DOMNodeInserted', function () {
                d ||
                  ((d = !0),
                  I(function () {
                    d = !1;
                    for (var e = 0; e < mm.length; e++) I(mm[e]);
                  }));
              });
            }
        };
        mm = [];
        F.body ? b() : I(b);
      }
      mm.push(a);
    };
  var om = function (a, b, c) {
    function d() {
      var h = a();
      f += e ? ((Pa() - e) * h.playbackRate) / 1e3 : 0;
      e = Pa();
    }
    var e = 0,
      f = 0;
    return {
      createEvent: function (h, k, l) {
        var n = a(),
          p = n.sf,
          r = void 0 !== l ? Math.round(l) : void 0 !== k ? Math.round(n.sf * k) : Math.round(n.bh),
          q = void 0 !== k ? Math.round(100 * k) : 0 >= p ? 0 : Math.round((r / p) * 100),
          t = F.hidden ? !1 : 0.5 <= $d(c);
        d();
        var u = void 0;
        void 0 !== b && (u = [b]);
        var v = gm(c, 'gtm.video', u);
        v['gtm.videoProvider'] = 'youtube';
        v['gtm.videoStatus'] = h;
        v['gtm.videoUrl'] = n.url;
        v['gtm.videoTitle'] = n.title;
        v['gtm.videoDuration'] = Math.round(p);
        v['gtm.videoCurrentTime'] = Math.round(r);
        v['gtm.videoElapsedTime'] = Math.round(f);
        v['gtm.videoPercent'] = q;
        v['gtm.videoVisible'] = t;
        return v;
      },
      Ph: function () {
        e = Pa();
      },
      Ed: function () {
        d();
      },
    };
  };
  var pm = !1,
    qm = [];
  function rm() {
    if (!pm) {
      pm = !0;
      for (var a = 0; a < qm.length; a++) I(qm[a]);
    }
  }
  var sm = function (a) {
    pm ? I(a) : qm.push(a);
  };
  Object.freeze({ dl: 1, id: 1 });
  var tm = 'HA GF G UA AW DC'.split(' '),
    um = !1,
    vm = {},
    wm = !1;
  function xm(a, b) {
    var c = { event: a };
    b && ((c.eventModel = m(b)), b[B.jd] && (c.eventCallback = b[B.jd]), b[B.mc] && (c.eventTimeout = b[B.mc]));
    return c;
  }
  function ym(a) {
    a.hasOwnProperty('gtm.uniqueEventId') || Object.defineProperty(a, 'gtm.uniqueEventId', { value: ff() });
    return a['gtm.uniqueEventId'];
  }
  function zm() {
    (um = um || !M.gtagRegistered),
      (M.gtagRegistered = !0),
      um &&
        (M.addTargetToGroup = function (a) {
          Am(a, 'default');
        });
    return um;
  }
  var Am = function (a, b) {
      b = b.toString().split(',');
      for (var c = 0; c < b.length; c++) (vm[b[c]] = vm[b[c]] || []), vm[b[c]].push(a);
    },
    Bm = function (a) {
      Fa(vm, function (b, c) {
        var d = za(c, a);
        0 <= d && c.splice(d, 1);
      });
    };
  var Cm = {
      config: function (a) {
        var b, c;
        void 0 === c && (c = ff());
        if (2 > a.length || !g(a[1])) return;
        var d = {};
        if (2 < a.length) {
          if ((void 0 != a[2] && !cb(a[2])) || 3 < a.length) return;
          d = a[2];
        }
        var e = th(a[1]);
        if (!e) return;
        Bm(e.id);
        Am(e.id, d[B.nd] || 'default');
        delete d[B.nd];
        wm || Ec(43);
        if (zm() && -1 !== za(tm, e.prefix)) {
          'G' === e.prefix && (d[B.Ib] = !0);
          Zl(d, e.id);
          return;
        }
        pf('gtag.targets.' + e.id, void 0);
        pf('gtag.targets.' + e.id, m(d));
        var f = {};
        f[B.Ra] = e.id;
        b = xm(B.ia, f);
        return b;
      },
      consent: function (a) {
        function b() {
          zm() && m(a[2], { subcommand: a[1] });
        }
        if (3 === a.length) {
          Ec(39);
          var c = ff(),
            d = a[1];
          'default' === d ? (b(), Od(a[2])) : 'update' === d && (b(), Pd(a[2], c));
        }
      },
      event: function (a) {
        var b = a[1];
        if (!(2 > a.length) && g(b)) {
          var c;
          if (2 < a.length) {
            if ((!cb(a[2]) && void 0 != a[2]) || 3 < a.length) return;
            c = a[2];
          }
          var d = xm(b, c),
            e = void 0;
          void 0 === e && ff();
          var f;
          var h = c && c[B.Ra];
          void 0 === h && ((h = mf(B.Ra, 2)), void 0 === h && (h = 'default'));
          if (g(h) || ya(h)) {
            for (var k = h.toString().replace(/\s+/g, '').split(','), l = [], n = 0; n < k.length; n++)
              0 <= k[n].indexOf('-') ? l.push(k[n]) : (l = l.concat(vm[k[n]] || []));
            f = vh(l);
          } else f = void 0;
          var p = f;
          if (!p) return;
          for (var r = zm(), q = [], t = 0; r && t < p.length; t++) {
            var u = p[t];
            if (-1 !== za(tm, u.prefix)) {
              var v = m(c);
              'G' === u.prefix && (v[B.Ib] = !0);
              Yl(b, v, u.id);
            }
            q.push(u.id);
          }
          d.eventModel = d.eventModel || {};
          0 < p.length ? (d.eventModel[B.Ra] = q.join()) : delete d.eventModel[B.Ra];
          wm || Ec(43);
          return d;
        }
      },
      get: function (a) {
        Ec(53);
        if (4 !== a.length || !g(a[1]) || !g(a[2]) || !wa(a[3])) return;
        var b = th(a[1]),
          c = String(a[2]),
          d = a[3];
        if (!b) return;
        wm || Ec(43);
        if (!zm() || -1 === za(tm, b.prefix)) return;
        ff();
        var e = {};
        Yh(m(((e[B.La] = c), (e[B.Ka] = d), e)));
        $l(
          c,
          function (f) {
            I(function () {
              return d(f);
            });
          },
          b.id,
        );
      },
      js: function (a) {
        if (2 == a.length && a[1].getTime) {
          wm = !0;
          zm();
          var b = { 'event': 'gtm.js', 'gtm.start': a[1].getTime() };
          return b;
        }
      },
      policy: function () {},
      set: function (a) {
        var b;
        2 == a.length && cb(a[1])
          ? (b = m(a[1]))
          : 3 == a.length && g(a[1]) && ((b = {}), cb(a[2]) || ya(a[2]) ? (b[a[1]] = m(a[2])) : (b[a[1]] = a[2]));
        if (b) {
          if ((ff(), zm())) {
            m(b);
            var c = m(b);
            Vl().push('set', [c]);
          }
          b._clear = !0;
          return b;
        }
      },
    },
    Dm = { policy: !0 };
  var Gm = function (a, b) {
      var c = a.hide;
      if (c && void 0 !== c[b] && c.end) {
        c[b] = !1;
        var d = !0,
          e;
        for (e in c)
          if (c.hasOwnProperty(e) && !0 === c[e]) {
            d = !1;
            break;
          }
        d && (c.end(), (c.end = null));
      }
    },
    Im = function (a) {
      var b = Hm(),
        c = b && b.hide;
      c && c.end && (c[a] = !0);
    };
  var Zm = function (a) {
    if (Ym(a)) return a;
    this.m = a;
  };
  Zm.prototype.oh = function () {
    return this.m;
  };
  var Ym = function (a) {
    return !a || 'object' !== ab(a) || cb(a) ? !1 : 'getUntrustedUpdateValue' in a;
  };
  Zm.prototype.getUntrustedUpdateValue = Zm.prototype.oh;
  var $m = [],
    an = !1,
    bn = !1,
    cn = !1,
    dn = function (a) {
      return D['dataLayer'].push(a);
    },
    en = function (a) {
      var b = M['dataLayer'],
        c = b ? b.subscribers : 1,
        d = 0,
        e = a;
      return function () {
        ++d === c && (e(), (e = null));
      };
    };
  function fn(a) {
    var b = a._clear;
    Fa(a, function (d, e) {
      '_clear' !== d && (b && pf(d, void 0), pf(d, e));
    });
    af || (af = a['gtm.start']);
    var c = a['gtm.uniqueEventId'];
    if (!a.event) return !1;
    c || ((c = ff()), (a['gtm.uniqueEventId'] = c), pf('gtm.uniqueEventId', c));
    return yj(a);
  }
  function gn() {
    var a = $m[0];
    if (null == a || 'object' !== typeof a) return !1;
    if (a.event) return !0;
    if (Ia(a)) {
      var b = a[0];
      if ('config' === b || 'event' === b || 'js' === b) return !0;
    }
    return !1;
  }
  function hn() {
    for (var a = !1; !cn && 0 < $m.length; ) {
      var b = !1;
      b = !1;
      b = !0;
      if (b && !bn && gn()) {
        var c = {};
        $m.unshift(((c.event = 'gtm.init'), c));
        bn = !0;
      }
      var d = !1;
      d = !1;
      d = !0;
      if (d && !an && gn()) {
        var e = {};
        $m.unshift(((e.event = 'gtm.init_consent'), e));
        an = !0;
      }
      cn = !0;
      delete jf.eventModel;
      lf();
      var f = $m.shift();
      if (null != f) {
        var h = Ym(f);
        if (h) {
          var k = f;
          f = Ym(k) ? k.getUntrustedUpdateValue() : void 0;
          for (
            var l = ['gtm.allowlist', 'gtm.blocklist', 'gtm.whitelist', 'gtm.blacklist', 'tagTypeBlacklist'], n = 0;
            n < l.length;
            n++
          ) {
            var p = l[n],
              r = mf(p, 1);
            if (ya(r) || cb(r)) r = m(r);
            kf[p] = r;
          }
        }
        try {
          if (wa(f))
            try {
              f.call(nf);
            } catch (y) {}
          else if (ya(f)) {
            var q = f;
            if (g(q[0])) {
              var t = q[0].split('.'),
                u = t.pop(),
                v = q.slice(1),
                x = mf(t.join('.'), 2);
              if (void 0 !== x && null !== x)
                try {
                  x[u].apply(x, v);
                } catch (y) {}
            }
          } else {
            if (Ia(f)) {
              a: {
                var z = f;
                if (z.length && g(z[0])) {
                  var w = Cm[z[0]];
                  if (w && (!h || !Dm[z[0]])) {
                    f = w(z);
                    break a;
                  }
                }
                f = void 0;
              }
              if (!f) {
                cn = !1;
                continue;
              }
            }
            a = fn(f) || a;
          }
        } finally {
          h && lf(!0);
        }
      }
      cn = !1;
    }
    return !a;
  }
  function jn() {
    var b = hn();
    try {
      Gm(D['dataLayer'], Te.K);
    } catch (c) {}
    return b;
  }
  var ln = function () {
      var a = ed('dataLayer', []),
        b = ed('google_tag_manager', {});
      b = b['dataLayer'] = b['dataLayer'] || {};
      ei(function () {
        b.gtmDom || ((b.gtmDom = !0), a.push({ event: 'gtm.dom' }));
      });
      sm(function () {
        b.gtmLoad || ((b.gtmLoad = !0), a.push({ event: 'gtm.load' }));
      });
      b.subscribers = (b.subscribers || 0) + 1;
      var c = a.push;
      a.push = function () {
        var e;
        if (0 < M.SANDBOXED_JS_SEMAPHORE) {
          e = [];
          for (var f = 0; f < arguments.length; f++) e[f] = new Zm(arguments[f]);
        } else e = [].slice.call(arguments, 0);
        var h = c.apply(a, e);
        $m.push.apply($m, e);
        if (300 < this.length) for (Ec(4); 300 < this.length; ) this.shift();
        var k = 'boolean' !== typeof h || h;
        return hn() && k;
      };
      var d = a.slice(0);
      $m.push.apply($m, d);
      if (kn()) {
        I(jn);
      }
    },
    kn = function () {
      var a = !0;
      return a;
    };
  var mn = {};
  mn.vc = new String('undefined');
  var nn = function (a) {
    this.m = function (b) {
      for (var c = [], d = 0; d < a.length; d++) c.push(a[d] === mn.vc ? b : a[d]);
      return c.join('');
    };
  };
  nn.prototype.toString = function () {
    return this.m('undefined');
  };
  nn.prototype.valueOf = nn.prototype.toString;
  mn.Mg = nn;
  mn.Cd = {};
  mn.ah = function (a) {
    return new nn(a);
  };
  var on = {};
  mn.Nh = function (a, b) {
    var c = ff();
    on[c] = [a, b];
    return c;
  };
  mn.qf = function (a) {
    var b = a ? 0 : 1;
    return function (c) {
      var d = on[c];
      if (d && 'function' === typeof d[b]) d[b]();
      on[c] = void 0;
    };
  };
  mn.th = function (a) {
    for (var b = !1, c = !1, d = 2; d < a.length; d++) (b = b || 8 === a[d]), (c = c || 16 === a[d]);
    return b && c;
  };
  mn.Hh = function (a) {
    if (a === mn.vc) return a;
    var b = ff();
    mn.Cd[b] = a;
    return 'google_tag_manager["' + Te.K + '"].macro(' + b + ')';
  };
  mn.Dh = function (a, b, c) {
    a instanceof mn.Mg && ((a = a.m(mn.Nh(b, c))), (b = va));
    return { ph: a, onSuccess: b };
  };
  var pn = ['input', 'select', 'textarea'],
    qn = ['button', 'hidden', 'image', 'reset', 'submit'],
    rn = function (a) {
      var b = a.tagName.toLowerCase();
      return !Ba(pn, function (c) {
        return c === b;
      }) ||
        ('input' === b &&
          Ba(qn, function (c) {
            return c === a.type.toLowerCase();
          }))
        ? !1
        : !0;
    },
    sn = function (a) {
      return a.form ? (a.form.tagName ? a.form : F.getElementById(a.form)) : sd(a, ['form'], 100);
    },
    tn = function (a, b, c) {
      if (!a.elements) return 0;
      for (var d = b.getAttribute(c), e = 0, f = 1; e < a.elements.length; e++) {
        var h = a.elements[e];
        if (rn(h)) {
          if (h.getAttribute(c) === d) return f;
          f++;
        }
      }
      return 0;
    };
  var En = D.clearTimeout,
    Fn = D.setTimeout,
    R = function (a, b, c) {
      if (wh()) {
        b && I(b);
      } else return gd(a, b, c);
    },
    Gn = function () {
      return new Date();
    },
    Hn = function () {
      return D.location.href;
    },
    In = function (a) {
      return ke(me(a), 'fragment');
    },
    Jn = function (a) {
      return le(me(a));
    },
    Kn = function (a, b) {
      return mf(a, b || 2);
    },
    Ln = function (a, b, c) {
      var d;
      b ? ((a.eventCallback = b), c && (a.eventTimeout = c), (d = dn(a))) : (d = dn(a));
      return d;
    },
    Mn = function (a, b) {
      D[a] = b;
    },
    W = function (a, b, c) {
      b && (void 0 === D[a] || (c && !D[a])) && (D[a] = b);
      return D[a];
    },
    Nn = function (a, b, c) {
      return Cf(a, b, void 0 === c ? !0 : !!c);
    },
    On = function (a, b, c) {
      return 0 === Lf(a, b, c);
    },
    Pn = function (a, b) {
      if (wh()) {
        b && I(b);
      } else id(a, b);
    },
    Qn = function (a) {
      return !!km(a, 'init', !1);
    },
    Rn = function (a) {
      im(a, 'init', !0);
    },
    Sn = function (a) {
      var b = Ze + '?id=' + encodeURIComponent(a) + '&l=dataLayer';
      R(yh('https://', 'http://', b));
    },
    Tn = function (a, b, c) {
      ej && (db(a) || ij(c, b, a));
    };
  var Un = mn.Dh;
  function ro(a, b) {
    a = String(a);
    b = String(b);
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c;
  }
  var so = new Da();
  function to(a, b, c) {
    var d = c ? 'i' : void 0;
    try {
      var e = String(b) + d,
        f = so.get(e);
      f || ((f = new RegExp(b, d)), so.set(e, f));
      return f.test(a);
    } catch (h) {
      return !1;
    }
  }
  function uo(a, b) {
    function c(h) {
      var k = me(h),
        l = ke(k, 'protocol'),
        n = ke(k, 'host', !0),
        p = ke(k, 'port'),
        r = ke(k, 'path').toLowerCase().replace(/\/$/, '');
      if (void 0 === l || ('http' == l && '80' == p) || ('https' == l && '443' == p)) (l = 'web'), (p = 'default');
      return [l, n, p, r];
    }
    for (var d = c(String(a)), e = c(String(b)), f = 0; f < d.length; f++) if (d[f] !== e[f]) return !1;
    return !0;
  }
  function vo(a) {
    return wo(a) ? 1 : 0;
  }
  function wo(a) {
    var b = a.arg0,
      c = a.arg1;
    if (a.any_of && ya(c)) {
      for (var d = 0; d < c.length; d++) {
        var e = m(a, {});
        m({ arg1: c[d], any_of: void 0 }, e);
        if (vo(e)) return !0;
      }
      return !1;
    }
    switch (a['function']) {
      case '_cn':
        return 0 <= String(b).indexOf(String(c));
      case '_css':
        var f;
        a: {
          if (b) {
            var h = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];
            try {
              for (var k = 0; k < h.length; k++)
                if (b[h[k]]) {
                  f = b[h[k]](c);
                  break a;
                }
            } catch (n) {}
          }
          f = !1;
        }
        return f;
      case '_ew':
        return ro(b, c);
      case '_eq':
        return String(b) == String(c);
      case '_ge':
        return Number(b) >= Number(c);
      case '_gt':
        return Number(b) > Number(c);
      case '_lc':
        var l;
        l = String(b).split(',');
        return 0 <= za(l, String(c));
      case '_le':
        return Number(b) <= Number(c);
      case '_lt':
        return Number(b) < Number(c);
      case '_re':
        return to(b, c, a.ignore_case);
      case '_sw':
        return 0 == String(b).indexOf(String(c));
      case '_um':
        return uo(b, c);
    }
    return !1;
  }
  var xo = encodeURI,
    Y = encodeURIComponent,
    yo = jd;
  var zo = function (a, b) {
    if (!a) return !1;
    var c = ke(me(a), 'host');
    if (!c) return !1;
    for (var d = 0; b && d < b.length; d++) {
      var e = b[d] && b[d].toLowerCase();
      if (e) {
        var f = c.length - e.length;
        0 < f && '.' != e.charAt(0) && (f--, (e = '.' + e));
        if (0 <= f && c.indexOf(e, f) == f) return !0;
      }
    }
    return !1;
  };
  var Ao = function (a, b, c) {
    for (var d = {}, e = !1, f = 0; a && f < a.length; f++)
      a[f] && a[f].hasOwnProperty(b) && a[f].hasOwnProperty(c) && ((d[a[f][b]] = a[f][c]), (e = !0));
    return e ? d : null;
  };
  var Kp = {};
  Kp[B.kc] = '';
  Kp[B.ja] = '';
  Kp[B.Ca] = '';
  Kp[B.Z] = 'auto';
  Kp[B.Qa] = '/';
  Kp[B.ra] = 63072e3;
  Kp[B.Gb] = 30;
  Kp[B.qc] = 1e4;
  Kp[B.Fb] = !0;
  var Lp = function (a, b, c, d, e) {
    this.m = a;
    this.I = b;
    this.o = c;
    this.M = d.eventModel;
    this.Lg = d.containerConfig;
    this.Ue = d;
    this.W = d.getWithConfig(B.jb) ? 1 : 7;
    this.H = e;
    this.da = this.wd = this.df = this.C = this.Xe = this.Ze = this.cc = !1;
    this.Va = 0;
    this.zd = this.eb = !1;
    this.Bd = void 0;
    this.cb = 0;
    this.Te = this.We = this.af = this.Ve = this.yd = void 0;
  };
  aa = Lp.prototype;
  aa.Ea = function (a, b) {
    void 0 === this.s(a) && (this.M[a] = b);
  };
  aa.Kf = function (a, b) {
    b <= this.W && ((this.M[B.jb] = a), (this.W = b));
  };
  aa.s = function (a) {
    return void 0 !== this.M[a]
      ? this.M[a]
      : void 0 !== this.Ue.getWithConfig(a)
      ? this.Ue.getWithConfig(a)
      : void 0 !== this.H[a]
      ? this.H[a]
      : Kp[a];
  };
  aa.getRemoteConfig = function (a) {
    return this.H[a];
  };
  aa.Ic = function (a) {
    var b = this.H[B.kd];
    if (b && void 0 !== b[a || this.I]) return b[a || this.I];
  };
  aa.abort = function () {
    throw 'ABORT';
  };
  aa.Ua = function () {
    return !((!0 !== this.s(B.Cb) && 'true' !== this.s(B.Cb)) || !this.s(B.ka));
  };
  var Mp = !1,
    Np = function (a) {
      var b = !1;
      return !(!cd.sendBeacon || a.eb || a.C || a.wd || a.da || b || Mp);
    };
  var Rp = function () {
      var a = 0,
        b = 0;
      return {
        start: function () {
          a = Pa();
        },
        stop: function () {
          b = this.get();
        },
        get: function () {
          var c = 0;
          Op && Pp && Qp && (c = Pa() - a);
          return c + b;
        },
      };
    },
    Vp = function () {
      Sp += Tp();
      Up = Rp();
      Op && Pp && Qp && Up.start();
    },
    Up = void 0,
    Sp = 0,
    Op = !1,
    Pp = !1,
    Qp = !1,
    Wp = void 0,
    Xp = void 0,
    Yp = function () {
      if (!Up) {
        Op = F.hasFocus();
        Pp = !F.hidden;
        Qp = !0;
        var a = function (b, c, d) {
          kd(b, c, function (e) {
            Up.stop();
            d(e);
            Op && Pp && Qp && Up.start();
          });
        };
        a(D, 'focus', function () {
          Op = !0;
        });
        a(D, 'blur', function () {
          Op = !1;
        });
        a(D, 'pageshow', function (b) {
          Qp = !0;
          b.persisted && Ec(56);
          Xp && Xp();
        });
        a(D, 'pagehide', function () {
          Qp = !1;
          Wp && Wp();
        });
        a(F, 'visibilitychange', function () {
          Pp = !F.hidden;
        });
        Vp();
        Sp = 0;
      }
    },
    Tp = function () {
      return (Up && Up.get()) || 0;
    };
  var Zp = function (a) {
    ta('GA4_EVENT', a);
  };
  var aq = function (a) {
      return !a || $p.test(a) || 0 <= za(B.Cg, a);
    },
    bq = function (a) {
      var b = a[B.Ge];
      if (b) return b;
      var c = a[B.ob];
      if (g(c)) {
        if ('function' === typeof URL)
          try {
            return new URL(c).pathname;
          } catch (e) {
            return;
          }
        var d = me(c);
        return d.hostname ? ke(d, 'path') : void 0;
      }
    },
    cq = function (a, b, c) {
      if (c)
        switch (c.type) {
          case 'event_name':
            return a;
          case 'const':
            return c.const_value;
          case 'event_param':
            var d = c.event_param.param_name,
              e = b[d];
            return e;
        }
    },
    dq = function (a, b, c) {
      for (var d = c.event_param_ops || [], e = 0; e < d.length; e++) {
        var f = d[e];
        if (f.edit_param) {
          var h = f.edit_param.param_name,
            k = cq(a, b, f.edit_param.param_value),
            l;
          if (k) {
            var n = Number(k);
            l = isNaN(n) ? k : n;
          } else l = k;
          b[h] = l;
        } else f.delete_param && delete b[f.delete_param.param_name];
      }
    },
    eq = function (a, b) {
      var c = b.values || [],
        d = cq(a.I, a.M, c[0]),
        e = cq(a.I, a.M, c[1]),
        f = b.type;
      if ('eqi' === f || 'swi' === f || 'ewi' === f || 'cni' === f)
        (d = 'string' === typeof d ? d.toLowerCase() : d), (e = 'string' === typeof e ? e.toLowerCase() : e);
      var h = !1;
      switch (f) {
        case 'eq':
        case 'eqi':
          h = String(d) == String(e);
          break;
        case 'sw':
        case 'swi':
          h = 0 == String(d).indexOf(String(e));
          break;
        case 'ew':
        case 'ewi':
          h = ro(d, e);
          break;
        case 'cn':
        case 'cni':
          h = 0 <= String(d).indexOf(String(e));
          break;
        case 'lt':
          h = Number(d) < Number(e);
          break;
        case 'le':
          h = Number(d) <= Number(e);
          break;
        case 'gt':
          h = Number(d) > Number(e);
          break;
        case 'ge':
          h = Number(d) >= Number(e);
          break;
        case 're':
        case 'rei':
          h = to(d, e, 'rei' === f);
      }
      return !!b.negate !== h;
    },
    fq = function (a, b) {
      var c = b.event_name_predicate;
      if (c && !eq(a, c)) return !1;
      var d = b.conditions || [];
      if (0 === d.length) return !0;
      for (var e = 0; e < d.length; e++) {
        for (var f = d[e].predicates || [], h = !0, k = 0; k < f.length; k++)
          if (!eq(a, f[k])) {
            h = !1;
            break;
          }
        if (h) return !0;
      }
      return !1;
    },
    $p = /^(_|ga_|google_|gtag\.|firebase_).*$/,
    gq = !1;
  gq = !0;
  function hq() {
    return (D.gaGlobal = D.gaGlobal || {});
  }
  var iq = function () {
      var a = hq();
      a.hid = a.hid || Ca();
      return a.hid;
    },
    jq = function (a, b) {
      var c = hq();
      if (void 0 == c.vid || (b && !c.from_cookie)) (c.vid = a), (c.from_cookie = b);
    };
  var nq = function (a, b) {
      var c = kq(b),
        d = String(b.s(B.Z)),
        e = String(b.s(B.Qa)),
        f = Number(b.s(B.ra)),
        h = b.s(B.Bb),
        k = { Ia: B.F, domain: d, path: e, expires: f ? new Date(Pa() + 1e3 * f) : void 0, flags: String(b.s(B.Ca)) };
      if (!1 === h && lq(b) === a) return !0;
      var l = Vf(a, mq[0], d, e);
      return 1 !== Lf(c, l, k);
    },
    lq = function (a) {
      var b = kq(a),
        c = String(a.s(B.Z)),
        d = String(a.s(B.Qa)),
        e = Uf(b, c, d, mq, B.F);
      if (!e) {
        var f = String(a.s(B.kc));
        f && f != b && (e = Uf(f, c, d, mq, B.F));
      }
      return e;
    },
    kq = function (a) {
      return String(a.s(B.ja)) + '_ga';
    },
    mq = ['GA1'];
  var qq = function (a, b) {
      var c = oq(b),
        d = String(b.s(B.Z)),
        e = String(b.s(B.Qa)),
        f = Number(b.s(B.ra)),
        h = Vf(a, pq[0], d, e),
        k = { Ia: B.F, domain: d, path: e, expires: f ? new Date(Pa() + 1e3 * f) : void 0, flags: String(b.s(B.Ca)) };
      return 1 !== Lf(c, h, k);
    },
    rq = function (a) {
      var b = oq(a),
        c = String(a.s(B.Z)),
        d = String(a.s(B.Qa));
      return Uf(b, c, d, pq, B.F);
    },
    pq = ['GS1'],
    oq = function (a) {
      return String(a.s(B.ja)) + '_ga_' + a.m.substr(2);
    },
    sq = function (a) {
      var b;
      var c = a.M[B.Hb],
        d = a.M[B.td];
      b = c && d ? [c, d, Ja(a.M[B.sd]), a.o, a.Va].join('.') : void 0;
      return b;
    };
  var tq = function (a) {
      var b = a.s(B.sa),
        c = a.getRemoteConfig(B.sa);
      if (c === b) return c;
      var d = m(b);
      c && c[B.L] && (d[B.L] = (d[B.L] || []).concat(c[B.L]));
      return d;
    },
    uq = function (a, b) {
      var c = zg(!0);
      return '1' !== c._up ? {} : { clientId: c[a], Jf: c[b] };
    },
    vq = function (a, b, c) {
      var d = zg(!0),
        e = d[b];
      e && (a.Kf(e, 2), nq(e, a));
      var f = d[c];
      f && qq(f, a);
      return !(!e || !f);
    },
    wq = !1,
    xq = !1;
  xq = !0;
  var yq = function (a) {
      if (xq) {
        var b = tq(a) || {},
          c = kq(a),
          d = oq(a);
        Hg(b[B.lb], !!b[B.L]) && vq(a, c, d) && (wq = !0);
        b[B.L] &&
          Eg(
            function () {
              var e = {},
                f = lq(a);
              f && (e[c] = f);
              var h = rq(a);
              h && (e[d] = h);
              return e;
            },
            b[B.L],
            b[B.nb],
            !!b[B.mb],
          );
      }
    },
    Aq = function (a) {
      if (!a.s(B.Na)) return {};
      var b = kq(a),
        c = oq(a);
      Fg(function () {
        var d;
        if (J('analytics_storage')) d = {};
        else {
          var e = {};
          d = ((e._up = '1'), (e[b] = a.M[B.jb]), (e[c] = sq(a)), e);
        }
        return d;
      }, 1);
      if (!J('analytics_storage') && zq()) return uq(b, c);
      return {};
    },
    zq = function () {
      var a = je(D.location, 'host'),
        b = je(me(F.referrer), 'host');
      return a && b ? (a === b || 0 <= a.indexOf('.' + b) || 0 <= b.indexOf('.' + a) ? !0 : !1) : !1;
    };
  var Bq = function () {
    var a = Pa(),
      b = a + 864e5,
      c = 20,
      d = 5e3;
    return function () {
      var e = Pa();
      e >= b && ((b = e + 864e5), (d = 5e3));
      if (1 > d) return !1;
      c = Math.min(c + ((e - a) / 1e3) * 5, 20);
      a = e;
      if (1 > c) return !1;
      d--;
      c--;
      return !0;
    };
  };
  var Cq = !1;
  Cq = !0;
  var Dq = '' + Ca(),
    Eq = !1,
    Fq = void 0;
  var Gq = function () {
    if (wa(D.__uspapi)) {
      var a = '';
      try {
        D.__uspapi('getUSPData', 1, function (b, c) {
          if (c && b) {
            var d = b.uspString;
            d && /^[\da-zA-Z-]{1,20}$/.test(d) && (a = d);
          }
        });
      } catch (b) {}
      return a;
    }
  };
  var Hq = function (a, b) {
      if (b.Ua()) {
        var c = Gq();
        c && (a.us_privacy = c);
      }
    },
    Jq = function (a, b) {
      if (Hd() && ((a.gcs = Qd()), b.Ua())) {
      }
    },
    Kq = function (a, b, c) {
      void 0 === c && (c = {});
      if ('object' === typeof b) for (var d in b) Kq(a + '.' + d, b[d], c);
      else c[a] = b;
      return c;
    },
    Lq = function (a) {
      var b = 'https://www.google-analytics.com/g/collect',
        c = !0;
      if (!c || null != dd) {
        var d = zj(a.s(B.ka), '/g/collect');
        if (d) return d;
      }
      var e = !0;
      (J(B.B) && J(B.F)) || (e = !1);
      var f = !1 !== a.s(B.qa);
      f = !0;
      a.s(B.Db) && !a.s(B.nc) && f && !1 !== a.s(B.Ab) && wl() && e && (b = 'https://analytics.google.com/g/collect');
      return b;
    },
    Mq = {},
    Iq = ((Mq[B.B] = '1'), (Mq[B.F] = '2'), Mq),
    Nq = {};
  Nq[B.zg] = 'tid';
  Nq[B.jb] = 'cid';
  Nq[B.kb] = 'ul';
  Nq[B.ld] = '_fid';
  Nq[B.Me] = 'tt';
  Nq[B.od] = 'ir';
  var Oq = {};
  Oq[B.Hb] = 'sid';
  Oq[B.td] = 'sct';
  Oq[B.sd] = 'seg';
  Oq[B.ob] = 'dl';
  Oq[B.Ma] = 'dr';
  Oq[B.rd] = 'dt';
  Oq[B.X] = 'cu';
  Oq[B.qb] = 'uid';
  var Pq = function (a, b) {
    function c(u, v) {
      if (void 0 !== v && -1 == B.Ag.indexOf(u)) {
        null === v && (v = '');
        var x;
        '_' === u.charAt(0)
          ? (d[u] = cc(v, 300))
          : Nq[u]
          ? ((x = Nq[u]), (d[x] = cc(v, 300)))
          : Oq[u]
          ? ((x = Oq[u]), (f[x] = cc(v, 300)))
          : n(u, v) || l(u, v);
      }
    }
    var d = {},
      e = {},
      f = {};
    d.v = '2';
    d.tid = a.m;
    d.gtm = Qj();
    d._p = iq();
    a.Bd && (d.sr = a.Bd);
    a.Ve && (d._z = a.Ve);
    a.da && (d._gaz = 1);
    Jq(d, a);
    a.af && (d.gtm_up = '1');
    e.en = cc(a.I, 40);
    a.cc && (e._fv = a.Ze ? 2 : 1);
    a.Xe && (e._nsi = 1);
    a.C && (e._ss = a.df ? 2 : 1);
    a.eb && (e._c = 1);
    0 < a.cb && (e._et = a.cb);
    if (a.zd) {
      var h = a.s(B.U);
      if (ya(h)) for (var k = 0; k < h.length && 200 > k; k++) e['pr' + (k + 1)] = hc(h[k]);
    }
    a.yd && (e._eu = a.yd);
    for (
      var l = function (u, v) {
          u = cc(u, 40);
          var x = 'ep.' + u,
            z = 'epn.' + u;
          u = xa(v) ? z : x;
          var w = xa(v) ? x : z;
          e.hasOwnProperty(w) && delete e[w];
          e[u] = cc(v, 100);
        },
        n = function (u, v) {
          var x = u.split('.');
          if (u === B.ud && 'object' !== typeof v) return l(u, v), !0;
          if (x[0] === B.ud) {
            if ((1 < x.length || 'object' === typeof v) && a.Ua()) {
              var z = Kq(u, v);
              Fa(z, function (w, y) {
                return void l(w, y);
              });
            }
            return !0;
          }
          return !1;
        },
        p = 0;
      p < B.Oe.length;
      ++p
    ) {
      var r = B.Oe[p];
      c(r, a.s(r));
    }
    a.zd && c(B.X, a.s(B.X));
    Fa(a.Lg, c);
    Fa(a.M, c);
    var q = a.s(B.Da) || {};
    (!1 !== a.s(B.qa) && vl()) || (q._npa = '1');
    Fa(q, function (u, v) {
      if (b[u] !== v) {
        if (u !== B.qb || f.uid) {
          var x = (xa(v) ? 'upn.' : 'up.') + cc(u, 24);
          e[x] = cc(v, 36);
        } else f.uid = cc(v, 36);
        b[u] = v;
      }
    });
    var t = !1;
    return jc.call(this, { Ha: d, Ya: f, M: e }, Lq(a), t) || this;
  };
  oa(Pq, jc);
  var Qq = function (a, b) {
      return a.replace(/\$\{([^\}]+)\}/g, function (c, d) {
        return b[d] || c;
      });
    },
    Rq = function (a) {
      var b = a.search;
      return a.protocol + '//' + a.hostname + a.pathname + (b ? b + '&richsstsse' : '?richsstsse');
    },
    Sq = function (a) {
      var b = {},
        c = '',
        d = a.pathname.indexOf('/g/collect');
      0 <= d && (c = a.pathname.substring(0, d));
      b.transport_url = a.protocol + '//' + a.hostname + c;
      return b;
    },
    Tq = function (a, b, c) {};
  var Wq = function (a, b, c) {
      var d = a + '?' + b;
      Uq &&
      0 !== d.indexOf('https://www.google-analytics.com/g/collect') &&
      0 !== d.indexOf('https://analytics.google.com/g/collect') &&
      !Mp
        ? Tq(d, c, function () {
            Vq(a, b + '&xhrError', c);
          })
        : Vq(a, b, c);
    },
    Xq = function (a) {
      return a && 0 === a.indexOf('google.') && 'google.com' != a
        ? 'https://www.%/ads/ga-audiences?v=1&t=sr&slf_rd=1&_r=4&'.replace('%', a)
        : void 0;
    },
    Uq = !1;
  var Yq = function () {
    this.C = 1;
    this.H = {};
    this.m = new kc();
    this.o = -1;
  };
  Yq.prototype.add = function (a) {
    var b = this,
      c;
    try {
      c = new Pq(a, this.H);
    } catch (h) {
      a.abort();
    }
    var d = Np(a);
    (d && this.m.C(c)) || this.flush();
    if (d && this.m.add(c)) {
      var e = 5e3;
      0 > this.o &&
        (this.o = D.setTimeout(function () {
          return b.flush();
        }, e));
    } else {
      var f = mc(c, this.C++);
      Wq(c.o, f.Xd, f.body);
      Zq(c, a.wd, a.da, String(a.s(B.md)));
    }
  };
  Yq.prototype.flush = function () {
    if (this.m.events.length) {
      var a = nc(this.m, this.C++);
      Wq(this.m.m, a.Xd, a.body);
      this.m = new kc();
      0 <= this.o && (D.clearTimeout(this.o), (this.o = -1));
    }
  };
  var Zq = function (a, b, c, d) {
      function e(k) {
        f.push(k + '=' + encodeURIComponent('' + a.Ha[k]));
      }
      if (b || c) {
        var f = [];
        e('tid');
        e('cid');
        e('gtm');
        f.push('aip=1');
        a.Ya.uid && f.push('uid=' + encodeURIComponent('' + a.Ya.uid));
        b &&
          (Vq('https://stats.g.doubleclick.net/g/collect', 'v=2&' + f.join('&')),
          Zh('https://stats.g.doubleclick.net/g/collect?v=2&' + f.join('&')));
        if (c) {
          f.push('z=' + Ca());
          var h = Xq(d);
          h && jd(h + f.join('&'));
        }
      }
    },
    Vq = function (a, b, c) {
      var d = a + '?' + b;
      c ? cd.sendBeacon && cd.sendBeacon(d, c) : td(d);
    };
  var $q = window,
    ar = document,
    br = function (a) {
      var b = $q._gaUserPrefs;
      if ((b && b.ioo && b.ioo()) || (a && !0 === $q['ga-disable-' + a])) return !0;
      try {
        var c = $q.external;
        if (c && c._gaUserPrefs && 'oo' == c._gaUserPrefs) return !0;
      } catch (f) {}
      for (var d = yf('AMP_TOKEN', String(ar.cookie), !0), e = 0; e < d.length; e++) if ('$OPT_OUT' == d[e]) return !0;
      return ar.getElementById('__gaOptOutExtension') ? !0 : !1;
    };
  var cr = {};
  var dr = function (a, b) {
    var c = B.B;
    J(c) ||
      Rd(function () {
        b.We = !0;
        b.Te = c;
        a.kf(b);
      }, c);
  };
  cr.Bg = '';
  var er = function (a, b) {
    this.eb = a;
    this.cb = b;
    this.W = new Yq();
    this.da = !1;
    this.o = this.C = this.m = void 0;
    this.H = !1;
  };
  aa = er.prototype;
  aa.Ih = function (a, b, c) {
    var d = this;
    this.da || ((this.da = !0), a !== B.ia && Ec(24));
    if (c.eventModel[B.Ib]) {
      if ('_' === a.charAt(0)) return;
      a !== B.ia && a !== B.za && aq(a) && Ec(58);
      fr(c);
    }
    var e = new Lp(this.eb, a, b, c, this.cb),
      f = [B.F],
      h = !1;
    (e.s(B.Db) || h) && f.push(B.B);
    Sd(function () {
      d.o = e;
      try {
        br(e.m) && (Ec(28), e.abort());
        var k = cr.Bg.replace(/\s+/g, '').split(',');
        0 <= za(k, e.I) && (Ec(33), e.abort());
        var l = e.Ic();
        l && l.blacklisted && (Ec(34), e.abort());
        var n = F.location.protocol;
        'http:' != n && 'https:' != n && (Ec(29), e.abort());
        cd && 'preview' == cd.loadPurpose && (Ec(30), e.abort());
        var p = M.grl;
        p || ((p = Bq()), (M.grl = p));
        p() || (Ec(35), e.abort());
        e.cb = Tp();
        var r = d.Ff,
          q;
        b: {
          if (!e.s(B.Na) || J(B.F) || 1 === e.W) break b;
          e.af = !0;
        }
        e.I === B.ia ? (e.s(B.Na) && fh(['aw', 'dc']), yq(e), (q = Aq(e))) : (q = {});
        r.call(d, q);
        e.I !== B.za && Yp();
        e.I == B.ia && (e.s(B.Fb) || e.abort(), (e.I = B.hc));
        var t = d.m,
          u = d.C,
          v = rq(e);
        v || (v = u);
        var x = Ja(e.s(B.Gb)),
          z;
        z = Ja(e.s(B.qc));
        var w;
        a: {
          if (v) {
            var y = v.split('.');
            if (!(4 > y.length || 5 < y.length)) {
              w = { sessionId: y[0], ee: Number(y[1]), Oc: !!Number(y[2]), Sd: Number(y[3]), Va: Number(y[4] || 0) };
              break a;
            }
          }
          w = void 0;
        }
        w && w.Va && (e.Va = Math.max(0, w.Va - Math.max(0, e.o - w.Sd)));
        var A = !1;
        w || ((A = e.cc = !0), (w = { sessionId: String(e.o), ee: 1, Oc: !1, Sd: e.o }));
        e.o > w.Sd + 60 * x && ((A = !0), (w.sessionId = String(e.o)), w.ee++, (w.Oc = !1));
        if (A) (e.C = !0), (e.cb = 0), Vp(), (Sp = 0);
        else if (Sp + Tp() > z || e.I == B.hc) w.Oc = !0;
        e.Ea(B.Hb, w.sessionId);
        e.Ea(B.td, w.ee);
        e.Ea(B.sd, w.Oc ? 1 : 0);
        var C = e.s(B.jb),
          G = e.W;
        C || ((C = lq(e)), (G = 3));
        C || ((C = t), (G = 4));
        if (!C) {
          var H = J(B.F),
            E = hq();
          C = !E.from_cookie || H ? E.vid : void 0;
          G = 5;
        }
        C ? (C = '' + C) : ((e.cc = e.Xe = !0), (C = Of()), (G = 6));
        e.Kf(C, G);
        var P = '',
          O = F.location;
        if (O) {
          var N = O.pathname || '';
          '/' != N.charAt(0) && (N = '/' + N);
          P = O.protocol + '//' + O.hostname + N + O.search;
        }
        e.Ea(B.ob, P);
        var fa;
        a: {
          var U = mf('gtm.gtagReferrer.' + e.m);
          fa = U ? '' + U : F.referrer;
        }
        var L = fa;
        L && e.Ea(B.Ma, L);
        e.Ea(B.rd, F.title);
        e.Ea(B.kb, (cd.language || '').toLowerCase());
        var Q = D.screen,
          ha = Q ? Q.width : 0,
          ma = Q ? Q.height : 0;
        e.Bd = ha + 'x' + ma;
        var X = !1 !== e.s(B.qa);
        X = !0;
        if (X && !1 !== e.s(B.Ab) && wl() && J(B.B)) {
          var qa = e.s(B.Db),
            Ga = e.s(B.nc);
          e.C && (e.wd = !!qa);
          qa && !Ga && 0 === e.Va && ((e.Va = 60), (e.da = !0));
        }
        gr(e);
        e.zd = 0 <= B.Qe.indexOf(e.I);
        for (var pc = e.s(B.pd) || [], ac = 0; ac < pc.length; ac++) {
          var qe = pc[ac];
          if (qe.rule_result) {
            e.Ea(B.Me, qe.traffic_type);
            Zp(3);
            break;
          }
        }
        if (void 0 === e.s(B.od)) {
          var qc = e.s(B.oc),
            re,
            pd;
          a: {
            if (wq) {
              var rc = tq(e) || {};
              if (rc && rc[B.L])
                for (var se = ke(me(e.s(B.Ma)), 'host', !0), qd = rc[B.L], na = 0; na < qd.length; na++)
                  if (qd[na] instanceof RegExp) {
                    if (qd[na].test(se)) {
                      pd = !0;
                      break a;
                    }
                  } else if (0 <= se.indexOf(qd[na])) {
                    pd = !0;
                    break a;
                  }
            }
            pd = !1;
          }
          var V;
          if (!(V = pd))
            if (Cq) V = !1;
            else {
              var hb = ke(me(e.s(B.Ma)), 'host', !0),
                Gb;
              var Hb = String(e.s(B.Z));
              if ('none' !== Hb)
                if ('auto' !== Hb) Gb = Hb;
                else {
                  if (!Eq) {
                    for (var Ib = String(e.s(B.Qa)), Wa = If(), La = 0; La < Wa.length; La++)
                      if ('none' !== Wa[La]) {
                        var ib = String(e.s(B.ja)) + '_ga_autodomain';
                        if (0 === Lf(ib, Dq, { Ia: B.F, domain: Wa[La], path: Ib })) {
                          Lf(ib, void 0, { Ia: B.F, domain: Wa[La], path: Ib });
                          Fq = Wa[La];
                          break;
                        }
                      }
                    Eq = !0;
                  }
                  Gb = Fq;
                }
              else Gb = void 0;
              var T = Gb;
              V = T ? 0 <= hb.indexOf(T) : !1;
            }
          if (!(re = V)) {
            var bc;
            if ((bc = qc))
              a: {
                for (var ub = qc.include_conditions || [], sc = 0; sc < ub.length; sc++)
                  if (ub[sc].test(e.s(B.Ma))) {
                    bc = !0;
                    break a;
                  }
                bc = !1;
              }
            re = bc;
          }
          re && (e.Ea(B.od, 1), Zp(4));
        }
        if (e.I == B.za) {
          var Qf = e.s(B.La);
          e.s(B.Ka)(e.s(Qf));
          e.abort();
        }
        if (e.M[B.Ac]) delete e.M[B.Ac];
        else {
          var Pc = e.s(B.dd);
          if (Pc) {
            for (var te = Pc.edit_rules || [], tc = 0; tc < te.length; tc++)
              a: {
                var vb = te[tc];
                if (fq(e, vb)) {
                  if (vb.new_event_name) {
                    var rd =
                      'string' === typeof vb.new_event_name
                        ? String(vb.new_event_name)
                        : cq(e.I, e.M, vb.new_event_name);
                    if (aq(rd)) break a;
                    e.I = String(rd);
                  }
                  dq(e.I, e.M, vb);
                  if (gq) {
                    e.M[B.Ac] = !0;
                    if (Vl().enableDeferrableCommandAfterConfig) {
                      var Rf = e.I,
                        Qa = e.M,
                        Ma = e.m;
                      Vl().insert('event', [Qa, Rf], Ma);
                    } else Yl(e.I, e.M, e.m, !0);
                    Zp(2);
                    e.abort();
                  } else Zp(2);
                }
              }
            for (var Aa = Pc.synthesis_rules || [], Ha = 0; Ha < Aa.length; Ha++) {
              var Jb = Aa[Ha];
              if (fq(e, Jb)) {
                var uc = Jb.new_event_name;
                if (!aq(uc)) {
                  var Kb = Jb.merge_source_event_params ? m(e.M) : {};
                  Kb[B.Ac] = !0;
                  dq(uc, Kb, Jb);
                  if (Vl().enableDeferrableCommandAfterConfig) {
                    var ue = uc,
                      nr = Kb,
                      or = e.m;
                    Vl().insert('event', [nr, ue], or);
                  } else Yl(uc, Kb, e.m, !0);
                  Zp(1);
                }
              }
            }
          }
        }
        var pi = e.M[B.vd];
        if (ya(pi)) for (var qi = 0; qi < pi.length; qi++) Zp(pi[qi]);
        var Em = ua('GA4_EVENT');
        Em && (e.yd = Em);
        var pr = d.Ff,
          Fm = d.m,
          ri;
        var si = sq(e);
        si ? (qq(si, e) || (Ec(25), e.abort()), (ri = si)) : (ri = void 0);
        var qr = ri,
          Sf;
        a: {
          var vc = e.M[B.jb];
          if (Fm && vc === Fm) {
            Sf = vc;
            break a;
          }
          vc
            ? ((vc = '' + vc), nq(vc, e) || (Ec(31), e.abort()), jq(vc, J(B.F)), (Sf = vc))
            : (Ec(32), e.abort(), (Sf = ''));
        }
        pr.call(d, { clientId: Sf, Jf: qr });
        d.Vh();
        Vp();
        d.kf(e);
        c.onSuccess();
      } catch (vr) {
        c.onFailure();
      }
      delete sa.GA4_EVENT;
    }, f);
  };
  aa.kf = function (a) {
    this.W.add(a);
  };
  aa.Ff = function (a) {
    var b = a.clientId,
      c = a.Jf;
    b && c && ((this.m = b), (this.C = c));
  };
  aa.flush = function () {
    this.W.flush();
  };
  aa.Vh = function () {
    var a = this;
    if (!this.H) {
      var b = J(B.F);
      Jd([B.F], function () {
        var c = J(B.F);
        if (b ^ c && a.o && a.C && a.m) {
          if (c) {
            var d = lq(a.o);
            d ? ((a.m = d), (a.C = rq(a.o))) : (nq(a.m, a.o), qq(a.C, a.o), jq(a.m, !0));
          } else (a.C = void 0), (a.m = void 0);
          b = c;
        }
      });
      this.H = !0;
    }
  };
  var gr = function (a) {
    var b = function (c) {
      return !!c && c.conversion;
    };
    a.eb = b(a.Ic());
    a.cc && (a.Ze = b(a.Ic('first_visit')));
    a.C && (a.df = b(a.Ic('session_start')));
  };
  function fr(a) {
    delete a.eventModel[B.Ib];
    hr(a.eventModel);
  }
  var hr = function (a) {
    Fa(a, function (c) {
      '_' === c.charAt(0) && delete a[c];
    });
    var b = a[B.Da] || {};
    Fa(b, function (c) {
      '_' === c.charAt(0) && delete b[c];
    });
  };
  var ir = function (a) {
      if ('prerender' == F.visibilityState) return !1;
      a();
      return !0;
    },
    jr = function (a) {
      if (!ir(a)) {
        var b = !1,
          c = function () {
            !b && ir(a) && ((b = !0), ld(F, 'visibilitychange', c), Ec(55));
          };
        kd(F, 'visibilitychange', c);
        Ec(54);
      }
    };
  var kr = function (a, b, c) {
      Yl(b, c, a);
    },
    lr = function (a, b, c) {
      Yl(b, c, a, !0);
    },
    rr = function (a, b) {
      var c = new er(a, b);
      jr(function () {
        mr(a, c);
      });
    };
  function mr(a, b) {
    Xl(a, function (c, d, e, f) {
      b.Ih(d, e, f);
    }),
      (Wp = function () {
        Vl().flush();
        1e3 <= Tp() && cd.sendBeacon && kr(a, B.xe, {});
        Mp = !0;
        b.flush();
        Xp = function () {
          Mp = !1;
          Xp = void 0;
        };
      });
  }
  var Z = { g: {} };
  (Z.g.ehl = ['google']),
    (function () {
      function a(l) {
        return l.target && l.target.location && l.target.location.href ? l.target.location.href : Hn();
      }
      function b(l, n) {
        kd(l, 'hashchange', function (p) {
          var r = a(p);
          n({ source: 'hashchange', state: null, url: Jn(r), V: In(r) });
        });
      }
      function c(l, n) {
        kd(l, 'popstate', function (p) {
          var r = a(p);
          n({ source: 'popstate', state: p.state, url: Jn(r), V: In(r) });
        });
      }
      function d(l, n, p) {
        var r = n.history,
          q = r[l];
        if (wa(q))
          try {
            r[l] = function (t, u, v) {
              q.apply(r, [].slice.call(arguments, 0));
              p({ source: l, state: t, url: Jn(Hn()), V: In(Hn()) });
            };
          } catch (t) {}
      }
      function e() {
        var l = { source: null, state: W('history').state || null, url: Jn(Hn()), V: In(Hn()) };
        return function (n, p) {
          var r = l,
            q = {};
          q[r.source] = !0;
          q[n.source] = !0;
          if (!q.popstate || !q.hashchange || r.V != n.V) {
            var t = {
              'event': 'gtm.historyChange-v2',
              'gtm.historyChangeSource': n.source,
              'gtm.oldUrlFragment': l.V,
              'gtm.newUrlFragment': n.V,
              'gtm.oldHistoryState': l.state,
              'gtm.newHistoryState': n.state,
              'gtm.oldUrl': l.url,
              'gtm.newUrl': n.url,
              'gtm.triggers': p.join(','),
            };
            l = n;
            Ln(t);
          }
        };
      }
      function f(l, n) {
        var p = '' + n;
        if (h[p]) h[p].push(l);
        else {
          var r = [l];
          h[p] = r;
          var q = e(),
            t = -1;
          k.push(function (u) {
            0 <= t && En(t);
            n
              ? (t = Fn(function () {
                  q(u, r);
                  t = -1;
                }, n))
              : q(u, r);
          });
        }
      }
      var h = {},
        k = [];
      (function (l) {
        Z.__ehl = l;
        Z.__ehl.h = 'ehl';
        Z.__ehl.i = !0;
        Z.__ehl.priorityOverride = 0;
      })(function (l) {
        var n = W('self'),
          p = l.vtp_uniqueTriggerId || '0',
          r = l.vtp_groupEvents ? Number(l.vtp_groupEventsInterval) : 0;
        0 > r ? (r = 0) : isNaN(r) && (r = 1e3);
        if (Qn('ehl')) {
          var q = km('ehl', 'reg');
          q ? (q(p, r), I(l.vtp_gtmOnSuccess)) : I(l.vtp_gtmOnFailure);
        } else {
          var t = function (u) {
            for (var v = 0; v < k.length; v++) k[v](u);
          };
          b(n, t);
          c(n, t);
          d('pushState', n, t);
          d('replaceState', n, t);
          f(p, r);
          im('ehl', 'reg', f);
          Rn('ehl');
          I(l.vtp_gtmOnSuccess);
        }
      });
    })();
  (Z.g.sdl = ['google']),
    (function () {
      function a() {
        return !!(
          Object.keys(l('horiz.pix')).length ||
          Object.keys(l('horiz.pct')).length ||
          Object.keys(l('vert.pix')).length ||
          Object.keys(l('vert.pct')).length
        );
      }
      function b(w) {
        for (var y = [], A = w.split(','), C = 0; C < A.length; C++) {
          var G = Number(A[C]);
          if (isNaN(G)) return [];
          p.test(A[C]) || y.push(G);
        }
        return y;
      }
      function c() {
        var w = 0,
          y = 0;
        return function () {
          var A = Zd(),
            C = A.height;
          w = Math.max(v.scrollLeft + A.width, w);
          y = Math.max(v.scrollTop + C, y);
          return { eh: w, fh: y };
        };
      }
      function d() {
        t = W('self');
        u = t.document;
        v = u.scrollingElement || (u.body && u.body.parentNode);
        z = c();
      }
      function e(w, y, A, C) {
        var G = l(y),
          H = {},
          E;
        for (E in G) {
          H.ab = E;
          if (G.hasOwnProperty(H.ab)) {
            var P = Number(H.ab);
            w < P ||
              (Ln({
                'event': 'gtm.scrollDepth',
                'gtm.scrollThreshold': P,
                'gtm.scrollUnits': A.toLowerCase(),
                'gtm.scrollDirection': C,
                'gtm.triggers': G[H.ab].join(','),
              }),
              jm(
                'sdl',
                y,
                (function (O) {
                  return function (N) {
                    delete N[O.ab];
                    return N;
                  };
                })(H),
                {},
              ));
          }
          H = { ab: H.ab };
        }
      }
      function f() {
        var w = z(),
          y = w.eh,
          A = w.fh,
          C = (y / v.scrollWidth) * 100,
          G = (A / v.scrollHeight) * 100;
        e(y, 'horiz.pix', r.xc, q.Se);
        e(C, 'horiz.pct', r.wc, q.Se);
        e(A, 'vert.pix', r.xc, q.jf);
        e(G, 'vert.pct', r.wc, q.jf);
        im('sdl', 'pending', !1);
      }
      function h() {
        var w = 250,
          y = !1;
        u.scrollingElement && u.documentElement && t.addEventListener && ((w = 50), (y = !0));
        var A = 0,
          C = !1,
          G = function () {
            C
              ? (A = Fn(G, w))
              : ((A = 0), f(), Qn('sdl') && !a() && (ld(t, 'scroll', H), ld(t, 'resize', H), im('sdl', 'init', !1)));
            C = !1;
          },
          H = function () {
            y && z();
            A ? (C = !0) : ((A = Fn(G, w)), im('sdl', 'pending', !0));
          };
        return H;
      }
      function k(w, y, A) {
        if (y) {
          var C = b(String(w));
          jm(
            'sdl',
            A,
            function (G) {
              for (var H = 0; H < C.length; H++) {
                var E = String(C[H]);
                G.hasOwnProperty(E) || (G[E] = []);
                G[E].push(y);
              }
              return G;
            },
            {},
          );
        }
      }
      function l(w) {
        return km('sdl', w, {});
      }
      function n(w) {
        I(w.vtp_gtmOnSuccess);
        var y = w.vtp_uniqueTriggerId,
          A = w.vtp_horizontalThresholdsPixels,
          C = w.vtp_horizontalThresholdsPercent,
          G = w.vtp_verticalThresholdUnits,
          H = w.vtp_verticalThresholdsPixels,
          E = w.vtp_verticalThresholdsPercent;
        switch (w.vtp_horizontalThresholdUnits) {
          case r.xc:
            k(A, y, 'horiz.pix');
            break;
          case r.wc:
            k(C, y, 'horiz.pct');
        }
        switch (G) {
          case r.xc:
            k(H, y, 'vert.pix');
            break;
          case r.wc:
            k(E, y, 'vert.pct');
        }
        Qn('sdl')
          ? km('sdl', 'pending') ||
            (x || (d(), (x = !0)),
            I(function () {
              return f();
            }))
          : (d(),
            (x = !0),
            v &&
              (Rn('sdl'),
              im('sdl', 'pending', !0),
              I(function () {
                f();
                if (a()) {
                  var P = h();
                  kd(t, 'scroll', P);
                  kd(t, 'resize', P);
                } else im('sdl', 'init', !1);
              })));
      }
      var p = /^\s*$/,
        r = { wc: 'PERCENT', xc: 'PIXELS' },
        q = { jf: 'vertical', Se: 'horizontal' },
        t,
        u,
        v,
        x = !1,
        z;
      (function (w) {
        Z.__sdl = w;
        Z.__sdl.h = 'sdl';
        Z.__sdl.i = !0;
        Z.__sdl.priorityOverride = 0;
      })(function (w) {
        w.vtp_triggerStartOption
          ? n(w)
          : sm(function () {
              n(w);
            });
      });
    })();

  (Z.g.c = ['google']),
    (function () {
      (function (a) {
        Z.__c = a;
        Z.__c.h = 'c';
        Z.__c.i = !0;
        Z.__c.priorityOverride = 0;
      })(function (a) {
        Tn(a.vtp_value, 'c', a.vtp_gtmEventId);
        return a.vtp_value;
      });
    })();
  (Z.g.e = ['google']),
    (function () {
      (function (a) {
        Z.__e = a;
        Z.__e.h = 'e';
        Z.__e.i = !0;
        Z.__e.priorityOverride = 0;
      })(function (a) {
        var b = String(sf(a.vtp_gtmEventId, 'event'));
        a.vtp_gtmCachedValues && (b = String(a.vtp_gtmCachedValues.event));
        return b;
      });
    })();

  (Z.g.u = ['google']),
    (function () {
      var a = function (b) {
        return {
          toString: function () {
            return b;
          },
        };
      };
      (function (b) {
        Z.__u = b;
        Z.__u.h = 'u';
        Z.__u.i = !0;
        Z.__u.priorityOverride = 0;
      })(function (b) {
        var c;
        c = (c = b.vtp_customUrlSource ? b.vtp_customUrlSource : Kn('gtm.url', 1)) || Hn();
        var d = b[a('vtp_component')];
        if (!d || 'URL' == d) return Jn(String(c));
        var e = me(String(c)),
          f;
        if ('QUERY' === d)
          a: {
            var h = b[a('vtp_multiQueryKeys').toString()],
              k = b[a('vtp_queryKey').toString()] || '',
              l = b[a('vtp_ignoreEmptyQueryParam').toString()],
              n;
            h ? (ya(k) ? (n = k) : (n = String(k).replace(/\s+/g, '').split(','))) : (n = [String(k)]);
            for (var p = 0; p < n.length; p++) {
              var r = ke(e, 'QUERY', void 0, void 0, n[p]);
              if (void 0 != r && (!l || '' !== r)) {
                f = r;
                break a;
              }
            }
            f = void 0;
          }
        else
          f = ke(
            e,
            d,
            'HOST' == d ? b[a('vtp_stripWww')] : void 0,
            'PATH' == d ? b[a('vtp_defaultPages')] : void 0,
            void 0,
          );
        return f;
      });
    })();
  (Z.g.v = ['google']),
    (function () {
      (function (a) {
        Z.__v = a;
        Z.__v.h = 'v';
        Z.__v.i = !0;
        Z.__v.priorityOverride = 0;
      })(function (a) {
        var b = a.vtp_name;
        if (!b || !b.replace) return !1;
        var c = Kn(b.replace(/\\\./g, '.'), a.vtp_dataLayerVersion || 1),
          d = void 0 !== c ? c : a.vtp_defaultValue;
        Tn(d, 'v', a.vtp_gtmEventId);
        return d;
      });
    })();

  (Z.g.ytl = ['google']),
    (function () {
      function a() {
        var u = Math.round(1e9 * Math.random()) + '';
        return F.getElementById(u) ? a() : u;
      }
      function b(u, v) {
        if (!u) return !1;
        for (var x = 0; x < p.length; x++) if (0 <= u.indexOf('//' + p[x] + '/' + v)) return !0;
        return !1;
      }
      function c(u, v) {
        var x = u.getAttribute('src');
        if (b(x, 'embed/')) {
          if (0 < x.indexOf('enablejsapi=1')) return !0;
          if (v) {
            var z = u.setAttribute,
              w;
            var y = -1 !== x.indexOf('?') ? '&' : '?';
            if (-1 < x.indexOf('origin=')) w = x + y + 'enablejsapi=1';
            else {
              if (!q) {
                var A = W('document');
                q = A.location.protocol + '//' + A.location.hostname;
                A.location.port && (q += ':' + A.location.port);
              }
              w = x + y + 'enablejsapi=1&origin=' + encodeURIComponent(q);
            }
            z.call(u, 'src', w);
            return !0;
          }
        }
        return !1;
      }
      function d(u, v) {
        if (
          !u.getAttribute('data-gtm-yt-inspected-' + v.he) &&
          (u.setAttribute('data-gtm-yt-inspected-' + v.he, 'true'), c(u, v.xf))
        ) {
          u.id || (u.id = a());
          var x = W('YT'),
            z = x.get(u.id);
          z || (z = new x.Player(u.id));
          var w = f(z, v),
            y = {},
            A;
          for (A in w)
            (y.zb = A),
              w.hasOwnProperty(y.zb) &&
                z.addEventListener(
                  y.zb,
                  (function (C) {
                    return function (G) {
                      return w[C.zb](G.data);
                    };
                  })(y),
                ),
              (y = { zb: y.zb });
        }
      }
      function e(u) {
        I(function () {
          function v() {
            for (var z = x.getElementsByTagName('iframe'), w = z.length, y = 0; y < w; y++) d(z[y], u);
          }
          var x = W('document');
          v();
          nm(v);
        });
      }
      function f(u, v) {
        var x, z;
        function w() {
          N = om(
            function () {
              return { url: K, title: U, sf: S, bh: u.getCurrentTime(), playbackRate: L };
            },
            v.he,
            u.getIframe(),
          );
          S = 0;
          U = K = '';
          L = 1;
          return y;
        }
        function y(X) {
          switch (X) {
            case r.PLAYING:
              S = Math.round(u.getDuration());
              K = u.getVideoUrl();
              if (u.getVideoData) {
                var qa = u.getVideoData();
                U = qa ? qa.title : '';
              }
              L = u.getPlaybackRate();
              v.Wg ? Ln(N.createEvent('start')) : N.Ed();
              fa = l(v.Kh, v.Jh, u.getDuration());
              return A(X);
            default:
              return y;
          }
        }
        function A() {
          Q = u.getCurrentTime();
          ha = Gn().getTime();
          N.Ph();
          O();
          return C;
        }
        function C(X) {
          var qa;
          switch (X) {
            case r.ENDED:
              return H(X);
            case r.PAUSED:
              qa = 'pause';
            case r.BUFFERING:
              var Ga = u.getCurrentTime() - Q;
              qa = 1 < Math.abs(((Gn().getTime() - ha) / 1e3) * L - Ga) ? 'seek' : qa || 'buffering';
              u.getCurrentTime() && (v.Vg ? Ln(N.createEvent(qa)) : N.Ed());
              P();
              return G;
            case r.UNSTARTED:
              return w(X);
            default:
              return C;
          }
        }
        function G(X) {
          switch (X) {
            case r.ENDED:
              return H(X);
            case r.PLAYING:
              return A(X);
            case r.UNSTARTED:
              return w(X);
            default:
              return G;
          }
        }
        function H() {
          for (; z; ) {
            var X = x;
            En(z);
            X();
          }
          v.Ug && Ln(N.createEvent('complete', 1));
          return w(r.UNSTARTED);
        }
        function E() {}
        function P() {
          z && (En(z), (z = 0), (x = E));
        }
        function O() {
          if (fa.length && 0 !== L) {
            var X = -1,
              qa;
            do {
              qa = fa[0];
              if (qa.Xa > u.getDuration()) return;
              X = (qa.Xa - u.getCurrentTime()) / L;
              if (0 > X && (fa.shift(), 0 === fa.length)) return;
            } while (0 > X);
            x = function () {
              z = 0;
              x = E;
              0 < fa.length && fa[0].Xa === qa.Xa && (fa.shift(), Ln(N.createEvent('progress', qa.Cf, qa.Hf)));
              O();
            };
            z = Fn(x, 1e3 * X);
          }
        }
        var N,
          fa = [],
          S,
          K,
          U,
          L,
          Q,
          ha,
          ma = w(r.UNSTARTED);
        z = 0;
        x = E;
        return {
          onStateChange: function (X) {
            ma = ma(X);
          },
          onPlaybackRateChange: function (X) {
            Q = u.getCurrentTime();
            ha = Gn().getTime();
            N.Ed();
            L = X;
            P();
            O();
          },
        };
      }
      function h(u) {
        for (var v = u.split(','), x = v.length, z = [], w = 0; w < x; w++) {
          var y = parseInt(v[w], 10);
          isNaN(y) || 100 < y || 0 > y || z.push(y / 100);
        }
        z.sort(function (A, C) {
          return A - C;
        });
        return z;
      }
      function k(u) {
        for (var v = u.split(','), x = v.length, z = [], w = 0; w < x; w++) {
          var y = parseInt(v[w], 10);
          isNaN(y) || 0 > y || z.push(y);
        }
        z.sort(function (A, C) {
          return A - C;
        });
        return z;
      }
      function l(u, v, x) {
        var z = u.map(function (A) {
          return { Xa: A, Hf: A, Cf: void 0 };
        });
        if (!v.length) return z;
        var w = v.map(function (A) {
          return { Xa: A * x, Hf: void 0, Cf: A };
        });
        if (!z.length) return w;
        var y = z.concat(w);
        y.sort(function (A, C) {
          return A.Xa - C.Xa;
        });
        return y;
      }
      function n(u) {
        var v = !!u.vtp_captureStart,
          x = !!u.vtp_captureComplete,
          z = !!u.vtp_capturePause,
          w = h(u.vtp_progressThresholdsPercent + ''),
          y = k(u.vtp_progressThresholdsTimeInSeconds + ''),
          A = !!u.vtp_fixMissingApi;
        if (v || x || z || w.length || y.length) {
          var C = {
              Wg: v,
              Ug: x,
              Vg: z,
              Jh: w,
              Kh: y,
              xf: A,
              he: void 0 === u.vtp_uniqueTriggerId ? '' : u.vtp_uniqueTriggerId,
            },
            G = W('YT'),
            H = function () {
              e(C);
            };
          I(u.vtp_gtmOnSuccess);
          if (G) G.ready && G.ready(H);
          else {
            var E = W('onYouTubeIframeAPIReady');
            Mn('onYouTubeIframeAPIReady', function () {
              E && E();
              H();
            });
            I(function () {
              for (var P = W('document'), O = P.getElementsByTagName('script'), N = O.length, fa = 0; fa < N; fa++) {
                var S = O[fa].getAttribute('src');
                if (b(S, 'iframe_api') || b(S, 'player_api')) return;
              }
              for (var K = P.getElementsByTagName('iframe'), U = K.length, L = 0; L < U; L++)
                if (!t && c(K[L], C.xf)) {
                  R('https://www.youtube.com/iframe_api');
                  t = !0;
                  break;
                }
            });
          }
        } else I(u.vtp_gtmOnSuccess);
      }
      var p = ['www.youtube.com', 'www.youtube-nocookie.com'],
        r = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
        q,
        t = !1;
      (function (u) {
        Z.__ytl = u;
        Z.__ytl.h = 'ytl';
        Z.__ytl.i = !0;
        Z.__ytl.priorityOverride = 0;
      })(function (u) {
        u.vtp_triggerStartOption
          ? n(u)
          : ei(function () {
              n(u);
            });
      });
    })();

  (Z.g.aev = ['google']),
    (function () {
      function a(t, u, v) {
        var x = t || sf(u, 'gtm');
        if (x) return x[v];
      }
      function b(t, u, v, x, z) {
        z || (z = 'element');
        var w = u + '.' + v,
          y;
        if (p.hasOwnProperty(w)) y = p[w];
        else {
          var A = a(t, u, z);
          if (A && ((y = x(A)), (p[w] = y), r.push(w), 35 < r.length)) {
            var C = r.shift();
            delete p[C];
          }
        }
        return y;
      }
      function c(t, u, v, x) {
        var z = a(t, u, q[v]);
        return void 0 !== z ? z : x;
      }
      function d(t, u) {
        if (!t) return !1;
        var v = e(Hn());
        ya(u) ||
          (u = String(u || '')
            .replace(/\s+/g, '')
            .split(','));
        for (var x = [v], z = 0; z < u.length; z++) {
          var w = u[z];
          if (w.hasOwnProperty('is_regex'))
            if (w.is_regex)
              try {
                w = new RegExp(w.domain);
              } catch (A) {
                continue;
              }
            else w = w.domain;
          if (w instanceof RegExp) {
            if (w.test(t)) return !1;
          } else {
            var y = w;
            if (0 != y.length) {
              if (0 <= e(t).indexOf(y)) return !1;
              x.push(e(y));
            }
          }
        }
        return !zo(t, x);
      }
      function e(t) {
        n.test(t) || (t = 'http://' + t);
        return ke(me(t), 'HOST', !0);
      }
      function f(t, u, v, x) {
        switch (t) {
          case 'SUBMIT_TEXT':
            return b(u, v, 'FORM.' + t, h, 'formSubmitElement') || x;
          case 'LENGTH':
            var z = b(u, v, 'FORM.' + t, k);
            return void 0 === z ? x : z;
          case 'INTERACTED_FIELD_ID':
            return l(u, v, 'id', x);
          case 'INTERACTED_FIELD_NAME':
            return l(u, v, 'name', x);
          case 'INTERACTED_FIELD_TYPE':
            return l(u, v, 'type', x);
          case 'INTERACTED_FIELD_POSITION':
            var w = a(u, v, 'interactedFormFieldPosition');
            return void 0 === w ? x : w;
          case 'INTERACT_SEQUENCE_NUMBER':
            var y = a(u, v, 'interactSequenceNumber');
            return void 0 === y ? x : y;
          default:
            return x;
        }
      }
      function h(t) {
        switch (t.tagName.toLowerCase()) {
          case 'input':
            return md(t, 'value');
          case 'button':
            return nd(t);
          default:
            return null;
        }
      }
      function k(t) {
        if ('form' === t.tagName.toLowerCase() && t.elements) {
          for (var u = 0, v = 0; v < t.elements.length; v++) rn(t.elements[v]) && u++;
          return u;
        }
      }
      function l(t, u, v, x) {
        var z = a(t, u, 'interactedFormField');
        return (z && md(z, v)) || x;
      }
      var n = /^https?:\/\//i,
        p = {},
        r = [],
        q = {
          ATTRIBUTE: 'elementAttribute',
          CLASSES: 'elementClasses',
          ELEMENT: 'element',
          ID: 'elementId',
          HISTORY_CHANGE_SOURCE: 'historyChangeSource',
          HISTORY_NEW_STATE: 'newHistoryState',
          HISTORY_NEW_URL_FRAGMENT: 'newUrlFragment',
          HISTORY_OLD_STATE: 'oldHistoryState',
          HISTORY_OLD_URL_FRAGMENT: 'oldUrlFragment',
          TARGET: 'elementTarget',
        };
      (function (t) {
        Z.__aev = t;
        Z.__aev.h = 'aev';
        Z.__aev.i = !0;
        Z.__aev.priorityOverride = 0;
      })(function (t) {
        var u = t.vtp_gtmEventId,
          v = t.vtp_defaultValue,
          x = t.vtp_varType,
          z;
        t.vtp_gtmCachedValues && (z = t.vtp_gtmCachedValues.gtm);
        switch (x) {
          case 'TAG_NAME':
            var w = a(z, u, 'element');
            return (w && w.tagName) || v;
          case 'TEXT':
            return b(z, u, x, nd) || v;
          case 'URL':
            var y;
            a: {
              var A = String(a(z, u, 'elementUrl') || v || ''),
                C = me(A),
                G = String(t.vtp_component || 'URL');
              switch (G) {
                case 'URL':
                  y = A;
                  break a;
                case 'IS_OUTBOUND':
                  y = d(A, t.vtp_affiliatedDomains);
                  break a;
                default:
                  y = ke(C, G, t.vtp_stripWww, t.vtp_defaultPages, t.vtp_queryKey);
              }
            }
            return y;
          case 'ATTRIBUTE':
            var H;
            if (void 0 === t.vtp_attribute) H = c(z, u, x, v);
            else {
              var E = t.vtp_attribute,
                P = a(z, u, 'element');
              H = (P && md(P, E)) || v || '';
            }
            return H;
          case 'MD':
            var O = t.vtp_mdValue,
              N = b(z, u, 'MD', An);
            return O && N ? Dn(N, O) || v : N || v;
          case 'FORM':
            return f(String(t.vtp_component || 'SUBMIT_TEXT'), z, u, v);
          default:
            var fa = c(z, u, x, v);
            Tn(fa, 'aev', t.vtp_gtmEventId);
            return fa;
        }
      });
    })();

  (Z.g.dlm = ['google']),
    (function () {
      (function (a) {
        Z.__dlm = a;
        Z.__dlm.h = 'dlm';
        Z.__dlm.i = !0;
        Z.__dlm.priorityOverride = 0;
      })(function (a) {
        var b = Ao(a.vtp_userInput || [], 'key', 'value') || {};
        a.vtp_synchronousWrite
          ? Fa(b, function (c, d) {
              pf(c, d);
            })
          : Ln(b);
        I(a.vtp_gtmOnSuccess);
      });
    })();
  (Z.g.gct = ['google']),
    (function () {
      function a(d) {
        for (var e = [], f = 0; f < d.length; f++)
          try {
            e.push(new RegExp(d[f]));
          } catch (h) {}
        return e;
      }
      function b(d) {
        return d.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
      }
      function c(d) {
        for (var e = [], f = 0; f < d.length; f++) {
          var h = d[f].matchValue,
            k;
          switch (d[f].matchType) {
            case 'BEGINS_WITH':
              k = '^' + b(h);
              break;
            case 'ENDS_WITH':
              k = b(h) + '$';
              break;
            case 'EQUALS':
              k = '^' + b(h) + '$';
              break;
            case 'REGEX':
              k = h;
              break;
            default:
              k = b(h);
          }
          e.push(k);
        }
        return e;
      }
      (function (d) {
        Z.__gct = d;
        Z.__gct.h = 'gct';
        Z.__gct.i = !0;
        Z.__gct.priorityOverride = 0;
      })(function (d) {
        var e = {};
        0 < d.vtp_sessionDuration && (e[B.Gb] = d.vtp_sessionDuration);
        e[B.kd] = d.vtp_eventSettings;
        e[B.dd] = d.vtp_dynamicEventSettings;
        e[B.Db] = 1 === d.vtp_googleSignals;
        e[B.md] = d.vtp_foreignTld;
        e[B.nc] = 1 === d.vtp_restrictDomain;
        e[B.pd] = d.vtp_internalTrafficResults;
        var f = B.sa,
          h = d.vtp_linker;
        h && h[B.L] && (h[B.L] = a(h[B.L]));
        e[f] = h;
        var k = B.oc,
          l = d.vtp_referralExclusionDefinition;
        l && l.include_conditions && (l.include_conditions = a(l.include_conditions));
        e[k] = l;
        var n,
          p = d.vtp_trackingId;
        n = Vl().getRemoteConfig(p);
        var r = n.referral_exclusion_conditions;
        if (r) {
          var q = c(r);
          e[B.oc] = { include_conditions: a(q) };
        }
        var t = n.cross_domain_conditions;
        if (t) {
          var u = c(t),
            v = {};
          e[B.sa] = ((v[B.L] = a(u)), (v[B.mb] = !0), (v[B.lb] = !0), (v[B.nb] = 'query'), v);
        }
        rr(d.vtp_trackingId, e);
        I(d.vtp_gtmOnSuccess);
      });
    })();

  (Z.g.get = ['google']),
    (function () {
      (function (a) {
        Z.__get = a;
        Z.__get.h = 'get';
        Z.__get.i = !0;
        Z.__get.priorityOverride = 0;
      })(function (a) {
        var b = a.vtp_settings;
        (a.vtp_deferrable ? lr : kr)(String(b.streamId), String(a.vtp_eventName), b.eventParameters || {});
        a.vtp_gtmOnSuccess();
      });
    })();

  (Z.g.lcl = []),
    (function () {
      function a() {
        var c = W('document'),
          d = 0,
          e = function (f) {
            var h = f.target;
            if (h && 3 !== f.which && !(f.sh || (f.timeStamp && f.timeStamp === d))) {
              d = f.timeStamp;
              h = sd(h, ['a', 'area'], 100);
              if (!h) return f.returnValue;
              var k = f.defaultPrevented || !1 === f.returnValue,
                l = km('lcl', k ? 'nv.mwt' : 'mwt', 0),
                n;
              n = k ? km('lcl', 'nv.ids', []) : km('lcl', 'ids', []);
              if (n.length) {
                var p = gm(h, 'gtm.linkClick', n);
                if (b(f, h, c) && !k && l && h.href) {
                  var r = !!Ba(String(ud(h, 'rel') || '').split(' '), function (u) {
                    return 'noreferrer' === u.toLowerCase();
                  });
                  r && Ec(36);
                  var q = W((ud(h, 'target') || '_self').substring(1)),
                    t = !0;
                  if (
                    Ln(
                      p,
                      en(function () {
                        var u;
                        if ((u = t && q)) {
                          var v;
                          a: if (r) {
                            var x;
                            try {
                              x = new MouseEvent(f.type, { bubbles: !0 });
                            } catch (z) {
                              if (!c.createEvent) {
                                v = !1;
                                break a;
                              }
                              x = c.createEvent('MouseEvents');
                              x.initEvent(f.type, !0, !0);
                            }
                            x.sh = !0;
                            f.target.dispatchEvent(x);
                            v = !0;
                          } else v = !1;
                          u = !v;
                        }
                        u && (q.location.href = ud(h, 'href'));
                      }),
                      l,
                    )
                  )
                    t = !1;
                  else return f.preventDefault && f.preventDefault(), (f.returnValue = !1);
                } else Ln(p, function () {}, l || 2e3);
                return !0;
              }
            }
          };
        kd(c, 'click', e, !1);
        kd(c, 'auxclick', e, !1);
      }
      function b(c, d, e) {
        if (2 === c.which || c.ctrlKey || c.shiftKey || c.altKey || c.metaKey) return !1;
        var f = ud(d, 'href'),
          h = f.indexOf('#'),
          k = ud(d, 'target');
        if ((k && '_self' !== k && '_parent' !== k && '_top' !== k) || 0 === h) return !1;
        if (0 < h) {
          var l = Jn(f),
            n = Jn(e.location);
          return l !== n;
        }
        return !0;
      }
      (function (c) {
        Z.__lcl = c;
        Z.__lcl.h = 'lcl';
        Z.__lcl.i = !0;
        Z.__lcl.priorityOverride = 0;
      })(function (c) {
        var d = void 0 === c.vtp_waitForTags ? !0 : c.vtp_waitForTags,
          e = void 0 === c.vtp_checkValidation ? !0 : c.vtp_checkValidation,
          f = Number(c.vtp_waitForTagsTimeout);
        if (!f || 0 >= f) f = 2e3;
        var h = c.vtp_uniqueTriggerId || '0';
        if (d) {
          var k = function (n) {
            return Math.max(f, n);
          };
          jm('lcl', 'mwt', k, 0);
          e || jm('lcl', 'nv.mwt', k, 0);
        }
        var l = function (n) {
          n.push(h);
          return n;
        };
        jm('lcl', 'ids', l, []);
        e || jm('lcl', 'nv.ids', l, []);
        Qn('lcl') || (a(), Rn('lcl'));
        I(c.vtp_gtmOnSuccess);
      });
    })();

  var sr = {};
  (sr.macro = function (a) {
    if (mn.Cd.hasOwnProperty(a)) return mn.Cd[a];
  }),
    (sr.onHtmlSuccess = mn.qf(!0)),
    (sr.onHtmlFailure = mn.qf(!1));
  sr.dataLayer = nf;
  sr.callback = function (a) {
    df.hasOwnProperty(a) && wa(df[a]) && df[a]();
    delete df[a];
  };
  sr.bootstrap = 0;
  sr._spx = !1;
  function tr() {
    M[Te.K] = sr;
    Ta(ef, Z.g);
    Rb = Rb || mn;
    Sb = $b;
  }
  function ur() {
    var a = !1;
    a && ni('INIT');
    vd.o().o();
    M = D.google_tag_manager = D.google_tag_manager || {};
    sk();
    Ig.enable_gbraid_cookie_write = !0;
    if (M[Te.K]) {
      var b = M.zones;
      b && b.unregisterChild(Te.K);
    } else {
      for (var c = data.resource || {}, d = c.macros || [], e = 0; e < d.length; e++) Fb.push(d[e]);
      for (var f = c.tags || [], h = 0; h < f.length; h++) Nb.push(f[h]);
      for (var k = c.predicates || [], l = 0; l < k.length; l++) Mb.push(k[l]);
      for (var n = c.rules || [], p = 0; p < n.length; p++) {
        for (var r = n[p], q = {}, t = 0; t < r.length; t++) q[r[t][0]] = Array.prototype.slice.call(r[t], 1);
        Lb.push(q);
      }
      Pb = Z;
      Qb = vo;
      tr();
      ln();
      $h = !1;
      ai = 0;
      if (('interactive' == F.readyState && !F.createEventObject) || 'complete' == F.readyState) ci();
      else {
        kd(F, 'DOMContentLoaded', ci);
        kd(F, 'readystatechange', ci);
        if (F.createEventObject && F.documentElement.doScroll) {
          var u = !0;
          try {
            u = !D.frameElement;
          } catch (y) {}
          u && di();
        }
        kd(D, 'load', ci);
      }
      pm = !1;
      'complete' === F.readyState ? rm() : kd(D, 'load', rm);
      ej && D.setInterval(dj, 864e5);
      bf = new Date().getTime();
      sr.bootstrap = bf;
      if (a) {
        var w = oi('INIT');
      }
    }
  }
  (function (a) {
    if (!D['__TAGGY_INSTALLED']) {
      var b = !1;
      if (F.referrer) {
        var c = me(F.referrer);
        b = 'cct.google' === je(c, 'host');
      }
      if (!b) {
        var d = Cf('googTaggyReferrer');
        b = d.length && d[0].length;
      }
      b && ((D['__TAGGY_INSTALLED'] = !0), gd('https://cct.google/taggy/agent.js'));
    }
    var f = function () {
        var n = D['google.tagmanager.debugui2.queue'];
        n ||
          ((n = []),
          (D['google.tagmanager.debugui2.queue'] = n),
          gd('https://www.googletagmanager.com/debug/bootstrap'));
        var p = { messageType: 'CONTAINER_STARTING', data: { scriptSource: dd, containerProduct: 'GTM', debug: !1 } };
        p.data.resume = function () {
          a();
        };
        p.data.containerProduct = 'OGT';
        Te.Uf && (p.data.initialPublish = !0);
        n.push(p);
      },
      h = 'x' === ke(D.location, 'query', !1, void 0, 'gtm_debug');
    if (!h && F.referrer) {
      var k = me(F.referrer);
      h = 'tagassistant.google.com' === je(k, 'host');
    }
    if (!h) {
      var l = Cf('__TAG_ASSISTANT');
      h = l.length && l[0].length;
    }
    D.__TAG_ASSISTANT_API && (h = !0);
    h && dd ? f() : a();
  })(ur);
})();
