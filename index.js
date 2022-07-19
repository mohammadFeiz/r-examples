"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

require("./index.css");

var _aioButton = _interopRequireDefault(require("aio-button"));

var _aioTable = _interopRequireDefault(require("aio-table"));

var _prismjs = _interopRequireDefault(require("prismjs"));

require("prismjs/themes/prism-tomorrow.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class RExamples extends _react.Component {
  constructor(props) {
    super(props);
    let index = localStorage.getItem('aioformtestindex');

    if (index === null) {
      index = false;
    } else {
      index = JSON.parse(index);
    }

    this.state = {
      view: 'preview',
      activeExample: index,
      examples: props.examples
    };
  }

  getExample(index) {
    if (index === false) {
      return null;
    }

    let {
      examples
    } = this.state;

    if (index.length === 1) {
      localStorage.setItem('aioformtestindex', JSON.stringify(index));
      return examples[index[0]];
    }

    let result = examples[index[0]];

    for (let i = 1; i < index.length - 1; i++) {
      result = result.childs[index[i]];
    }

    try {
      result = result.childs[index[index.length - 1]];
      localStorage.setItem('aioformtestindex', JSON.stringify(index));
    } catch {
      result = null;
    }

    return result;
  }

  getComponent(example) {
    if (example === null) {
      return null;
    }

    if (!example.component) {
      localStorage.clear('aioformtestindex');
      return null;
    }

    return example.component();
  }

  getProps() {
    let obj = {};

    for (let prop in this.props) {
      if (prop !== 'examples' && prop !== 'headerHTML') {
        obj[prop] = this.props[prop];
      }
    }

    return obj;
  }

  render() {
    let {
      activeExample,
      examples,
      view
    } = this.state;
    let {
      headerHTML
    } = this.props;
    let example = this.getExample(activeExample);
    let ActiveComponent = this.getComponent(example);
    let Wrapper = ActiveComponent === null ? null : /*#__PURE__*/_react.default.createElement(ActiveComponent, this.getProps());
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "r-examples"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "r-examples-header"
    }, !!headerHTML && headerHTML, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/_react.default.createElement(_aioButton.default, {
      type: "select",
      style: {
        height: 36,
        background: 'dodgerblue',
        color: '#fff',
        borderRadius: 5
      },
      options: [{
        text: 'Preview',
        value: 'preview'
      }, {
        text: 'Code',
        value: 'code'
      }, {
        text: 'Model',
        value: 'model'
      }],
      value: view,
      onChange: value => this.setState({
        view: value
      })
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "r-examples-body"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "r-examples-tree"
    }, /*#__PURE__*/_react.default.createElement(_aioTable.default, {
      model: examples,
      getRowChilds: "childs",
      columns: [{
        title: 'Examples',
        getValue: 'title',
        treeMode: true,
        cellAttrs: row => {
          let {
            activeExample
          } = this.state;

          let a = row._nestedIndex.toString();

          let b = activeExample.toString();
          let active = a === b;
          return {
            style: {
              cursor: 'pointer'
            },
            className: active ? 'active' : '',
            onClick: () => {
              if (row._childsLength > 0) {
                return;
              }

              this.setState({
                activeExample: row._nestedIndex
              });
            }
          };
        }
      }]
    })), view === 'preview' && Wrapper, view === 'code' && /*#__PURE__*/_react.default.createElement(Code, {
      code: example.code,
      language: "javascript"
    }), view === 'model' && /*#__PURE__*/_react.default.createElement(Code, {
      code: typeof example.model === 'string' ? example.model : JSON.stringify(example.model),
      language: "javascript"
    })));
  }

}

exports.default = RExamples;

function Code({
  code,
  language
}) {
  (0, _react.useEffect)(() => {
    _prismjs.default.highlightAll();
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "Code",
    style: {
      overflowY: 'auto',
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement("pre", null, /*#__PURE__*/_react.default.createElement("code", {
    className: `language-${language}`
  }, code)));
}