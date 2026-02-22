function getXPath( el, customOptions) {
    const options = { ignoreId: true, ...customOptions };
    let nodeElem = el;
    if ( nodeElem && nodeElem.id && ! options.ignoreId ) {
        return "//*[@id=\"" + nodeElem.id + "\"]";
    }
    let parts = [];
    while ( nodeElem && Node.ELEMENT_NODE === nodeElem.nodeType ) {
        let nbOfPreviousSiblings = 0;
        let hasNextSiblings = false;
        let sibling = nodeElem.previousSibling;
        while ( sibling ) {
            if ( sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
                sibling.nodeName === nodeElem.nodeName
            ) {
                nbOfPreviousSiblings++;
            }
            sibling = sibling.previousSibling;
        }
        sibling = nodeElem.nextSibling;
        while ( sibling ) {
            if ( sibling.nodeName === nodeElem.nodeName ) {
                hasNextSiblings = true;
                break;
            }
            sibling = sibling.nextSibling;
        }
        let prefix = nodeElem.prefix ? nodeElem.prefix + ":" : "";
        let nth = nbOfPreviousSiblings || hasNextSiblings
            ? "[" + ( nbOfPreviousSiblings + 1 ) + "]"
            : "";
        parts.push( prefix + nodeElem.localName + nth );
        nodeElem = nodeElem.parentNode;
    }
    return parts.length ? "/" + parts.reverse().join( "/" ) : "";
  }
  
  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  
  
  function isVisible(node) {
    if (node.nodeType == Node.TEXT_NODE) {
      return node.textContent.trim() != "";
    }
    if (node.nodeType == Node.ELEMENT_NODE) {
      invisibleTags = [
        "SCRIPT",
        "NOSCRIPT",
        "STYLE",
        "LINK",
        "META",
        "HEAD",
        "IFRAME",
        "OBJECT",
        "EMBED",
      ];
      if (invisibleTags.includes(node.tagName)) {
        return false;
      }
      let style = window.getComputedStyle(node);
      let bound = node.getBoundingClientRect();
      topElt = document.elementFromPoint(
        bound.x + bound.width / 2,
        bound.y + bound.height / 2
      );
      if (node.tagName?.toLowerCase() == "option") {
        selectEl = node.closest("select")
        if (selectEl && selectEl.hasAttribute('is-active')) {
          return true
        } 
        return false
      }
      if (bound.width == 0 ||
        bound.height == 0 ||
        bound.bottom == 0 ||
        bound.right == 0) {
        childNodes = node.childNodes;
        for (const child of childNodes) {
          if (isVisible(child)) {
            return true
          }
        }
        return false
  
      }
      if (
        style.getPropertyValue("display") == "none" ||
        style.getPropertyValue("visibility") == "hidden" ||
        style.getPropertyValue("opacity") == "0" ||
        node?.disabled ||
        style.getPropertyValue("display").toString().includes("none")
      ) {
        return false;
      }
      if (node.nodeType == Node.TEXT_NODE) {
        return node.textContent.trim() != "";
      } else if (node.nodeType == Node.ELEMENT_NODE) {
        return !!(
          node.offsetWidth ||
          node.offsetHeight ||
          node.getClientRects().length
        );
      } else {
        return false;
      }
    }
  }
  function getPathTo(element) {
    if (element === document.body) return "html/" + element.tagName.toLowerCase();
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i];
      if (sibling === element)
        if (
          ["body", "div", "button", "input", "textarea", "span"].includes(
            element.tagName.toLowerCase()
          )
        )
          return (
            getPathTo(element.parentNode) +
            "/" +
            element.tagName.toLowerCase() +
            "[" +
            (ix + 1) +
            "]"
          );
        else
          return (
            getPathTo(element.parentNode) +
            "/" +
            `*[name()='${element.tagName.toLowerCase()}']` +
            "[" +
            (ix + 1) +
            "]"
          );
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
  }
  function isClickable(node) {
    try {
      if (node.className && typeof node.className.includes !== 'undefined' && node.className.includes("ui-state-disabled"))
        return false;
      return (
        Object.keys(getEventListeners(node))
          .filter((k) => k === "click" || k === "tap").length != 0 ||
        node?.contentEditable == "true" ||
        node?.contentEditable == "plaintext" ||
        (node?.dataset?.link ?? null) !== null || // for dataset
        node.tagName?.toLowerCase() == "input" ||
        node.tagName?.toLowerCase() == "textarea" ||
        node.tagName?.toLowerCase() == "option" ||
        node.tagName?.toLowerCase() == "select" ||
        node.tagName?.toLowerCase() == "a" ||
        node.tagName?.toLowerCase() == "button" ||
        node.tagName?.toLowerCase() == "summary" ||
        (node.hasAttribute('role') && ('button', 'radio', 'option', 'combobox', 'textbox', 'listbox', 'menu').includes(node.getAttribute("role"))) ||
        node.hasAttribute("onclick") || node.hasAttribute("jsaction") ||
        node.hasAttribute("onfocus") ||
        node.hasAttribute("onkeydown") ||
        node.hasAttribute("onkeypress") ||
        node.hasAttribute("onkeyup") ||
        node.hasAttribute("checkbox")
      );
    }
    catch {
      return false
    }
  }
  function getParentInfo(node) {
    child = node.querySelectorAll("*");
    info = {};
    for (let i = 0; i < child.length; i++) {
      if (
        removeUnnecessarySpace(getTextWithoutChildText(child[i])) != "" &&
        isVisible(child[i]) &&
        !isClickable(child[i])
      ) {
        info[child[i].className.replace("-", " ")] = removeUnnecessarySpace(
          getTextWithoutChildText(child[i])
        );
      }
    }
    return info;
  }
  function removeUnnecessarySpace(text) {
      if (typeof text === "undefined") return ""; 
    return text.trim().replace(/\s*\n\s*\n*\s*/g, "\n"); //.replace(/\s*/g, '\s')
  }
  function getIconClass(node) {
    span = [...node.getElementsByTagName("*")].filter(
      (d) => d.tagName.toLowerCase() == "span" && isVisible(d)
    );
    if (span.length == 1) {
      return span[0].className;
    }
    return "";
  }
  function getText(node, removeclickable = false) {
    let text = [];
    if (node.getElementsByTagName("*").length == 0) {
      if (isVisible(node) && !(removeclickable && isClickable(node))) {
        try {
          if (node?.tagName.toLowerCase() == "input") {
            const label = document.querySelector(`label[for="${node.id}"]`);
            if (label) {
              return `${label.innerText}${node.innerText}`;
            }
          }
        }
        catch (e) {
          console.log("HXAgent error", e)
        }
        return node?.innerText
      }
    }
    node.childNodes.forEach(function check(child) {
      if (isVisible(child)) {
        if (!(removeclickable && isClickable(child))) {
          if (child.nodeType == Node.TEXT_NODE) {
            text.push(child.textContent);
          } else text.push(child.innerText);
        } else child.childNodes.forEach(check);
      }
    });
    try {
      const label = document.querySelector(`label[for="${node.id}"]`);
      if (label) {
        return `${label.innerText}${node.innerText}`;
      } 
    } catch (e) {
      console.log("HXAgent error", e)
    }
    return node?.innerText
  }
  function getTextWithoutChildText(node) {
    let text = "";
    for (let child of node.childNodes) {
      if (child.nodeType == Node.TEXT_NODE) {
        text += child.textContent;
      }
    }
    text = text.replace(/\s+/g, " ").trim();
    return text;
  }
  function getInfoNode(node) {
    var parent = node;
    while (true) {
      if (parent.parentElement.tagName.toLowerCase() != "body") {
        if (removeUnnecessarySpace(getText(parent, true)) != "") return parent;
        parent = parent.parentElement;
      } else return node;
    }
  }
  function isContainMultiClickable(node) {
    if (
      [...node.getElementsByTagName("*")].filter(
        (d) => isClickable(d) && isVisible(d)
      ).length > 1
    )
      return true;
    return false;
  }
  function toJSONXPathKey(node) {
    var obj = {};
    obj.tagName = node.tagName.toLowerCase();
    node_text = removeUnnecessarySpace(getText(node));
    gg_attrs = ["style","ping","hveid","ved","jsname","jsaction","rpl","lazy-preview","packaged-media-json","jslog"] // ignore monitoring attributes
  
    //node_text = node_text.includes("\n") ? "" : node_text;
    // Replace all the new line characters with space
    node_text = node_text.replace(/\n/g, " ");
    if (obj.tagName == "option") {
      let select = node.closest("select");
      let labelText = "";
      if (select.id) {
        let label = document.querySelector(`label[for="${select.id}"]`);
        if (label) {
          labelText = label.innerText.trim();
        }
      }
      if (!labelText && select.hasAttribute("aria-label")) {
        labelText = select.getAttribute("aria-label").trim();
      }
      if (!labelText && select.name) {
        labelText = select.name;
      }
  
      // check if inside optgroup
      let group = node.closest("optgroup");
      let groupLabel = group ? group.label.trim() : "";
  
      // option text
      let optionText = node.textContent.trim();
  
      // build full path
      let parts = [labelText, groupLabel, optionText].filter(Boolean);
      let fullPath = parts.join(" / ");
      node_text = fullPath
    }
  
    if (node_text != "") {
      obj.text = node_text;
    }
  
    if (!node.id) {
      node.setAttribute("id", makeid(20));
    }
  
    obj.xpath = getXPath(node);
    if (obj.tagName != "span") {
      spanclass = getIconClass(node);
      if (spanclass != "") obj.icon = spanclass;
    }
    if (!obj.hasOwnProperty("text")) {
      var infoNode = getInfoNode(node);
      if (!infoNode.isSameNode(node)) {
        if (obj.tagName != "span")
          node_text = removeUnnecessarySpace(getText(infoNode));
          node_text = node_text.includes("\n") ? "" : node_text;
        }
    }
    var attrs = null;
    if (node?.ariaLabel) attrs = { 'aria-label': node.ariaLabel, 'placeholder': node.placeholder };
    if (node?.placeholder) {
      if (attrs) {
        attrs['placeholder'] = node.placeholder;
      } else {
        attrs = { 'placeholder': node.placeholder };
      }
    }
    if (Object.entries(node?.dataset).length) {
      if (attrs) {
        Object.entries(node?.dataset).forEach(([key, value]) => {
          if (gg_attrs.includes(key) ) {
            return
          }
          attrs[key] = value;
        });
      } else {
        attrs = { };
        Object.entries(node?.dataset).forEach(([key, value]) => {
          if (gg_attrs.includes(key) ) {
            return
          }
          attrs[key] = value;
        });
        if (Object.keys(attrs).length === 0) {
          attrs = null;
        }
      }
    }
    if (obj.tagName == "a" && node?.href && !node?.href.startsWith("javascript")) {
      if (attrs) {
        attrs['href'] = node.href;
      } else {
        attrs = { 'href': node.href };
      }
    }
    if (node.querySelector("svg")) {
      if (attrs) {
        for (const att of node.attributes) {
          if (gg_attrs.includes(att.name) || att.name.startsWith("data")) {
            continue
          }
          attrs[att.name] = att.value
        }
      } else {
        attrs = {}
        for (const att of node.attributes) {
          if (gg_attrs.includes(att.name) || att.name.startsWith("data")) {
            continue
          } 
          attrs[att.name] = att.value
        }
        if (Object.keys(attrs).length === 0) {
          attrs = null;
        }
      }
      attrs["describe-text"] = "with a svg icon"
    }
    if (node.className && typeof node.className === 'string' && node.className.trim() != "") {
      let style = window.getComputedStyle(node);
      if (style.backgroundImage && style.backgroundImage != 'none') {
        if (attrs) {
          attrs['class'] = node.className;
        } else {
          attrs = { 'class': node.className };
        }
      }
      
    }
    if (attrs) {
      obj['attributes'] = attrs;
    }
  
    if (node.contentEditable == 'true' || node.contentEditable == 'plaintext-only') {
      obj['tagName'] = 'input';
    }
  
    if (obj['tagName'] == 'input' && (node.type == "checkbox" || node.type == "radio")) {
      obj['tagName'] = 'button';
    }
    if (obj['tagName'] == 'input') {
      attrs = node.attributes;
      var length = attrs.length;
      var arr = (obj.attributes = {});
      for (var j = 0; j < length; j++) {
        attr_node = attrs.item(j);
        if (gg_attrs.includes(attr_node.nodeName) || attr_node.nodeName.startsWith("data")) {
          continue
        }
        arr[attr_node.nodeName] = attr_node.nodeValue;
      }
    }
  
    return obj;
  }
  
  function cleanClickable(clickable) {
    var contain = {};
    for (var i = 0; i < clickable.length; i++) {
      contain[i] = [];
      for (var j = i + 1; j < clickable.length; j++) {
        if (clickable[j]["xpath"].includes(clickable[i]["xpath"]))
          contain[i].push(j);
      }
    }
    var dellist = [];
    for (var i = 0; i < clickable.length; i++) {
      if (clickable[i].hasOwnProperty("text")) {
        containallchildtext = -1;
        for (var j = 0; j < contain[i].length; j++) {
          if (clickable['tagName'] == 'input') break;
          if (clickable[contain[i][j]].hasOwnProperty("text")) {
            if (clickable[i]["text"].includes(clickable[contain[i][j]]["text"])) {
              containallchildtext = 1;
              break;
            }
  
            if (clickable[i]["text"] == clickable[contain[i][j]]["text"]) {
              containallchildtext = 1;
              break;
            }
          }
        }
        if (containallchildtext == 1) dellist.push(i);
      }
    }
    var result = [];
    for (let i = 0; i < clickable.length; i++)
      if (!dellist.includes(i)) 
        result.push(clickable[i]);
    return result;
  }
  
  function getJSON() {
    var click = [...document.all].filter((d) => isClickable(d) && isVisible(d));
    // var click = [...document.all].filter((d) => isClickable(d));
    // click.splice(0, 1);
    var clickable = [];
    for (let i = 0; i < click.length; i++) {
      clickable.push(toJSONXPathKey(click[i]));
    }
    let result = cleanClickable(clickable);
    const url = window.location.toString()
    if (url.includes("youtube.com")) {
      const new_result = []
      for (let i = 0; i < result.length; i++) {
        if (result[i]['xpath'].startsWith("/html/body/ytd-app/div[1]"))
          new_result.push(result[i]);
      }
      result = new_result
    }
     
    return result.filter(e => Object.keys(e).length > 2);
  }
  
  getJSON();