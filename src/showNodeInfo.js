"use strict";

const PANEL_NAME = "AMP Context Inspector";

// See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/devtools.panels/ExtensionSidebarPane
const panels = chrome.devtools.panels;

panels.elements.createSidebarPane(PANEL_NAME, function (sidebar) {
  function updateContent() {
    sidebar.setExpression("(" + getPanelContents.toString() + ")()");
  }

  updateContent();
  panels.elements.onSelectionChanged.addListener(updateContent);
});

function getPanelContents() {
  function debugId(node) {
    if (!node) {
      return null;
    }
    return (
      node.nodeName.toLowerCase() +
      (node.id
        ? `#${node.id}`
        : node.name
        ? `[name=${node.name}]`
        : node.getAttribute && node.getAttribute("name")
        ? `[name=${node.getAttribute("name")}]`
        : "")
    );
  }

  function getNode(cn) {
    return (cn && cn.node) || null;
  }

  function cnArrayToNodes(cnArray) {
    return (cnArray && cnArray.map(getNode)) || [];
  }

  function mapMap(map, callback) {
    const res = Object.create(null);
    map.forEach((v, k) => {
      res[k] = callback(v, k);
    });
    return res;
  }

  function getInputValues(cn) {
    if (!cn.values || !cn.values.inputsByKey_) {
      return [];
    }
    return mapMap(cn.values.inputsByKey_, (v) =>
      v.values.length == 1 ? v.values[0] : v.values
    );
  }

  function getUsedValues(cn) {
    if (!cn.values || !cn.values.usedByKey_) {
      return [];
    }
    return mapMap(cn.values.usedByKey_, (v) => v.value);
  }

  const node = $0.nodeType == 10 ? $0.ownerDocument : $0;
  const cn = node.__AMP_NODE;

  const res = Object.create(null);
  res.id = debugId(node);

  if (!cn) {
    res["_"] = "no context node";
    const doc = node.ownerDocument || node;
    if (doc.__AMP_NODE && doc.__AMP_NODE.constructor.closest) {
      res.closest = getNode(doc.__AMP_NODE.constructor.closest(node));
    }
    return res;
  }

  res.debug = cn;
  res.parent = getNode(cn.parent);
  res.parentId = debugId(res.parent);
  res.root = getNode(cn.root);
  res.children = cnArrayToNodes(cn.children).filter((n) => n !== node);

  res.group = (cn.parent && cn.parent.name) || null;
  res.groups =
    (cn.pseudos_ &&
      mapMap(cn.pseudos_, (v) => {
        const res = Object.create(null);
        res.children = cnArrayToNodes(v.cn.children);
        res.inputValues = getInputValues(v.cn);
        res.usedValues = getUsedValues(v.cn);
        return res;
      })) ||
    [];

  res.inputValues = getInputValues(cn);
  res.usedValues = getUsedValues(cn);

  res.components = Array.from(
    (cn.components_ && cn.components_.values()) || []
  ).map((c) => c.id);

  return res;
}
