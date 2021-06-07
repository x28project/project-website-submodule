/* globals PROJECTS_IFRAMES, PROJECTS_DROPDOWNS */

// additional projects data
const projects = PROJECTS_IFRAMES;
const projectsDropdowns = PROJECTS_DROPDOWNS;

/**
 * Scrolls to and shows a hidden panel.
 * @param {Event} event
 */
const showHiddenPanel = (event) => {
  const hiddenPanel = document.querySelector('.mui-panel.mui--hide');
  if (hiddenPanel) {
    hiddenPanel.style.opacity = 0;
    hiddenPanel.style.transition = 'opacity 2.8s .56s';
    hiddenPanel.classList.remove('mui--hide');
    hiddenPanel.scrollIntoView({ behavior: 'smooth' });
    hiddenPanel.style.opacity = 1;
  }
  event.target.remove();
};

/**
 * Loads iframes for given array of projects
 * @param {[[string, HTMLElement]]} iframesToAdd
 */
const loadProjectIframes = (iframesToAdd) => {
  if (iframesToAdd.length) {
    // load the first project iframe
    const projectIframe = document.createElement('iframe');
    const projectAbbr = iframesToAdd[0][0];
    const projectArtworkElement = iframesToAdd[0][1];
    projectIframe.addEventListener(
      'load',
      () => {
        // once loaded, remove the project iframe from the array and load the next one
        projects[projectAbbr].loaded = true;
        iframesToAdd.splice(0, 1);
        setTimeout(() => {
          loadProjectIframes(iframesToAdd);
        }, 1000);
      },
      {
        once: true,
      }
    );
    projectIframe.src = projects[projectAbbr].src;
    const projectTitleElement =
      projectArtworkElement.parentElement.querySelector('h2');
    projectIframe.title = `${projectTitleElement.innerText} ${
      (projectIframe.src.includes('bandcamp') && 'Bandcamp') ||
      (projectIframe.src.includes('youtube') && 'YouTube')
    }`;
    projectArtworkElement.appendChild(projectIframe);
  }
};

/**
 * Loops through projects to stay visible for a bit before loading iframes.
 */
const loopForVisibleProjectIframes = () => {
  const iframesToAdd = [];
  // loop through all project to determine which are visible
  for (let i = 0; i < projects.length; i += 1) {
    if (projects[i].src && !projects[i].loaded) {
      const projectArtworkElement = document.querySelector(
        `#${projects[i].abbr}`
      );
      // determine if this project element is visible
      const rect = projectArtworkElement.getBoundingClientRect(0);
      const { top } = rect;
      const { bottom } = rect;
      const visible = top + rect.height / 2 < window.innerHeight && bottom >= 0;
      // if visible add project abbr and element to array of project iframes to add
      if (visible && !projectArtworkElement.querySelector('iframe')) {
        iframesToAdd.push([i, projectArtworkElement]);
      }
    }
  }
  // after determining visible iframes, add them
  loadProjectIframes(iframesToAdd);
};

let timeoutId = 0;
/**
 * Waits for projects to stay visible for a bit before loading iframes.
 */
const waitToLoopForVisibleProjectIframes = () => {
  // if not currently waiting
  if (!timeoutId) {
    // wait to ensure projects stay visible for a bit
    timeoutId = setTimeout(() => {
      loopForVisibleProjectIframes();
      // get ready to wait again
      timeoutId = 0;
    }, 1000);
  }
};

window.onload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }

  // add more (...) dropdown to each project
  projectsDropdowns.forEach((dropdown) => {
    if (dropdown.cover || dropdown.zip) {
      const moreDropdownClone = document
        .querySelector('#more-dropdown--template')
        .content.cloneNode(true);
      if (dropdown.cover) {
        moreDropdownClone.querySelector('.more-cover').href = dropdown.cover;
        moreDropdownClone
          .querySelector('[data-mui-toggle="dropdown"]')
          .addEventListener(
            'click',
            (event) => {
              const { target } = event;
              target
                .closest('.mui-dropdown')
                .querySelector('.more-cover img').src = dropdown.cover;
            },
            { once: true }
          );
      } else {
        moreDropdownClone.querySelector('.more-cover').parentElement.remove();
      }
      moreDropdownClone.querySelector('.more-link').href = dropdown.zip;
      const projectArtworkElement = document.querySelector(`#${dropdown.abbr}`)
        .nextElementSibling.nextElementSibling.firstElementChild;
      projectArtworkElement.appendChild(moreDropdownClone);
    }
  });

  // load visible project iframes on scroll
  window.onscroll = waitToLoopForVisibleProjectIframes;
  // load visible project iframes on resize
  window.onresize = waitToLoopForVisibleProjectIframes;
  // load initially visible project iframes
  waitToLoopForVisibleProjectIframes();

  // show hidden panel on click
  document
    .querySelector('#show_hidden_panel')
    .addEventListener('click', showHiddenPanel, { once: true });
};
