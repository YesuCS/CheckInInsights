System.register(['vue', '@Obsidian/Controls/datePicker.obs', '@Obsidian/Controls/notificationBox.obs', '@Obsidian/Controls/panel.obs', '@Obsidian/Utility/block', '@Obsidian/Controls/dropDownList.obs', '@Obsidian/Controls/modal.obs', '@Obsidian/Controls/Internal/dockedPanel.obs', '@Obsidian/Controls/rockButton.obs', '@Obsidian/Enums/Controls/btnType'], (function (exports) {
  'use strict';
  var defineComponent, ref, watch, openBlock, createBlock, unref, withCtx, createElementBlock, Fragment, renderList, createVNode, computed, createElementVNode, toDisplayString, normalizeClass, createCommentVNode, createTextVNode, normalizeStyle, pushScopeId, popScopeId, onUnmounted, DatePicker, NotificationBox, Panel, useConfigurationValues, useInvokeBlockAction, usePersonPreferences, DropDownList, Modal, DockedPanel, RockButton, BtnType;
  return {
    setters: [function (module) {
      defineComponent = module.defineComponent;
      ref = module.ref;
      watch = module.watch;
      openBlock = module.openBlock;
      createBlock = module.createBlock;
      unref = module.unref;
      withCtx = module.withCtx;
      createElementBlock = module.createElementBlock;
      Fragment = module.Fragment;
      renderList = module.renderList;
      createVNode = module.createVNode;
      computed = module.computed;
      createElementVNode = module.createElementVNode;
      toDisplayString = module.toDisplayString;
      normalizeClass = module.normalizeClass;
      createCommentVNode = module.createCommentVNode;
      createTextVNode = module.createTextVNode;
      normalizeStyle = module.normalizeStyle;
      pushScopeId = module.pushScopeId;
      popScopeId = module.popScopeId;
      onUnmounted = module.onUnmounted;
    }, function (module) {
      DatePicker = module.default;
    }, function (module) {
      NotificationBox = module.default;
    }, function (module) {
      Panel = module.default;
    }, function (module) {
      useConfigurationValues = module.useConfigurationValues;
      useInvokeBlockAction = module.useInvokeBlockAction;
      usePersonPreferences = module.usePersonPreferences;
    }, function (module) {
      DropDownList = module.default;
    }, function (module) {
      Modal = module.default;
    }, function (module) {
      DockedPanel = module.default;
    }, function (module) {
      RockButton = module.default;
    }, function (module) {
      BtnType = module.BtnType;
    }],
    execute: (function () {

      function _defineProperty(e, r, t) {
        return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[r] = t, e;
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function (r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread2(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
            _defineProperty(e, r, t[r]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
          });
        }
        return e;
      }
      function _toPrimitive(t, r) {
        if ("object" != typeof t || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != typeof i) return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == typeof i ? i : i + "";
      }

      var script$2 = defineComponent({
        __name: 'filtersModal.partial',
        props: {
          modelValue: {
            type: Boolean,
            default: false
          },
          sections: {
            type: Array,
            required: true
          },
          selections: {
            type: Object,
            required: true
          }
        },
        emits: ["update:modelValue", "update:selections"],
        setup(__props, _ref) {
          let __emit = _ref.emit;
          const props = __props;
          const emit = __emit;
          const isOpen = ref(props.modelValue);
          const draft = ref({});
          watch(() => props.modelValue, value => {
            isOpen.value = value;
            if (value) {
              const next = {};
              for (const section of props.sections) {
                var _props$selections$sec;
                next[section.key] = [...((_props$selections$sec = props.selections[section.key]) !== null && _props$selections$sec !== void 0 ? _props$selections$sec : [])];
              }
              draft.value = next;
            }
          });
          watch(isOpen, value => {
            if (value !== props.modelValue) {
              emit("update:modelValue", value);
            }
          });
          function toItems(options) {
            return options.map(o => ({
              value: o,
              text: o
            }));
          }
          function onApply() {
            emit("update:selections", _objectSpread2({}, draft.value));
            isOpen.value = false;
          }
          return (_ctx, _cache) => {
            return openBlock(), createBlock(unref(Modal), {
              modelValue: isOpen.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => isOpen.value = $event),
              title: "Apply Filters",
              saveText: "Apply",
              onSave: onApply
            }, {
              default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.sections, section => {
                return openBlock(), createElementBlock("div", {
                  key: section.key
                }, [createVNode(unref(DropDownList), {
                  modelValue: draft.value[section.key],
                  "onUpdate:modelValue": $event => draft.value[section.key] = $event,
                  label: section.label,
                  items: toItems(section.options),
                  multiple: true,
                  enhanceForLongLists: true,
                  showBlankItem: false,
                  help: "Leave empty to include all ".concat(section.label.toLowerCase(), ".")
                }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "items", "help"])]);
              }), 128))]),
              _: 1
            }, 8, ["modelValue"]);
          };
        }
      });

      script$2.__file = "src/CheckInInsights/filtersModal.partial.obs";

      const _withScopeId$1 = n => (pushScopeId("data-v-1a056900"), n = n(), popScopeId(), n);
      const _hoisted_1$1 = {
        key: 0,
        class: "bg-interface-softer"
      };
      const _hoisted_2$1 = {
        class: "d-flex justify-content-end px-spacing-sm pt-spacing-xs"
      };
      const _hoisted_3$1 = {
        class: "px-spacing-md py-spacing-xs d-flex align-items-center justify-content-between"
      };
      const _hoisted_4$1 = {
        class: "d-flex flex-column"
      };
      const _hoisted_5$1 = {
        class: "text-interface-stronger text-md text-semibold"
      };
      const _hoisted_6$1 = {
        class: "text-interface-medium text-sm"
      };
      const _hoisted_7$1 = {
        class: "text-interface-medium text-sm"
      };
      const _hoisted_8$1 = {
        key: 0,
        class: "label label-danger ml-1"
      };
      const _hoisted_9$1 = {
        class: "d-flex gap-xs"
      };
      const _hoisted_10$1 = _withScopeId$1(() => createElementVNode("i", {
        class: "ti ti-users"
      }, null, -1));
      const _hoisted_11$1 = _withScopeId$1(() => createElementVNode("i", {
        class: "ti ti-door"
      }, null, -1));
      const _hoisted_12$1 = _withScopeId$1(() => createElementVNode("i", {
        class: "ti ti-calendar-time"
      }, null, -1));
      const _hoisted_13$1 = {
        key: 0,
        class: "p-spacing-md"
      };
      const _hoisted_14$1 = _withScopeId$1(() => createElementVNode("div", {
        class: "text-semibold mb-spacing-xs"
      }, "Window Detail", -1));
      const _hoisted_15$1 = {
        class: "cci-detail-section"
      };
      const _hoisted_16$1 = {
        class: "cci-detail-row"
      };
      const _hoisted_17$1 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Schedule", -1));
      const _hoisted_18$1 = {
        class: "cci-detail-row"
      };
      const _hoisted_19$1 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Check-in", -1));
      const _hoisted_20$1 = {
        class: "cci-detail-row"
      };
      const _hoisted_21$1 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Event", -1));
      const _hoisted_22$1 = {
        class: "cci-detail-row"
      };
      const _hoisted_23$1 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Configuration", -1));
      const _hoisted_24 = {
        class: "cci-detail-row"
      };
      const _hoisted_25 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Area", -1));
      const _hoisted_26 = _withScopeId$1(() => createElementVNode("div", {
        class: "text-semibold mt-spacing-md mb-spacing-xs"
      }, "Room", -1));
      const _hoisted_27 = {
        class: "cci-detail-section"
      };
      const _hoisted_28 = {
        class: "cci-detail-row"
      };
      const _hoisted_29 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Checked in", -1));
      const _hoisted_30 = {
        key: 0,
        class: "progress cci-capacity-bar"
      };
      const _hoisted_31 = {
        class: "cci-detail-row"
      };
      const _hoisted_32 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Soft threshold", -1));
      const _hoisted_33 = {
        class: "cci-detail-row"
      };
      const _hoisted_34 = _withScopeId$1(() => createElementVNode("span", {
        class: "text-interface-medium"
      }, "Firm threshold", -1));
      const _hoisted_35 = _withScopeId$1(() => createElementVNode("div", {
        class: "text-semibold mt-spacing-md mb-spacing-xs"
      }, "Also in this room today", -1));
      const _hoisted_36 = {
        class: "cci-detail-section"
      };
      const _hoisted_37 = ["onClick"];
      const _hoisted_38 = {
        key: 0,
        class: "ti ti-alert-triangle text-danger"
      };
      const _hoisted_39 = {
        class: "text-interface-medium"
      };
      var script$1 = defineComponent({
        __name: 'windowDetailPanel.partial',
        props: {
          modelValue: {
            type: Boolean,
            required: true
          },
          window: {
            type: Object,
            default: null
          },
          allWindows: {
            type: Array,
            default: () => []
          }
        },
        emits: ["update:modelValue", "select"],
        setup(__props, _ref) {
          let __emit = _ref.emit;
          const props = __props;
          const emit = __emit;
          const isVisible = ref(props.modelValue);
          watch(() => props.modelValue, value => {
            isVisible.value = value;
          });
          watch(isVisible, value => {
            if (value !== props.modelValue) {
              emit("update:modelValue", value);
            }
          });
          const sameRoomWindows = computed(() => {
            const current = props.window;
            if (!(current !== null && current !== void 0 && current.locationIdKey)) {
              return [];
            }
            return props.allWindows.filter(w => w.locationIdKey === current.locationIdKey && !(w.groupIdKey === current.groupIdKey && w.scheduleIdKey === current.scheduleIdKey && w.checkInStart === current.checkInStart && w.templateName === current.templateName));
          });
          const capacityPct = computed(() => {
            const w = props.window;
            if (!w || w.capacity == null || !w.capacity || w.attendanceCount == null) {
              return 0;
            }
            return Math.min(100, Math.round(w.attendanceCount / w.capacity * 100));
          });
          const capacityBarClass = computed(() => {
            if (capacityPct.value >= 100) {
              return "progress-bar-danger";
            }
            if (capacityPct.value >= 80) {
              return "progress-bar-warning";
            }
            return "progress-bar-success";
          });
          function formatTime(iso) {
            if (!iso) {
              return "?";
            }
            return new Date(iso).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit"
            });
          }
          function open(url) {
            if (url) {
              globalThis.location.href = url;
            }
          }
          return (_ctx, _cache) => {
            return openBlock(), createBlock(unref(DockedPanel), {
              modelValue: isVisible.value,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => isVisible.value = $event),
              width: "420px",
              canResize: true,
              closeOnOutsideClick: true
            }, {
              header: withCtx(() => {
                var _props$window$campus;
                return [__props.window ? (openBlock(), createElementBlock("div", _hoisted_1$1, [createElementVNode("div", _hoisted_2$1, [createElementVNode("i", {
                  class: "ti ti-x cursor-pointer",
                  onClick: _cache[0] || (_cache[0] = $event => isVisible.value = false)
                })]), createElementVNode("div", _hoisted_3$1, [createElementVNode("div", _hoisted_4$1, [createElementVNode("div", _hoisted_5$1, toDisplayString(__props.window.groupName), 1), createElementVNode("div", _hoisted_6$1, toDisplayString(__props.window.locationName) + " · " + toDisplayString((_props$window$campus = __props.window.campusName) !== null && _props$window$campus !== void 0 ? _props$window$campus : "Unknown campus"), 1), createElementVNode("div", _hoisted_7$1, [createElementVNode("span", {
                  class: normalizeClass(["label", __props.window.isNextGen ? 'label-success' : 'label-info'])
                }, toDisplayString(__props.window.isNextGen ? "Next-Gen" : "Legacy"), 3), __props.window.isDoubleBooked ? (openBlock(), createElementBlock("span", _hoisted_8$1, "Possible double-booking")) : createCommentVNode("v-if", true)])]), createElementVNode("div", _hoisted_9$1, [__props.window.groupUrl ? (openBlock(), createBlock(unref(RockButton), {
                  key: 0,
                  btnType: unref(BtnType).Default,
                  isSquare: "",
                  title: "Open Group",
                  onClick: _cache[1] || (_cache[1] = $event => open(__props.window.groupUrl))
                }, {
                  default: withCtx(() => [_hoisted_10$1]),
                  _: 1
                }, 8, ["btnType"])) : createCommentVNode("v-if", true), __props.window.locationUrl ? (openBlock(), createBlock(unref(RockButton), {
                  key: 1,
                  btnType: unref(BtnType).Default,
                  isSquare: "",
                  title: "Open Room",
                  onClick: _cache[2] || (_cache[2] = $event => open(__props.window.locationUrl))
                }, {
                  default: withCtx(() => [_hoisted_11$1]),
                  _: 1
                }, 8, ["btnType"])) : createCommentVNode("v-if", true), __props.window.scheduleUrl ? (openBlock(), createBlock(unref(RockButton), {
                  key: 2,
                  btnType: unref(BtnType).Default,
                  isSquare: "",
                  title: "Open Schedule",
                  onClick: _cache[3] || (_cache[3] = $event => open(__props.window.scheduleUrl))
                }, {
                  default: withCtx(() => [_hoisted_12$1]),
                  _: 1
                }, 8, ["btnType"])) : createCommentVNode("v-if", true)])])])) : createCommentVNode("v-if", true)];
              }),
              default: withCtx(() => {
                var _props$window$attend, _props$window$softRo, _props$window$firmRo;
                return [__props.window ? (openBlock(), createElementBlock("div", _hoisted_13$1, [_hoisted_14$1, createElementVNode("div", _hoisted_15$1, [createElementVNode("div", _hoisted_16$1, [_hoisted_17$1, createElementVNode("span", null, toDisplayString(__props.window.scheduleLabel), 1)]), createElementVNode("div", _hoisted_18$1, [_hoisted_19$1, createElementVNode("span", null, toDisplayString(formatTime(__props.window.checkInStart)) + " – " + toDisplayString(formatTime(__props.window.checkInEnd)), 1)]), createElementVNode("div", _hoisted_20$1, [_hoisted_21$1, createElementVNode("span", null, toDisplayString(formatTime(__props.window.start)) + " – " + toDisplayString(formatTime(__props.window.end)), 1)]), createElementVNode("div", _hoisted_22$1, [_hoisted_23$1, createElementVNode("span", null, toDisplayString(__props.window.templateName), 1)]), createElementVNode("div", _hoisted_24, [_hoisted_25, createElementVNode("span", null, toDisplayString(__props.window.areaPath), 1)])]), _hoisted_26, createElementVNode("div", _hoisted_27, [createElementVNode("div", _hoisted_28, [_hoisted_29, createElementVNode("span", null, [createElementVNode("strong", null, toDisplayString((_props$window$attend = __props.window.attendanceCount) !== null && _props$window$attend !== void 0 ? _props$window$attend : "—"), 1), __props.window.capacity != null ? (openBlock(), createElementBlock(Fragment, {
                  key: 0
                }, [createTextVNode(" / " + toDisplayString(__props.window.capacity) + " capacity", 1)], 64)) : createCommentVNode("v-if", true)])]), __props.window.capacity != null && __props.window.attendanceCount != null ? (openBlock(), createElementBlock("div", _hoisted_30, [createElementVNode("div", {
                  class: normalizeClass(["progress-bar", capacityBarClass.value]),
                  style: normalizeStyle({
                    width: capacityPct.value + '%'
                  })
                }, null, 6)])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_31, [_hoisted_32, createElementVNode("span", null, toDisplayString((_props$window$softRo = __props.window.softRoomThreshold) !== null && _props$window$softRo !== void 0 ? _props$window$softRo : "—"), 1)]), createElementVNode("div", _hoisted_33, [_hoisted_34, createElementVNode("span", null, toDisplayString((_props$window$firmRo = __props.window.firmRoomThreshold) !== null && _props$window$firmRo !== void 0 ? _props$window$firmRo : "—"), 1)])]), sameRoomWindows.value.length > 0 ? (openBlock(), createElementBlock(Fragment, {
                  key: 0
                }, [_hoisted_35, createElementVNode("div", _hoisted_36, [(openBlock(true), createElementBlock(Fragment, null, renderList(sameRoomWindows.value, other => {
                  return openBlock(), createElementBlock("div", {
                    key: "".concat(other.groupIdKey, "|").concat(other.scheduleIdKey, "|").concat(other.checkInStart),
                    class: normalizeClass(["cci-detail-row cci-same-room-row", {
                      'cci-conflict-row': other.isDoubleBooked && __props.window.isDoubleBooked
                    }]),
                    onClick: $event => emit('select', other)
                  }, [createElementVNode("span", null, [other.isDoubleBooked && __props.window.isDoubleBooked ? (openBlock(), createElementBlock("i", _hoisted_38)) : createCommentVNode("v-if", true), createTextVNode(" " + toDisplayString(other.groupName), 1)]), createElementVNode("span", _hoisted_39, toDisplayString(formatTime(other.start)) + " – " + toDisplayString(formatTime(other.end)), 1)], 10, _hoisted_37);
                }), 128))])], 64)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true)];
              }),
              _: 1
            }, 8, ["modelValue"]);
          };
        }
      });

      function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === 'undefined') {
          return;
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (insertAt === 'top') {
          if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
          } else {
            head.appendChild(style);
          }
        } else {
          head.appendChild(style);
        }
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }

      var css_248z$1 = ".cci-detail-section[data-v-1a056900]{border:1px solid var(--color-interface-soft,#dfe0e1);border-radius:6px;padding:8px 12px}.cci-detail-row[data-v-1a056900]{display:flex;font-size:13px;gap:12px;justify-content:space-between;padding:3px 0}.cci-capacity-bar[data-v-1a056900]{height:8px;margin:4px 0}.cci-same-room-row[data-v-1a056900]{cursor:pointer}.cci-same-room-row[data-v-1a056900]:hover{background:var(--color-interface-softer,#f5f5f5)}.cci-conflict-row[data-v-1a056900]{font-weight:600}";
      styleInject(css_248z$1);

      script$1.__scopeId = "data-v-1a056900";
      script$1.__file = "src/CheckInInsights/windowDetailPanel.partial.obs";

      const _withScopeId = n => (pushScopeId("data-v-bf105c5a"), n = n(), popScopeId(), n);
      const _hoisted_1 = {
        class: "cci-header-actions"
      };
      const _hoisted_2 = _withScopeId(() => createElementVNode("i", {
        class: "ti ti-calendar-share"
      }, null, -1));
      const _hoisted_3 = [_hoisted_2];
      const _hoisted_4 = _withScopeId(() => createElementVNode("i", {
        class: "ti ti-alert-triangle"
      }, null, -1));
      const _hoisted_5 = [_hoisted_4];
      const _hoisted_6 = ["disabled"];
      const _hoisted_7 = _withScopeId(() => createElementVNode("i", {
        class: "ti ti-adjustments-horizontal"
      }, null, -1));
      const _hoisted_8 = [_hoisted_7];
      const _hoisted_9 = {
        key: 2
      };
      const _hoisted_10 = {
        class: "cci-legend"
      };
      const _hoisted_11 = _withScopeId(() => createElementVNode("span", {
        class: "cci-legend-item"
      }, [createElementVNode("span", {
        class: "cci-swatch cci-swatch-legacy"
      }), createTextVNode(" Legacy check-in")], -1));
      const _hoisted_12 = _withScopeId(() => createElementVNode("span", {
        class: "cci-legend-item"
      }, [createElementVNode("span", {
        class: "cci-swatch cci-swatch-nextgen"
      }), createTextVNode(" Next-Gen check-in")], -1));
      const _hoisted_13 = {
        key: 0,
        class: "cci-legend-item"
      };
      const _hoisted_14 = _withScopeId(() => createElementVNode("span", {
        class: "cci-swatch cci-swatch-double"
      }, null, -1));
      const _hoisted_15 = {
        class: "cci-hours-row"
      };
      const _hoisted_16 = _withScopeId(() => createElementVNode("div", {
        class: "cci-row-label"
      }, null, -1));
      const _hoisted_17 = {
        class: "cci-row-track"
      };
      const _hoisted_18 = {
        class: "cci-area-header"
      };
      const _hoisted_19 = {
        class: "cci-area-header-inner"
      };
      const _hoisted_20 = {
        class: "text-muted cci-area-template"
      };
      const _hoisted_21 = ["title"];
      const _hoisted_22 = ["title", "onClick"];
      const _hoisted_23 = {
        key: 0,
        class: "cci-count-chip"
      };
      const NO_CAMPUS = "No campus";
      var script = exports('default', defineComponent({
        __name: 'scheduleConcurrencyMap',
        setup(__props) {
          var _box$defaultDate;
          const box = useConfigurationValues();
          const invokeBlockAction = useInvokeBlockAction();
          const date = ref((_box$defaultDate = box.defaultDate) !== null && _box$defaultDate !== void 0 ? _box$defaultDate : "");
          const isLoading = ref(false);
          const hasLoaded = ref(false);
          const errorMessage = ref("");
          const result = ref(null);
          const selectedWindow = ref(null);
          const isDetailPanelOpen = ref(false);
          function onSelectWindow(window) {
            selectedWindow.value = window;
            isDetailPanelOpen.value = true;
          }
          const isFilterModalOpen = ref(false);
          const preferences = usePersonPreferences().blockPreferences;
          const filterKeys = ["campus", "template", "area"];
          function loadSavedSelections() {
            const selections = {};
            for (const key of filterKeys) {
              try {
                const parsed = JSON.parse(preferences.getValue("filter-".concat(key)) || "[]");
                selections[key] = Array.isArray(parsed) ? parsed : [];
              } catch (_unused) {
                selections[key] = [];
              }
            }
            return selections;
          }
          const filterSelections = ref(loadSavedSelections());
          watch(filterSelections, async () => {
            for (const key of filterKeys) {
              var _filterSelections$val;
              preferences.setValue("filter-".concat(key), JSON.stringify((_filterSelections$val = filterSelections.value[key]) !== null && _filterSelections$val !== void 0 ? _filterSelections$val : []));
            }
            await preferences.save();
          });
          const allWindows = computed(() => {
            var _result$value$windows, _result$value;
            return (_result$value$windows = (_result$value = result.value) === null || _result$value === void 0 ? void 0 : _result$value.windows) !== null && _result$value$windows !== void 0 ? _result$value$windows : [];
          });
          function distinct(values, fallback) {
            return [...new Set(values.map(v => v !== null && v !== void 0 ? v : fallback))].sort();
          }
          const filterSections = computed(() => [{
            key: "campus",
            label: "Campuses",
            options: distinct(allWindows.value.map(w => w.campusName), NO_CAMPUS)
          }, {
            key: "template",
            label: "Configurations",
            options: distinct(allWindows.value.map(w => w.templateName), "")
          }, {
            key: "area",
            label: "Group Types",
            options: distinct(allWindows.value.map(w => w.areaPath), "")
          }]);
          function passes(selection, value) {
            return selection.length === 0 || selection.includes(value);
          }
          const windows = computed(() => {
            const f = filterSelections.value;
            return allWindows.value.filter(w => {
              var _f$campus, _w$campusName, _f$template, _w$templateName, _f$area, _w$areaPath;
              return passes((_f$campus = f.campus) !== null && _f$campus !== void 0 ? _f$campus : [], (_w$campusName = w.campusName) !== null && _w$campusName !== void 0 ? _w$campusName : NO_CAMPUS) && passes((_f$template = f.template) !== null && _f$template !== void 0 ? _f$template : [], (_w$templateName = w.templateName) !== null && _w$templateName !== void 0 ? _w$templateName : "") && passes((_f$area = f.area) !== null && _f$area !== void 0 ? _f$area : [], (_w$areaPath = w.areaPath) !== null && _w$areaPath !== void 0 ? _w$areaPath : "");
            });
          });
          const hasActiveFilters = computed(() => {
            return Object.values(filterSelections.value).some(s => s.length > 0);
          });
          const isOverlapFlagShown = ref(preferences.getValue("show-overlap-flags") !== "false");
          async function onToggleOverlapFlags() {
            isOverlapFlagShown.value = !isOverlapFlagShown.value;
            preferences.setValue("show-overlap-flags", String(isOverlapFlagShown.value));
            await preferences.save();
          }
          const hasWindows = computed(() => windows.value.length > 0);
          function hourOf(iso) {
            if (!iso) {
              return 0;
            }
            const d = new Date(iso);
            return d.getHours() + d.getMinutes() / 60;
          }
          const timeRange = computed(() => {
            let min = 24;
            let max = 0;
            for (const w of windows.value) {
              min = Math.min(min, hourOf(w.checkInStart));
              max = Math.max(max, hourOf(w.checkInEnd));
            }
            if (min >= max) {
              return {
                min: 6,
                max: 22
              };
            }
            return {
              min: Math.max(0, Math.floor(min) - 1),
              max: Math.min(24, Math.ceil(max) + 1)
            };
          });
          function pct(hour) {
            const _timeRange$value = timeRange.value,
              min = _timeRange$value.min,
              max = _timeRange$value.max;
            return ((hour - min) / (max - min) * 100).toFixed(2) + "%";
          }
          const hourSpan = computed(() => timeRange.value.max - timeRange.value.min);
          const nowLinePct = computed(() => {
            const now = new Date();
            const selected = date.value ? new Date(date.value) : now;
            const isToday = selected.getFullYear() === now.getFullYear() && selected.getMonth() === now.getMonth() && selected.getDate() === now.getDate();
            if (!isToday) {
              return null;
            }
            const hour = now.getHours() + now.getMinutes() / 60;
            if (hour < timeRange.value.min || hour > timeRange.value.max) {
              return null;
            }
            return pct(hour);
          });
          const hourTicks = computed(() => {
            const ticks = [];
            for (let h = timeRange.value.min; h <= timeRange.value.max; h++) {
              const label = h === 0 ? "12a" : h < 12 ? "".concat(h, "a") : h === 12 ? "12p" : "".concat(h - 12, "p");
              ticks.push({
                label,
                left: pct(h)
              });
            }
            return ticks;
          });
          const areaGroups = computed(() => {
            const areas = new Map();
            for (const w of windows.value) {
              var _ref, _w$locationIdKey;
              const areaKey = "".concat(w.templateName, "|").concat(w.areaPath);
              let area = areas.get(areaKey);
              if (!area) {
                var _w$areaPath2, _w$templateName2;
                area = {
                  areaPath: (_w$areaPath2 = w.areaPath) !== null && _w$areaPath2 !== void 0 ? _w$areaPath2 : "",
                  templateName: (_w$templateName2 = w.templateName) !== null && _w$templateName2 !== void 0 ? _w$templateName2 : "",
                  rows: []
                };
                areas.set(areaKey, area);
              }
              const locKey = (_ref = (_w$locationIdKey = w.locationIdKey) !== null && _w$locationIdKey !== void 0 ? _w$locationIdKey : w.locationName) !== null && _ref !== void 0 ? _ref : "?";
              let row = area.rows.find(r => r.key === "".concat(areaKey, "|").concat(locKey));
              if (!row) {
                var _w$locationName;
                row = {
                  key: "".concat(areaKey, "|").concat(locKey),
                  locationName: (_w$locationName = w.locationName) !== null && _w$locationName !== void 0 ? _w$locationName : "Unknown location",
                  laneCount: 1,
                  blocks: []
                };
                area.rows.push(row);
              }
              const startHour = hourOf(w.checkInStart);
              const endHour = Math.max(hourOf(w.checkInEnd), startHour + 0.25);
              let lane = 0;
              const laneEnds = [];
              for (const b of row.blocks) {
                var _laneEnds$b$lane;
                laneEnds[b.lane] = Math.max((_laneEnds$b$lane = laneEnds[b.lane]) !== null && _laneEnds$b$lane !== void 0 ? _laneEnds$b$lane : 0, hourOf(b.window.checkInEnd));
              }
              while (((_laneEnds$lane = laneEnds[lane]) !== null && _laneEnds$lane !== void 0 ? _laneEnds$lane : 0) > startHour) {
                var _laneEnds$lane;
                lane++;
              }
              row.blocks.push({
                key: "".concat(row.key, "|").concat(w.groupIdKey, "|").concat(w.scheduleIdKey, "|").concat(w.checkInStart),
                window: w,
                left: pct(startHour),
                width: ((endHour - startHour) / (timeRange.value.max - timeRange.value.min) * 100).toFixed(2) + "%",
                lane
              });
              row.laneCount = Math.max(row.laneCount, lane + 1);
            }
            return [...areas.values()];
          });
          function formatTime(iso) {
            if (!iso) {
              return "?";
            }
            return new Date(iso).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit"
            });
          }
          function blockTooltip(w) {
            var _w$campusName2;
            const lines = ["".concat(w.groupName, " @ ").concat(w.locationName), "Campus: ".concat((_w$campusName2 = w.campusName) !== null && _w$campusName2 !== void 0 ? _w$campusName2 : "Unknown"), "Schedule: ".concat(w.scheduleLabel), "Check-in: ".concat(formatTime(w.checkInStart), " - ").concat(formatTime(w.checkInEnd)), "Event: ".concat(formatTime(w.start), " - ").concat(formatTime(w.end))];
            if (w.capacity != null) {
              lines.push("Capacity: ".concat(w.capacity));
            }
            if (w.firmRoomThreshold != null) {
              lines.push("Firm threshold: ".concat(w.firmRoomThreshold));
            }
            if (w.isDoubleBooked) {
              lines.push("POSSIBLE DOUBLE-BOOKING: another group in this same check-in configuration has an overlapping event in this room on a different schedule.");
            }
            return lines.join("\n");
          }
          function onNextSunday() {
            const base = date.value ? new Date(date.value) : new Date();
            const target = new Date(base);
            target.setDate(base.getDate() + (7 - base.getDay()) % 7);
            date.value = "".concat(target.getFullYear(), "-").concat(String(target.getMonth() + 1).padStart(2, "0"), "-").concat(String(target.getDate()).padStart(2, "0"));
          }
          async function load() {
            errorMessage.value = "";
            isLoading.value = true;
            try {
              const response = await invokeBlockAction("GetConcurrency", {
                filter: {
                  date: date.value
                }
              });
              if (response.isSuccess && response.data) {
                result.value = response.data;
                hasLoaded.value = true;
              } else {
                var _response$errorMessag;
                errorMessage.value = (_response$errorMessag = response.errorMessage) !== null && _response$errorMessag !== void 0 ? _response$errorMessag : "Unable to load timeline data.";
              }
            } finally {
              isLoading.value = false;
            }
          }
          let refreshTimer = null;
          function isViewingToday() {
            if (!date.value) {
              return true;
            }
            const now = new Date();
            const selected = new Date(date.value);
            return selected.getFullYear() === now.getFullYear() && selected.getMonth() === now.getMonth() && selected.getDate() === now.getDate();
          }
          function setupAutoRefresh() {
            if (refreshTimer !== null) {
              clearInterval(refreshTimer);
              refreshTimer = null;
            }
            if (isViewingToday()) {
              refreshTimer = setInterval(load, 60000);
            }
          }
          onUnmounted(() => {
            if (refreshTimer !== null) {
              clearInterval(refreshTimer);
            }
          });
          watch(date, () => {
            selectedWindow.value = null;
            isDetailPanelOpen.value = false;
            load();
            setupAutoRefresh();
          });
          load();
          setupAutoRefresh();
          return (_ctx, _cache) => {
            return openBlock(), createBlock(unref(Panel), {
              title: "Check-in Timeline",
              type: "block"
            }, {
              headerActions: withCtx(() => [createElementVNode("div", _hoisted_1, [createVNode(unref(DatePicker), {
                modelValue: date.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => date.value = $event)
              }, null, 8, ["modelValue"]), createElementVNode("button", {
                type: "button",
                class: "btn btn-grid-action",
                title: "Jump to next Sunday",
                onClick: onNextSunday
              }, [..._hoisted_3]), createElementVNode("button", {
                type: "button",
                class: normalizeClass(["btn btn-grid-action", {
                  active: isOverlapFlagShown.value
                }]),
                title: "Show possible double-bookings.",
                onClick: onToggleOverlapFlags
              }, [..._hoisted_5], 2), createElementVNode("button", {
                type: "button",
                class: normalizeClass(["btn btn-grid-action", {
                  active: hasActiveFilters.value
                }]),
                title: "Adjust list settings.",
                disabled: isLoading.value,
                onClick: _cache[1] || (_cache[1] = $event => isFilterModalOpen.value = true)
              }, [..._hoisted_8], 10, _hoisted_6)])]),
              default: withCtx(() => [errorMessage.value ? (openBlock(), createBlock(unref(NotificationBox), {
                key: 0,
                alertType: "danger",
                dismissible: true,
                onDismiss: _cache[2] || (_cache[2] = $event => errorMessage.value = '')
              }, {
                default: withCtx(() => [createTextVNode(toDisplayString(errorMessage.value), 1)]),
                _: 1
              })) : createCommentVNode("v-if", true), hasLoaded.value && !hasWindows.value ? (openBlock(), createBlock(unref(NotificationBox), {
                key: 1,
                alertType: "info"
              }, {
                default: withCtx(() => [createTextVNode(" No check-in schedule windows were found for this date and filter. ")]),
                _: 1
              })) : createCommentVNode("v-if", true), createVNode(unref(script$1), {
                modelValue: isDetailPanelOpen.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => isDetailPanelOpen.value = $event),
                window: selectedWindow.value,
                allWindows: allWindows.value,
                onSelect: onSelectWindow
              }, null, 8, ["modelValue", "window", "allWindows"]), hasWindows.value ? (openBlock(), createElementBlock("div", _hoisted_9, [createElementVNode("div", _hoisted_10, [_hoisted_11, _hoisted_12, isOverlapFlagShown.value ? (openBlock(), createElementBlock("span", _hoisted_13, [_hoisted_14, createTextVNode(" Possible double-booking")])) : createCommentVNode("v-if", true)]), createElementVNode("div", {
                class: "cci-timeline",
                style: normalizeStyle({
                  '--cci-hours': hourSpan.value
                })
              }, [createElementVNode("div", _hoisted_15, [_hoisted_16, createElementVNode("div", _hoisted_17, [(openBlock(true), createElementBlock(Fragment, null, renderList(hourTicks.value, hour => {
                return openBlock(), createElementBlock("span", {
                  key: hour.label,
                  class: "cci-hour-tick",
                  style: normalizeStyle({
                    left: hour.left
                  })
                }, toDisplayString(hour.label), 5);
              }), 128))])]), (openBlock(true), createElementBlock(Fragment, null, renderList(areaGroups.value, area => {
                return openBlock(), createElementBlock(Fragment, {
                  key: area.areaPath
                }, [createElementVNode("div", _hoisted_18, [createElementVNode("span", _hoisted_19, [createTextVNode(toDisplayString(area.areaPath) + " ", 1), createElementVNode("span", _hoisted_20, toDisplayString(area.templateName), 1)])]), (openBlock(true), createElementBlock(Fragment, null, renderList(area.rows, row => {
                  return openBlock(), createElementBlock("div", {
                    key: row.key,
                    class: "cci-location-row"
                  }, [createElementVNode("div", {
                    class: "cci-row-label",
                    title: row.locationName
                  }, toDisplayString(row.locationName), 9, _hoisted_21), createElementVNode("div", {
                    class: "cci-row-track",
                    style: normalizeStyle({
                      height: row.laneCount * 30 + 'px'
                    })
                  }, [nowLinePct.value !== null ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: "cci-now-line",
                    style: normalizeStyle({
                      left: nowLinePct.value
                    })
                  }, null, 4)) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(row.blocks, block => {
                    return openBlock(), createElementBlock("div", {
                      key: block.key,
                      class: normalizeClass(["cci-window", {
                        'cci-window-nextgen': block.window.isNextGen,
                        'cci-window-double': isOverlapFlagShown.value && block.window.isDoubleBooked
                      }]),
                      style: normalizeStyle({
                        left: block.left,
                        width: block.width,
                        top: block.lane * 30 + 'px'
                      }),
                      title: blockTooltip(block.window),
                      onClick: $event => onSelectWindow(block.window)
                    }, [createTextVNode(toDisplayString(block.window.groupName) + " ", 1), block.window.attendanceCount != null ? (openBlock(), createElementBlock("span", _hoisted_23, toDisplayString(block.window.attendanceCount), 1)) : createCommentVNode("v-if", true)], 14, _hoisted_22);
                  }), 128))], 4)]);
                }), 128))], 64);
              }), 128))], 4)])) : createCommentVNode("v-if", true), createVNode(unref(script$2), {
                modelValue: isFilterModalOpen.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => isFilterModalOpen.value = $event),
                sections: filterSections.value,
                selections: filterSelections.value,
                "onUpdate:selections": _cache[5] || (_cache[5] = $event => filterSelections.value = $event)
              }, null, 8, ["modelValue", "sections", "selections"])]),
              _: 1
            });
          };
        }
      }));

      var css_248z = ".cci-header-actions[data-v-bf105c5a]{align-items:center;display:flex;gap:4px}.cci-header-actions[data-v-bf105c5a] .form-group{margin-bottom:0}.cci-header-actions[data-v-bf105c5a] .input-group{width:160px}.cci-legend[data-v-bf105c5a]{align-items:center;display:flex;flex-wrap:wrap;gap:16px;margin:8px 0 12px}.cci-legend-item[data-v-bf105c5a]{align-items:center;display:inline-flex;font-size:12px;gap:6px}.cci-swatch[data-v-bf105c5a]{border-radius:3px;display:inline-block;height:14px;width:14px}.cci-swatch-legacy[data-v-bf105c5a]{background:#6b8fc9}.cci-swatch-nextgen[data-v-bf105c5a]{background:#5cb85c}.cci-swatch-double[data-v-bf105c5a]{background:#fff;border:2px solid #d9534f}.cci-timeline[data-v-bf105c5a]{--cci-label-px:180px;--cci-hour-px:48px;border:1px solid var(--color-interface-soft,#dfe0e1);border-radius:4px;overflow-x:auto;-webkit-overflow-scrolling:touch}.cci-hours-row[data-v-bf105c5a],.cci-location-row[data-v-bf105c5a]{border-bottom:1px solid var(--color-interface-soft,#eee);display:flex}.cci-area-header[data-v-bf105c5a],.cci-hours-row[data-v-bf105c5a],.cci-location-row[data-v-bf105c5a]{min-width:calc(var(--cci-label-px) + var(--cci-hours)*var(--cci-hour-px))}.cci-row-label[data-v-bf105c5a]{background:var(--color-interface-softest,#fff);border-right:1px solid var(--color-interface-soft,#eee);flex:0 0 var(--cci-label-px);font-size:12px;left:0;overflow:hidden;padding:4px 8px;position:sticky;text-overflow:ellipsis;white-space:nowrap;z-index:2}.cci-row-track[data-v-bf105c5a]{background-image:repeating-linear-gradient(to right,transparent,transparent calc(100%/var(--cci-hours) - 1px),rgba(0,0,0,.06) calc(100%/var(--cci-hours) - 1px),rgba(0,0,0,.06) calc(100%/var(--cci-hours)));flex:1 1 auto;min-height:30px;position:relative}.cci-hours-row .cci-row-track[data-v-bf105c5a]{background-image:none;height:24px}.cci-hour-tick[data-v-bf105c5a]{color:#888;font-size:11px;position:absolute;top:2px;transform:translateX(-50%)}.cci-area-header[data-v-bf105c5a]{background:var(--color-interface-softer,#f5f5f5);border-bottom:1px solid var(--color-interface-soft,#eee);font-size:13px;font-weight:600;padding:4px 0}.cci-area-header-inner[data-v-bf105c5a]{display:inline-block;left:0;max-width:100vw;padding:0 8px;position:sticky}.cci-area-template[data-v-bf105c5a]{font-size:11px;font-weight:400;margin-left:8px}.cci-window[data-v-bf105c5a]{background:#6b8fc9;border-radius:3px;color:#fff;font-size:11px;height:26px;line-height:20px;margin-top:2px;overflow:hidden;padding:2px 6px;position:absolute;text-overflow:ellipsis;white-space:nowrap}.cci-window-nextgen[data-v-bf105c5a]{background:#5cb85c}.cci-window-double[data-v-bf105c5a]{box-shadow:inset 0 0 0 2px #d9534f}.cci-window[data-v-bf105c5a]{cursor:pointer}.cci-count-chip[data-v-bf105c5a]{background:hsla(0,0%,100%,.3);border-radius:8px;display:inline-block;font-weight:700;margin-left:4px;padding:0 5px}@media (max-width:640px){.cci-timeline[data-v-bf105c5a]{--cci-label-px:90px;--cci-hour-px:40px}.cci-row-label[data-v-bf105c5a]{font-size:11px;padding:4px 6px}.cci-window[data-v-bf105c5a]{font-size:10px;padding:2px 4px}.cci-area-header[data-v-bf105c5a]{font-size:12px}.cci-legend[data-v-bf105c5a]{gap:10px}.cci-header-actions[data-v-bf105c5a]{flex-wrap:wrap;justify-content:flex-end}.cci-header-actions[data-v-bf105c5a] .input-group{width:130px}}.cci-now-line[data-v-bf105c5a]{background:#d9534f;bottom:0;opacity:.6;pointer-events:none;position:absolute;top:0;width:2px;z-index:1}";
      styleInject(css_248z);

      script.__scopeId = "data-v-bf105c5a";
      script.__file = "src/scheduleConcurrencyMap.obs";

    })
  };
}));
//# sourceMappingURL=scheduleConcurrencyMap.obs.js.map
