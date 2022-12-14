import { mergeDeep } from "../../utils/mergeDeep"

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
  create(options: any, ...sources: Array<any>): Node {
    if (sources.length) options = mergeDeep(options, ...sources);

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

        if (hasProperty && !isSvg) {
          element[property] = value;

        } else if ("string" === typeof value) {
          if (isSvg && "viewBox" !== property) {
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

  autolink(str: string): any {
    let check_str = str;
    let offset = 0;
    const entries = [];
    let try_count = 0;
    let matches;

    while (20 > ++try_count) {
      if (!(matches = check_str.match(/((https?):\/\/)([a-z0-9-]+\.)?[a-z0-9-]+(\.[a-z]{2,6}){1,3}(\/[a-z0-9.,_\/~#&=;@%+?-]*)?/is)!)) {
        break;
      }

      const url = matches[0] as string;
      const start = str.indexOf(url, offset);
      const length = url.length;

      offset = start + length;
      entries.push([start, length, str.slice(start, offset),]);

      check_str = str.slice(offset);
    }

    const nodes = [];
    let current = 0;

    entries.forEach((entry) => {
      const [start, length,] = entry as Array<number>;
      const url = str.slice(start as number, start + length);

      if (start > current) {
        nodes.push(str.slice(current, start));
      }

      const info = new URL(url, "https://" + location.hostname);
      const isSamesite = info.hostname.indexOf("lostpet.jp") > -1;
      const suffix = info.pathname + info.search + info.hash;

      nodes.push({
        attribute: {
          ...{
            class: "a1",
            href: url,
          },
          ...(!isSamesite ? {
            target: "_blank",
            rel: "external nofollow noopener",
          } : {})
        },
        children: info.protocol + "//" + info.hostname + (suffix.length > 21 ? suffix.slice(0, 20) + "..." : suffix),
        tagName: "a",
      });

      current = start + length;
    });

    nodes.push(str.slice(current));

    return nodes;
  }
}