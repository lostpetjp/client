win.js.load(29)
  .then((constructors) => {
    new constructors[0]({
      P: win,
      element: document.getElementsByClassName("c34g1a")[2],
      items: Array.from(document.getElementsByClassName("c34g1a")).map((el, index) => {
        return {
          index: index,
          element: el,
        };
      }),
    })
  })