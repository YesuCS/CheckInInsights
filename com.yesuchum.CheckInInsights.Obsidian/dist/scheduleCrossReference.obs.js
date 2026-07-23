System.register(['vue', '@Obsidian/Controls/notificationBox.obs', '@Obsidian/Controls/grid', '@Obsidian/Utility/block', '@Obsidian/Controls/dropDownList.obs', '@Obsidian/Controls/modal.obs'], (function (exports) {
  'use strict';
  var defineComponent, ref, watch, openBlock, createBlock, unref, withCtx, createElementBlock, Fragment, renderList, createVNode, createElementVNode, computed, createTextVNode, toDisplayString, createCommentVNode, withModifiers, NotificationBox, Grid, TextColumn, pickExistingValueFilter, Column, useConfigurationValues, useInvokeBlockAction, usePersonPreferences, DropDownList, Modal;
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
      withModifiers = module.withModifiers;
    }, function (module) {
      NotificationBox = module.default;
    }, function (module) {
      Grid = module.default;
      TextColumn = module.TextColumn;
      pickExistingValueFilter = module.pickExistingValueFilter;
      Column = module.Column;
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
      const _hoisted_7 = {
        key: 2,
        class: "label label-danger"
      };
      const _hoisted_8 = ["href"];
      const _hoisted_9 = createElementVNode("i", {
        class: "ti ti-external-link"
      }, null, -1);
      const _hoisted_10 = {
        key: 1
      };
      const _hoisted_11 = {
        key: 2,
        class: "label label-warning"
      };
      const _hoisted_12 = {
        key: 0,
        title: "Capacity set on this group + room + schedule pairing."
      };
      const _hoisted_13 = {
        key: 1,
        class: "text-muted",
        title: "No capacity on this pairing; showing the room's own threshold."
      };
      const NO_CAMPUS = "No campus";
      const NO_LOCATION = "No location";
      const NO_SCHEDULE = "No schedule";
      var script = exports('default', defineComponent({
        __name: 'scheduleCrossReference',
        setup(__props) {
          useConfigurationValues();
          const invokeBlockAction = useInvokeBlockAction();
          const isLoading = ref(false);
          const hasLoaded = ref(false);
          const errorMessage = ref("");
          const assignments = ref([]);
          const isFilterModalOpen = ref(false);
          const preferences = usePersonPreferences().blockPreferences;
          const filterKeys = ["campus", "schedule", "location", "area"];
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
            options: distinct(assignments.value.map(a => a.campusName), NO_CAMPUS)
          }, {
            key: "schedule",
            label: "Schedules",
            options: distinct(assignments.value.map(a => a.scheduleLabel), NO_SCHEDULE)
          }, {
            key: "location",
            label: "Locations",
            options: distinct(assignments.value.map(a => a.locationName), NO_LOCATION)
          }, {
            key: "area",
            label: "Group Types",
            options: distinct(assignments.value.map(a => a.areaPath), "")
          }]);
          function passes(selection, value) {
            return selection.length === 0 || selection.includes(value);
          }
          const filteredAssignments = computed(() => {
            const f = filterSelections.value;
            return assignments.value.filter(a => {
              var _f$campus, _a$campusName, _f$schedule, _a$scheduleLabel, _f$location, _a$locationName, _f$area, _a$areaPath;
              return passes((_f$campus = f.campus) !== null && _f$campus !== void 0 ? _f$campus : [], (_a$campusName = a.campusName) !== null && _a$campusName !== void 0 ? _a$campusName : NO_CAMPUS) && passes((_f$schedule = f.schedule) !== null && _f$schedule !== void 0 ? _f$schedule : [], (_a$scheduleLabel = a.scheduleLabel) !== null && _a$scheduleLabel !== void 0 ? _a$scheduleLabel : NO_SCHEDULE) && passes((_f$location = f.location) !== null && _f$location !== void 0 ? _f$location : [], (_a$locationName = a.locationName) !== null && _a$locationName !== void 0 ? _a$locationName : NO_LOCATION) && passes((_f$area = f.area) !== null && _f$area !== void 0 ? _f$area : [], (_a$areaPath = a.areaPath) !== null && _a$areaPath !== void 0 ? _a$areaPath : "");
            });
          });
          const hasActiveFilters = computed(() => {
            return Object.values(filterSelections.value).some(s => s.length > 0);
          });
          const gridDataSource = ref(Promise.resolve({
            rows: []
          }));
          watch(filteredAssignments, rows => {
            gridDataSource.value = Promise.resolve({
              rows: rows.map((assignment, index) => _objectSpread2({
                key: String(index)
              }, assignment))
            });
          });
          function getGroupFilterValue(row) {
            var _ref;
            return (_ref = row.groupName) !== null && _ref !== void 0 ? _ref : "";
          }
          function getLocationFilterValue(row) {
            var _ref2;
            return (_ref2 = row.locationName) !== null && _ref2 !== void 0 ? _ref2 : NO_LOCATION;
          }
          function getScheduleFilterValue(row) {
            var _ref3;
            return (_ref3 = row.scheduleLabel) !== null && _ref3 !== void 0 ? _ref3 : NO_SCHEDULE;
          }
          async function load() {
            errorMessage.value = "";
            isLoading.value = true;
            try {
              const response = await invokeBlockAction("GetAssignments", {
                filter: {}
              });
              if (response.isSuccess && response.data) {
                var _response$data$assign;
                assignments.value = (_response$data$assign = response.data.assignments) !== null && _response$data$assign !== void 0 ? _response$data$assign : [];
                hasLoaded.value = true;
              } else {
                var _response$errorMessag;
                errorMessage.value = (_response$errorMessag = response.errorMessage) !== null && _response$errorMessag !== void 0 ? _response$errorMessag : "Unable to load assignments.";
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
            })) : createCommentVNode("v-if", true), hasLoaded.value && assignments.value.length === 0 ? (openBlock(), createBlock(unref(NotificationBox), {
              key: 1,
              alertType: "info"
            }, {
              default: withCtx(() => [createTextVNode(" No check-in group / location / schedule assignments were found. ")]),
              _: 1
            })) : createCommentVNode("v-if", true), hasLoaded.value && assignments.value.length > 0 ? (openBlock(), createBlock(unref(Grid), {
              key: 2,
              data: gridDataSource.value,
              keyField: "key",
              itemTerm: "Pairing",
              title: "Rooms & Schedules",
              stickyHeader: "",
              liveUpdates: "",
              gridSettings: "",
              gridSettingsActive: hasActiveFilters.value,
              showLaunchWorkflow: false,
              onGridSettingsClick: _cache[4] || (_cache[4] = $event => isFilterModalOpen.value = true)
            }, {
              default: withCtx(() => [createVNode(unref(TextColumn), {
                name: "campusName",
                title: "Campus",
                field: "campusName",
                filter: unref(pickExistingValueFilter),
                visiblePriority: "sm"
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
                filter: unref(pickExistingValueFilter),
                visiblePriority: "sm"
              }, null, 8, ["filter"]), createVNode(unref(Column), {
                name: "groupName",
                title: "Group",
                field: "groupName",
                filter: unref(pickExistingValueFilter),
                filterValue: getGroupFilterValue,
                quickFilterValue: getGroupFilterValue,
                visiblePriority: "xs"
              }, {
                format: withCtx(_ref4 => {
                  let row = _ref4.row;
                  return [row.groupUrl ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: row.groupUrl,
                    onClick: _cache[1] || (_cache[1] = withModifiers(() => {}, ["stop"]))
                  }, [createTextVNode(toDisplayString(row.groupName) + " ", 1), _hoisted_2], 8, _hoisted_1)) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(row.groupName), 1))];
                }),
                _: 1
              }, 8, ["filter"]), createVNode(unref(Column), {
                name: "locationName",
                title: "Location",
                field: "locationName",
                filter: unref(pickExistingValueFilter),
                filterValue: getLocationFilterValue,
                quickFilterValue: getLocationFilterValue,
                visiblePriority: "xs"
              }, {
                format: withCtx(_ref5 => {
                  let row = _ref5.row;
                  return [row.locationName && row.locationUrl ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: row.locationUrl,
                    onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
                  }, [createTextVNode(toDisplayString(row.locationName) + " ", 1), _hoisted_5], 8, _hoisted_4)) : row.locationName ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(row.locationName), 1)) : (openBlock(), createElementBlock("span", _hoisted_7, "No location"))];
                }),
                _: 1
              }, 8, ["filter"]), createVNode(unref(Column), {
                name: "scheduleLabel",
                title: "Schedule",
                field: "scheduleLabel",
                filter: unref(pickExistingValueFilter),
                filterValue: getScheduleFilterValue,
                quickFilterValue: getScheduleFilterValue,
                visiblePriority: "xs"
              }, {
                format: withCtx(_ref6 => {
                  let row = _ref6.row;
                  return [row.scheduleLabel && row.scheduleUrl ? (openBlock(), createElementBlock("a", {
                    key: 0,
                    href: row.scheduleUrl,
                    onClick: _cache[3] || (_cache[3] = withModifiers(() => {}, ["stop"]))
                  }, [createTextVNode(toDisplayString(row.scheduleLabel) + " ", 1), _hoisted_9], 8, _hoisted_8)) : row.scheduleLabel ? (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(row.scheduleLabel), 1)) : (openBlock(), createElementBlock("span", _hoisted_11, "No schedule"))];
                }),
                _: 1
              }, 8, ["filter"]), createVNode(unref(Column), {
                name: "capacity",
                title: "Capacity",
                field: "capacity",
                width: "130px",
                visiblePriority: "md"
              }, {
                format: withCtx(_ref7 => {
                  let row = _ref7.row;
                  return [row.capacity != null ? (openBlock(), createElementBlock("span", _hoisted_12, toDisplayString(row.capacity), 1)) : row.roomCapacity != null ? (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(row.roomCapacity) + " (room)", 1)) : createCommentVNode("v-if", true)];
                }),
                _: 1
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

      script.__file = "src/scheduleCrossReference.obs";

    })
  };
}));
//# sourceMappingURL=scheduleCrossReference.obs.js.map
