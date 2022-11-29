win.popup.create({
  type: "toast",
  text: "トーストのテキスト",
  expires: 2000,
});

win.popup.create({
  target: document.getElementsByTagName("a")[0],
  type: "menu",
  element: {
    attribute: {
      class: "c18",
    },
    children: [
      {
        attribute: {
          class: "c18i",
        },
        children: {
          attribute: {
            class: "a2 c18a hb2",
          },
          children: "メニュー1",
          tagName: "a",
        },
        tagName: "div",
      },
      {
        attribute: {
          class: "c18i",
        },
        children: {
          attribute: {
            class: "a2 c18a hb2 c18as",
          },
          children: "メニュー2",
          tagName: "a",
        },
        tagName: "div",
      },
      {
        attribute: {
          class: "c18i",
        },
        children: {
          attribute: {
            class: "a2 c18a hb2 c18ar",
          },
          children: "メニュー3",
          tagName: "a",
        },
        tagName: "div",
      },
      {
        attribute: {
          class: "c18i",
        },
        children: {
          attribute: {
            class: "a2 c18a hb2 c18ad",
          },
          children: "メニュー4",
          tagName: "a",
        },
        tagName: "div",
      },
    ],
    tagName: "div",
  },
});

win.popup.create({
  target: document.getElementsByTagName("a")[1],
  type: "modal",
  title: "タイトル",
  element: {
    attribute: {
      class: "c17b",
    },
    children: "テキスト",
    tagName: "div",
  },
});
