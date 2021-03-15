
import { Component, createElement } from './framework';

class Carousel extends Component {
  constructor() {
    super()
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let record of this.attributes.src) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(child);
    }

    let isMove = false;
    let position = 0;

    this.root.addEventListener("mousedown", event => {
      let children = this.root.children;
      let startX = event.clientX;

      const move = e => {
        isMove = true;
        let x = e.clientX - startX;

        // 循环逻辑
        // 当前在屏幕上的元素的位置
        let current = position - ((x - x%500) / 500);

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          let child = children[pos];
          child.style.transition = "none";
          child.style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
        }
      }

      const up = e => {
        let x = e.clientX - startX;
        position -= Math.round(x / 500);

        for (let offset of [0, Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          let child = children[pos];
          child.style.transition = "";
          child.style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        }
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      }

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);

    })


    this.root.addEventListener("click", event => {
      if (isMove) {
        isMove = false;
        return;
      }
      console.log("click", event);
      
    })

    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   // ++current;
    //   // tips 1~n之前循环
    //   let nextIndex = (currentIndex + 1) % children.length;
    //   let current = children[currentIndex];
    //   let next = children[nextIndex];

    //   next.style.transform = "none";
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
      

    //   setTimeout(() => {
    //     next.style.transform = "";
    //     current.style.transform = `translateX(${-100 - nextIndex * 100}%)`;
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`;

    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 3000);
    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let source = [
  "./static/cat1.jpg",
  "./static/cat2.jpg",
  "./static/cat3.jpg",
  "./static/cat4.jpg",
]


const a = <Carousel src={source} />;

a.mountTo(document.body);