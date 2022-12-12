type Options = {
  arrowKeys: boolean
  clickToCloseNonZoomable: boolean,
  closeOnVerticalDrag: boolean,
  escKey: boolean,
  loop: boolean,
  showHideAnimationType: "none"
  pswpModule: PhotoSwipe
  returnFocus: boolean
}

export class PhotoSwipeLightbox {
  constructor(options: Options) { }

  init() { }

  on(name: string, callback: (event: { [key: string]: any }) => void) { }

  loadAndOpen(index: number) { }

  destroy() { }

  pswp: boolean = false
}

export class PhotoSwipe {
  constructor(options: Options) { }
}

export class PhotoSwipeVideo {
  constructor(photoSwipe: PhotoSwipe, options: {}) { }
}