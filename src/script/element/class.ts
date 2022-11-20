export type AttributeJSON = {
  [key: string]: any
}

export type ElementJSON = {
  attribute?: AttributeJSON | null
  children?: any
  on?: Array<[string, EventListener, EventListenerOptions?]> | {
    [key: string]: [EventListener, EventListenerOptions?]
  }
  // svg?: any
  tagName: string
}

export class Json2Node {
  create(options: any): Node {
    if (undefined === options || null === options) {
      return document.createDocumentFragment();

    } else if (options instanceof Node && -1 !== [1, 3, 8, 11,].indexOf(options.nodeType)) {
      return options;

    } else if ("undefined" !== typeof options.tagName) {
      return this.convertTo(options as ElementJSON);

    } else if (Array.isArray(options) || options instanceof HTMLCollection || options instanceof NodeList) {
      var documentFragment = document.createDocumentFragment();

      for (var i = 0; options.length > i; i++) {
        var entry = options[i];

        if (null !== entry) {
          documentFragment.appendChild(this.create(entry));
        }
      }

      return documentFragment;

    } else {
      return document.createTextNode("string" !== typeof options ? options.toString() : options);

    }
  }

  private convertTo(elementJSON: ElementJSON): Node {
    const tagName = elementJSON.tagName;
    let attribute = elementJSON.attribute;
    const events = elementJSON.on;
    const children = elementJSON.children;

    // elementJSON.svg || 
    const isSvg = -1 !== [
      "circle",
      "path",
      "polygon",
      "rect",
      "svg",
    ].indexOf(tagName);

    const element = (isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName));
    if (!(undefined === children || null === children)) element.appendChild(this.create(children));

    for (let property in attribute) {
      let value = attribute[property];

      if ("class" === property) {
        if ("string" === typeof value) {
          if (isSvg) {
            element.className.baseVal = value;
          } else {
            (element as HTMLElement).className = value;
          }
        }
      } else {
        var hasProperty = false;

        for (let nativeProperty in element) {
          if (nativeProperty === property) {
            hasProperty = true;
            break;
          }
        }

        if (hasProperty) {
          element[property] = value;

        } else if ("string" === typeof value) {
          if (isSvg) {
            element.setAttributeNS(null, property, value);
          } else {
            element.setAttribute(property, value);
          }
        }
      }
    }

    if (events) {
      if (Array.isArray(events)) {
        events.forEach((entry) => {
          element.addEventListener(...entry);
        });
      } else {
        for (let name in events) {
          element.addEventListener(name, ...events[name])
        }
      }
    }

    return element;
  }
}