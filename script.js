'use strict';
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContenet = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(nodeItem => {
  nodeItem.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (k) {
  if (k.key === 'Escape' && !modal.classList.contains('hidden')) {
    console.log('workign');
    closeModal();
  }
});

// btn scrolling/////////////////////////////////////////////////////////////////

btnScrollTo.addEventListener('click', function (e) {
  const scroll1coordinates = section1.getBoundingClientRect();
  console.log(scroll1coordinates);

  // console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x,y):', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height / Width viewport ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //scrolling
  // window.scrollTo(
  //   scroll1coordinates.left + window.pageXOffSet,
  //   scroll1coordinates.top + window.pageYOffset // window pageYOffSet means length of how much part is scrolled
  //   );
  //applying smooth scroll effect  (old way)
  // window.scrollTo({
  //   left: scroll1coordinates.left + window.pageXOffset,
  //   top: scroll1coordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  //(new way)
  section1.scrollIntoView({ behavior: 'smooth' });
});
//Navigation btns////////////////////////////////////////////////////////////////

// document.querySelectorAll('.nav__link').forEach((btn, index) =>
//   btn.addEventListener('click', function (e) {
//     e.preventDefault();

//     const secId = this.getAttribute('href');
//     console.log(secId);
//     document.querySelector(secId).scrollIntoView({
//       behavior: 'smooth',
//     });
//   })
// );

// Event Delegation Implementing Page Navigation

// 1. add event listener to common parent element
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    //Matching Strategy
    if (event.target.classList.contains('nav__link')) {
      const secId = event.target.getAttribute('href');
      document.querySelector(secId).scrollIntoView({ behavior: 'smooth' });
    }
  });

// features.addEventListener('click', function (e) {
//   e.preventDefault();
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// <TABBED COMPONENT>

// Event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if (!clicked) return;
  //active tab logic remove the active clase every time clicked then add them
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  // remove the active classes //same as above tab logic
  tabsContenet.forEach(para => {
    para.classList.remove('operations__content--active');
  });
  //add active class

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

  //adding content area
});

//Menu Fade Animation////////////////////////////////////////////////////////////
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    // console.log(hovered);
    const siblings = hovered
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    // console.log(siblings);
    const logo = hovered.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      // console.log('wrking');
      if (el !== hovered) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// again event delegation
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation bar///////////////////////////////////////////////////////

// unefficient way effects performance
// const sec1Position = section1.getBoundingClientRect();
// console.log(`sec1Position`);
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY >= sec1Position.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//stucky navigation using IntersectionObserverS() API
const navHeight = nav.getBoundingClientRect().height;

const absCallback = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting === false) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null, //view port
  thrushold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(absCallback, obsOptions);
headerObserver.observe(header);

// Reavel sections////////////////////////////////////////////////////////////////////

const allSections = document.querySelectorAll('.section');
const revealSections = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// 018 Lazy Loading Images ///////////////////////////////////////////////////////////

const imagTargets = document.querySelectorAll('img[data-src]');

const showImages = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(showImages, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});
imagTargets.forEach(img => imageObserver.observe(img));

//slider///////////////////////////////////////////////////////////////////
const slider = function () {
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length - 1;
  const dotContainer = document.querySelector('.dots');

  // setting active dot at page load

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (currentSLide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${currentSLide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSLide = function (currentS) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${(i - currentS) * 100}%)`)
    );
  };
  let currentSLide = 0;
  const nextSlide = function () {
    if (currentSLide === maxSlide) {
      currentSLide = 0;
    } else currentSLide++;

    goToSLide(currentSLide);
    activateDot(currentSLide);
  };
  const previousSlide = function () {
    if (currentSLide > 0) {
      currentSLide--;
    } else currentSLide = maxSlide;
    goToSLide(currentSLide);
    activateDot(currentSLide);
  };
  const init = function () {
    goToSLide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();

    if (e.key === 'ArrowLeft') previousSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    // console.log(e.target);
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSLide(slide);
      activateDot(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 005 Selecting Creating and Deleting Elements********************

// //selecting elements
// console.log(document);
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(allSections);
document.getElementById('sectio--1');
const allBtns = document.getElementsByTagName('button'); //live list
// console.log(allBtns);

const btn = document.getElementsByClassName('btn'); //live list
// console.log(btn);

//insertAdjacentHtml()
// header.insertAdjacentHTML(
//   'afterbegin',
//   `<div class= "cookie-message">'we use cookies for adding functionalities and analytics. <button class="btn btn--close-cookie">Got it </button>'</div>`
// );

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'we use cookies for adder functionalities.';
message.innerHTML =
  'we use cookies 🍪 for adding functionalities and analytics. <button class="btn btn--close-cookie">Got it </button>';
// console.log(message);

// header.prepend(message);
// header.append(message.cloneNode(true));
// console.log(message.cloneNode(true));
header.append(message);
// header.before(message); //before the element starts
// header.after(message); //after the elements start

// how to delete emlemets
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.parentElement.removeChild(message); // before
    message.remove(); //recent feature
  });

// 006 Styles Attributes and Classes***********
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// //you can only view the styles that you set manualy by dom or in the real html(inline)   ⚠️not that are storeds css class
// console.log(message.style.width);
// console.log(message.style.backgroundColor);
// console.log(message.style.color); //not found    //❌

// //but if still want to acess all styles use
// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color); // ✅
// console.log(getComputedStyle(message).height); // ✅

message.style.height = parseFloat(getComputedStyle(message).height) + 40 + 'px';
// console.log(parseInt(msgHeight) + parseInt('40px'));

//how tot use css variables to set property
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes
// // getting
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className); //we dont call it class due to historical reasons

// console.log(logo.attributes.nam);
// console.log(logo.getAttribute('nam'));

// // setting
// logo.className = 'Bhandari';
// console.log(logo.className);
// logo.alt = 'beautiful javaScript Website';
// console.log(logo.alt);
// logo.setAttribute('nam', 'chubhi');
// console.log(logo.getAttribute('nam'));
// logo.setAttribute('company', 'bankist');
// console.log(logo.getAttribute('company'));
// console.log(logo.src); //absolute url
// console.log(logo.getAttribute('src')); //relative url as per storgae

// // link
// const titterLink = document.querySelector('.nav__link--btn');
// console.log(titterLink.href);
// console.log(titterLink.getAttribute('href'));

// //Data attirbutes   //dataset is used for storing data in user interface
// const dataa = document.querySelector('.nav__link--btn');
// console.log(dataa.dataset.fromServer);

// // classes
// logo.classList.add('c', 'j'); //you can also add and remove multiple classes
// logo.classList.remove('c', 'j'); //you can also add and remove multiple classes
// logo.classList.toggle('c');
// logo.classList.contains('c');

//donst use   //overwrite everything
// logo.className = 'abhi';

// 007 Implementing Smooth Scrolling*******************

// 008 Types of Events and Event Handlers************

// const h1 = document.querySelector('h1');

// const alertH1 = function () {
//   alert('eventlistner your reading heading');
//remove Event handler
// h1.removeEventListener('mouseenter', alertH1);  // event runs once
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
//   console.log('EventListener Removed');
// }, 4000);

//amother way of attaching an event listener to an element********
//old scool
// h1.onmouseenter = function () {
//   alert('eventlistner your reaing heading');
// };

// 009 Event Propagation Bubbling and Capturing*****************
// 010 Event Propagation in Practice****************

// //rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
//   // //Stop Propogatin
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
//   console.log('container', e.target, e.currentTarget);
// });
// document.querySelector('nav').addEventListener(
//   'click',
//   function (e) {
//     e.preventDefault();
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   false
// );

// 011 Event Delegation Implementing Page Navigation

// 012 DOM Traversing******************************************

// const h1 = document.querySelector('h1');

// // Going DownWords  // Child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log((h1.firstElementChild.textContent = 'abdi'));
// console.log((h1.lastElementChild.textContent = 'sanchu'));

// // Going DownWords  // parents

// console.log(h1.parentElement);
// console.log(h1.parentNode);

// // some times we need the grandparent element so use closest()
// h1.closest('.header__title').style.background = 'var(--gradient-primary)';
// console.log(h1.closest('.header'));
// h1.closest('h1').style.background = 'var(--gradient-secondary)';

// //Going sideWays  //sibling
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// //want to know all siblings trick   //beacuse we cannot read all siblings directly
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.backgroundColor = 'pink';
// });

// 016 A Better Way The Intersection Observer API***********
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

//021 Lifecycle DOM Events//////////////////////////////////////////////////

// The DOMCOntentLoaded event fires when the whole html is downloaded and parsed to dom tree
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log(`HTML parsed and DOM tree built`, e);
// });

// window.addEventListener('load', function (e) {
//   console.log('everything is loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; //in past we were be able to edit the msg
// });
