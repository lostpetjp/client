import { Component, InitOptions } from "../.."
import { StyleIdList } from "../../../script/css";
import { PhotoSwipe, PhotoSwipeLightbox, PhotoSwipeVideo } from "./types";

type MediaViewerItem = {
  element: HTMLElement
  index: number
}
export type MediaViewerItemList = Array<MediaViewerItem>

type Options = InitOptions & {
  element: HTMLElement
  items: MediaViewerItemList
}

export class MediaViewer extends Component {
  items: MediaViewerItemList
  index: number = -1
  destroyed: boolean = false
  photoSwipe: null | PhotoSwipeLightbox = null

  constructor(options: Options) {
    super({
      P: options.P,
    });

    const items = this.items = options.items;

    for (let i = 0; items.length > i; i++) {
      const entry = items[i];
      const itemE = entry.element;

      if (itemE === options.element) {
        this.index = entry.index;
      }
    }

    if (this.index > -1) {
      const win = this.window!;

      Promise.all([
        win.css.load(35),
        win.js.load([26, 27, 28,]),
      ])
        .then(([styleIdList, constructors,]: [
          StyleIdList,
          [
            typeof PhotoSwipe,  // 26
            typeof PhotoSwipeVideo, // 27
            typeof PhotoSwipeLightbox,  // 28
          ]
        ]) => {
          if (this.S) {
            const win = this.window!;

            win.css.attach(this, styleIdList, {
              build: true,
            });

            const photoSwipe = this.photoSwipe = new constructors[2]({
              arrowKeys: true,
              clickToCloseNonZoomable: true,
              closeOnVerticalDrag: true,
              escKey: true,
              loop: true,
              showHideAnimationType: 'none',
              pswpModule: constructors[0],
              returnFocus: false,
            });

            new constructors[1](photoSwipe, {});

            photoSwipe.init();

            photoSwipe.on("numItems", (event) => event.numItems = this.items.length);

            photoSwipe.on("itemData", (event) => {
              const entry = this.items[event.index];

              const itemE = entry.element;

              const imgE = ("IMG" === itemE.tagName ? itemE : itemE.getElementsByTagName("img")[0]) as HTMLImageElement;

              if (imgE) {
                const msrc = imgE.currentSrc;
                let otherSrc = imgE.dataset["original"];

                const matches = (otherSrc ? otherSrc : msrc).match(/(m([0-9]+)s([0-9]+)x([0-9]+)z)(\-[a-z0-9]+)?(\.(jpg|png))(\.[a-z]+)?$/)!;
                const height = parseInt(matches[4], 10);
                const width = parseInt(matches[3], 10);
                const size = this.window![height > width ? "innerHeight" : "innerWidth"];

                event.itemData = {
                  msrc: "/placeholder.svg",
                  src: "/media/" + matches[1] + (size > 1800 ? "" : ("-" + (height > width ? "h" : "w") + (size > 1500 ? "1500" : (size > 1200 ? "1200" : (size > 900 ? "900" : "600"))))) + "." + ("png" === matches[7] ? "png" : "jpg") + (-1 !== msrc.indexOf(".avif") ? ".avif" : (-1 !== msrc.indexOf(".webp") ? ".webp" : "")),
                  h: height,
                  w: width,
                };
              } else {
                const videoE = ("VIDEO" === itemE.tagName ? itemE : itemE.getElementsByTagName("video")[0]) as HTMLVideoElement;

                if (videoE) {
                  const msrc = videoE.poster;
                  const matches = msrc.match(/(m([0-9]+)s([0-9]+)x([0-9]+)z)(\-[a-z0-9]+)?(\.(jpg))(\.[a-z]+)?$/)!;

                  for (var a = videoE.childNodes, i = 0, children = []; a.length > i; i++) {
                    var sourceE = a[i] as HTMLSourceElement;

                    children.push({
                      src: sourceE.src,
                      type: sourceE.type,
                    });
                  }

                  event.itemData = {
                    src: "/media/" + matches[1] + ".jpg",
                    type: "video",
                    videoSources: children,
                    height: parseInt(matches[4], 10),
                    width: parseInt(matches[3], 10),
                  };
                }
              }
            });

            photoSwipe.on("thumbBounds", (event) => {
              const entry = this.items[event.index];
              const targetE = entry.element;

              let itemE = "IMG" === targetE.tagName ? targetE : targetE.getElementsByTagName("img")[0];

              if (!itemE) itemE = ("VIDEO" === targetE.tagName ? targetE : targetE.getElementsByTagName("video")[0]) as HTMLVideoElement;

              var rect = itemE.getBoundingClientRect();

              event.thumbBounds = {
                h: rect.height,
                w: rect.width,
                x: rect.left,
                y: rect.top,
              };
            });

            photoSwipe.on("destroy", () => {
              this.destroyed = true;
              this.destroy!();
            });

            this.on!(this, "destroy", () => {
              if (!this.destroyed) {
                this.photoSwipe!.destroy();
              }

              this.window!.css.update();
            });

            photoSwipe.loadAndOpen(this.index);
          }
        })
        .catch((err) => {
          if (this.S) {
            console.error(err);
            this.window!.throw();
          }
        });

    } else {
      this.destroy!();
    }
  }
}