System.register(['vue', '@Obsidian/Controls/notificationBox.obs', '@Obsidian/Controls/grid', '@Obsidian/Utility/block', '@Obsidian/Controls/dropDownList.obs', '@Obsidian/Controls/modal.obs'], (function (exports) {
  'use strict';
  var defineComponent, ref, watch, openBlock, createBlock, unref, withCtx, createElementBlock, Fragment, renderList, createVNode, createElementVNode, computed, createTextVNode, toDisplayString, createCommentVNode, normalizeClass, withModifiers, NotificationBox, Grid, Column, pickExistingValueFilter, TextColumn, textValueFilter, useConfigurationValues, useInvokeBlockAction, usePersonPreferences, DropDownList, Modal;
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
      createElementVNode = module.createElementVNode;
      computed = module.computed;
      createTextVNode = module.createTextVNode;
      toDisplayString = module.toDisplayString;
      createCommentVNode = module.createCommentVNode;
      normalizeClass = module.normalizeClass;
      withModifiers = module.withModifiers;
    }, function (module) {
      NotificationBox = module.default;
    }, function (module) {
      Grid = module.default;
      Column = module.Column;
      pickExistingValueFilter = module.pickExistingValueFilter;
      TextColumn = module.TextColumn;
      textValueFilter = module.textValueFilter;
    }, function (module) {
      useConfigurationValues = module.useConfigurationValues;
      useInvokeBlockAction = module.useInvokeBlockAction;
      usePersonPreferences = module.usePersonPreferences;
    }, function (module) {
      DropDownList = module.default;
    }, function (module) {
      Modal = module.default;
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

      var script$1 = defineComponent({
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

      script$1.__file = "src/CheckInInsights/filtersModal.partial.obs";

      const _hoisted_1 = ["href"];
      const _hoisted_2 = createElementVNode("i", {
        class: "ti ti-external-link"
      }, null, -1);
      const _hoisted_3 = {
        key: 1
      };
      const _hoisted_4 = ["href"];
      const _hoisted_5 = createElementVNode("i", {
        class: "ti ti-external-link"
      }, null, -1);
      const _hoisted_6 = {
        key: 1
      };
      const _hoisted_7 = ["href"];
      const _hoisted_8 = createElementVNode("i", {
        class: "ti ti-external-link"
      }, null, -1);
      const _hoisted_9 = {
        key: 1
      };
      const NO_CAMPUS = "No campus";
      var script = exports('default', defineComponent({
        __name: 'checkInConfigLint',
        setup(__props) {
          useConfigurationValues();
          const invokeBlockAction = useInvokeBlockAction();
          const isLoading = ref(false);
          const hasLoaded = ref(false);
          const errorMessage = ref("");
          const issues = ref([]);
          const isFilterModalOpen = ref(false);
          const preferences = usePersonPreferences().blockPreferences;
          const filterKeys = ["campus", "severity", "rule", "area"];
          function loadSavedSelections() {
            const result = {};
            for (const key of filterKeys) {
              try {
                const parsed = JSON.parse(preferences.getValue("filter-".concat(key)) || "[]");
                result[key] = Array.isArray(parsed) ? parsed : [];
              } catch (_unused) {
                result[key] = [];
              }
            }
            return result;
          }
          const filterSelections = ref(loadSavedSelections());
          watch(filterSelections, async () => {
            for (const key of filterKeys) {
              var _filterSelections$val;
              preferences.setValue("filter-".concat(key), JSON.stringify((_filterSelections$val = filterSelections.value[key]) !== null && _filterSelections$val !== void 0 ? _filterSelections$val : []));
            }
            await preferences.save();
          });
          function distinct(values, fallback) {
            return [...new Set(values.map(v => v !== null && v !== void 0 ? v : fallback))].sort();
          }
          const filterSections = computed(() => [{
            key: "campus",
            label: "Campuses",
            options: distinct(issues.value.map(i => i.campusName), NO_CAMPUS)
          }, {
            key: "severity",
            label: "Severities",
            options: ["Error", "Warning", "Info"]
          }, {
            key: "rule",
            label: "Rules",
            options: distinct(issues.value.map(i => i.rule), "")
          }, {
            key: "area",
            label: "Group Types",
            options: distinct(issues.value.map(i => i.areaPath), "")
          }]);
          function passes(selection, value) {
            return selection.length === 0 || selection.includes(value);
          }
          const filteredIssues = computed(() => {
            const f = filterSelections.value;
            return issues.value.filter(i => {
              var _f$campus, _i$campusName, _f$severity, _i$severity, _f$rule, _i$rule, _f$area, _i$areaPath;
              return passes((_f$campus = f.campus) !== null && _f$campus !== void 0 ? _f$campus : [], (_i$campusName = i.campusName) !== null && _i$campusName !== void 0 ? _i$campusName : NO_CAMPUS) && passes((_f$severity = f.severity) !== null && _f$severity !== void 0 ? _f$severity : [], (_i$severity = i.severity) !== null && _i$severity !== void 0 ? _i$severity : "") && passes((_f$rule = f.rule) !== null && _f$rule !== void 0 ? _f$rule : [], (_i$rule = i.rule) !== null && _i$rule !== void 0 ? _i$rule : "") && passes((_f$area = f.area) !== null && _f$area !== void 0 ? _f$area : [], (_i$areaPath = i.areaPath) !== null && _i$areaPath !== void 0 ? _i$areaPath : "");
            });
          });
          const hasActiveFilters = computed(() => {
            return Object.values(filterSelections.value).some(s => s.length > 0);
          });
          const gridDataSource = ref(Promise.resolve({
            rows: []
          }));
          watch(filteredIssues, rows => {
            gridDataSource.value = Promise.resolve({
              rows: rows.map((issue, index) => _objectSpread2({
                key: String(index)
              }, issue))
            });
          });
          function severityLabelClass(severity) {
            if (severity === "Error") {
              return "label-danger";
            }
            if (severity === "Warning") {
              return "label-warning";
            }
            return "label-info";
          }
          function getSeverityFilterValue(row) {
            return row.severity;
          }
          function getTextFilterValue(field) {
            return row => {
              var _ref;
              return (_ref = row[field]) !== null && _ref !== void 0 ? _ref : "";
            };
          }
          async function load() {
            errorMessage.value = "";
            isLoading.value = true;
            try {
              const response = await invokeBlockAction("GetLintIssues", {
                filter: {}
              });
              if (response.isSuccess && response.data) {
                var _response$data$issues;
                issues.value = (_response$data$issues = response.data.issues) !== null && _response$data$issues !== void 0 ? _response$data$issues : [];
                hasLoaded.value = true;
              } else {
                var _response$errorMessag;
                errorMessage.value = (_response$errorMessag = response.errorMessage) !== null && _response$errorMessag !== void 0 ? _response$errorMessag : "Unable to scan check-in configuration.";
              }
            } finally {
              isLoading.value = false;
            }
          }
          load();
          return (_ctx, _cache) => {
            return openBlock(), createElementBlock("div", null, [errorMessage.value ? (openBlock(), createBlock(unref(NotificationBox), {
              key: 0,
              alertType: "danger",
              dismissible: true,
              onDismiss: _cache[0] || (_cache[0] = $event => errorMessage.value = '')
            }, {
              default: withCtx(() => [createTextVNode(toDisplayString(errorMessage.value), 1)]),
              _: 1
            })) : createCommentVNode("v-if", true), hasLoaded.value && issues.value.length === 0 ? (openBlock(), createBlock(unref(NotificationBox), {
              key: 1,
              alertType: "success"
            }, {
              default: withCtx(() => [createTextVNode(" No configuration issues were found. Nice. ")]),
              _: 1
            })) : createCommentVNode("v-if", true), hasLoaded.value && issues.value.length > 0 ? (openBlock(), createBlock(unref(Grid), {
              key: 2,
              data: gridDataSource.value,
              keyField: "key",
              itemTerm: "Issue",
              title: "Status Overview",
              stickyHeader: "",
              liveUpdates: "",
              gridSettings: "",
              gridSettingsActive: hasActiveFilters.value,
              showLaunchWorkflow: false,
              onGridSettingsClick: _cache[4] || (_cache[4] = $event => isFilterModalOpen.value = true)
            }, {
              default: withCtx(() => [createVNode(unref(Column), {
                name: "severity",
                title: "Severity",
                field: "severity",
                filter: unref(pickExistingValueFilter),
                filterValue: getSeverityFilterValue,
                quickFilterValue: getSeverityFilterValue,
                width: "110px",
                visiblePriority: "xs"
              }, {
                format: withCtx(_ref2 => {
                  let row = _ref2.row;
                  return [createElementVNode("span", {
                    class: normalizeClass(["label", severityLabelClass(row.severity)])
                  }, toDisplayString(row.severity), 3)];
                }),
                _: 1
              }, 8, ["filter"]), createVNode(unref(TextColumn), {
                name: "campusName",
                title: "Campus",
                field: "campusName",
                filter: unref(pickExistingValueFilter),
                visiblePriority: "sm"
              }, null, 8, ["filter"]), createVNode(unref(TextColumn), {
                name: "rule",
                title: "Rule",
                field: "rule",
                filter: unref(pickExistingValueFilter),
                visiblePriority: "xs"
              }, null, 8, ["filter"]), createVNode(unref(TextColumn), {
                name: "templateName",
                title: "Configuration",
                field: "templateName",
                filter: unref(pickExistingValueFilter),
                visiblePriority: "md"
              }, null, 8, ["filter"]), createVNode(unref(TextColumn), {
                name: "areaPath",
                title: "Area",
                field: "areaPath",
                filter: unref(textValueFilter),
                visiblePriority: "sm"
              }, null, 8, ["filter"]), createVNode(unref(Column), {
                name: "groupName",
                title: "Group",
                field: "groupName",
                filter: unref(pickExistingValueFilter),
                filterValue: getTextFilterValue('groupName'),
                quickFilterValue: getTextFilterValue('groupName'),
                visiblePriority: "xs"
              }, {
                format: withCtx(_ref3 => {
                  let row = _ref3.row;
                  return [row.groupUrl ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: row.groupUrl,
                    onClick: _cache[1] || (_cache[1] = withModifiers(() => {}, ["stop"]))
                  }, [createTextVNode(toDisplayString(row.groupName) + " ", 1), _hoisted_2], 8, _hoisted_1)) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(row.groupName), 1))];
                }),
                _: 1
              }, 8, ["filter", "filterValue", "quickFilterValue"]), createVNode(unref(Column), {
                name: "locationName",
                title: "Location",
                field: "locationName",
                filter: unref(pickExistingValueFilter),
                filterValue: getTextFilterValue('locationName'),
                quickFilterValue: getTextFilterValue('locationName'),
                visiblePriority: "xs"
              }, {
                format: withCtx(_ref4 => {
                  let row = _ref4.row;
                  return [row.locationUrl ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: row.locationUrl,
                    onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
                  }, [createTextVNode(toDisplayString(row.locationName) + " ", 1), _hoisted_5], 8, _hoisted_4)) : (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(row.locationName), 1))];
                }),
                _: 1
              }, 8, ["filter", "filterValue", "quickFilterValue"]), createVNode(unref(Column), {
                name: "scheduleLabel",
                title: "Schedule",
                field: "scheduleLabel",
                filter: unref(pickExistingValueFilter),
                filterValue: getTextFilterValue('scheduleLabel'),
                quickFilterValue: getTextFilterValue('scheduleLabel'),
                visiblePriority: "md"
              }, {
                format: withCtx(_ref5 => {
                  let row = _ref5.row;
                  return [row.scheduleUrl ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: row.scheduleUrl,
                    onClick: _cache[3] || (_cache[3] = withModifiers(() => {}, ["stop"]))
                  }, [createTextVNode(toDisplayString(row.scheduleLabel) + " ", 1), _hoisted_8], 8, _hoisted_7)) : (openBlock(), createElementBlock("span", _hoisted_9, toDisplayString(row.scheduleLabel), 1))];
                }),
                _: 1
              }, 8, ["filter", "filterValue", "quickFilterValue"]), createVNode(unref(TextColumn), {
                name: "detail",
                title: "Detail",
                field: "detail",
                width: "30%",
                visiblePriority: "lg"
              })]),
              _: 1
            }, 8, ["data", "gridSettingsActive"])) : createCommentVNode("v-if", true), createVNode(unref(script$1), {
              modelValue: isFilterModalOpen.value,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => isFilterModalOpen.value = $event),
              sections: filterSections.value,
              selections: filterSelections.value,
              "onUpdate:selections": _cache[6] || (_cache[6] = $event => filterSelections.value = $event)
            }, null, 8, ["modelValue", "sections", "selections"])]);
          };
        }
      }));

      script.__file = "src/checkInConfigLint.obs";

    })
  };
}));
//# sourceMappingURL=checkInConfigLint.obs.js.map
