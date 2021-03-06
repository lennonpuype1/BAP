{
  const $page1 = document.querySelector(`.page1`);
  const $page2 = document.querySelector(`.page2`);
  const $page3 = document.querySelector(`.page3`);
  const $page4 = document.querySelector(`.page4`);

  const SwipeEventDispatcher = require("./SwipeEventDispatcher.js") // eslint-disable-line
    .SwipeEventDispatcher;

  let currentLanguage;
  let globalLanguage;
  let activeCityId = 0;
  let unlockedRouteId = []; // eslint-disable-line
  let currentRouteId = 0; // eslint-disable-line
  let clickedButton = false;// eslint-disable-line
  let currentColor;// eslint-disable-line

  const init = () => {
    hamburger();
    arrows();
    const $language = document.querySelector(`.language`);
    if ($language) {
      globalLanguage = $language.textContent;
    }

    window.addEventListener(`load`, () => {
      const $loader = document.querySelector(`.loader`);
      if ($loader) {
        $loader.classList.add(`hidden`);
      }
    });

    const acc = document.getElementsByClassName("accordion");// eslint-disable-line

    for (let i = 0; i < acc.length; i++) {// eslint-disable-line
      acc[i].addEventListener("click", function () {// eslint-disable-line
        const panels = document.querySelectorAll(`.panel`);
        const allPanels = Array.from(panels);
        allPanels.map(panel => {
          panel.style.display = "none";// eslint-disable-line
        });

        const panel = this.nextElementSibling;
        if (panel.style.display === "block") {// eslint-disable-line
          panel.style.display = "none";// eslint-disable-line
        } else {
          panel.style.display = "block";// eslint-disable-line
        }
      });
    }

    const $index = document.querySelector(`.index`);
    if ($index) {
      manageHomePage();

      const startTags = [
        `Start exploring >`,
        `Commencez à explorer >`,
        `Start met verkennen >`
      ];

      let iPrev = 0;
      const $startBtn = document.querySelector(`.startBtn`);

      setInterval(() => {
        const iNew = iPrev;

        if (iNew === startTags.length - 1) {
          iPrev = 0;
        } else {
          iPrev++; // eslint-disable-line
        }

        $startBtn.textContent = startTags[iNew];
      }, 1500);

      const $body = document.querySelector(`.body`);
      $body.removeAttribute("style"); // eslint-disable-line
    }

    const $routePage = document.querySelector(`.routePage`);

    if ($routePage) {
      manageRoutePage();

      setInterval(() => {
        const $articles = document.querySelectorAll(`.route`);
        const arrayArticles = Array.from($articles);

        arrayArticles.map(article => {
          if (!article.classList.contains(`is-selected`)) {
            article.classList.add(`blur`);
          } else {
            article.classList.remove(`blur`);
          }
        });
      }, 100);
    }

    const $singleRoutePage = document.querySelector(`.singleRoutePage`);
    if ($singleRoutePage) {
      $singleRoutePage.classList.add(`hidden`);
      handleMaps();
    }

    const $arPage = document.querySelector(`.arPage`);
    if ($arPage) {
      handleAR();
    }

    const $arDefPage = document.querySelector(`.arscene_div_def`);
    if ($arDefPage) {
      // eslint-disable-next-line camelcase
      const $buttons_ar = document.querySelectorAll(`.route_choice_btn`);

      const buttonsArArray = Array.from($buttons_ar);
      const cityRouteId = document.querySelector(`.cityRouteId`).textContent;
      buttonsArArray.map(item => {
        item.classList.add(`btn_gradient_${cityRouteId}`);
      });
    }
  };

  const arrows = () => {
    const $faqs = document.querySelectorAll(`.faq_option`);
    const $faqsArray = Array.from($faqs);

    const $arrows = document.querySelectorAll(`.svg_arrow`);
    const $arrowArray = Array.from($arrows);

    if ($faqs) {
      $faqsArray.map($item => {
        $item.addEventListener("click", () => {// eslint-disable-line
          $arrowArray.map(arrow => {
            arrow.classList.remove("rotate_svg");// eslint-disable-line
          });

          $item.firstElementChild.classList.add("rotate_svg");// eslint-disable-line
        });
      });
    }
  };

  const hamburger = () => {
    const $hamburger = document.querySelector(".hamburger-menu");// eslint-disable-line
    const $navbar = document.querySelector(".navbar");// eslint-disable-line
    const $contentRoute = document.querySelector(".main_blur");// eslint-disable-line
    const $contentBlur = document.querySelector(".blur_hidden");// eslint-disable-line

    if ($hamburger) {
      $hamburger.addEventListener("click", () => {// eslint-disable-line
        $navbar.classList.toggle("change");// eslint-disable-line
        $contentRoute.classList.toggle("blur");// eslint-disable-line
        $contentBlur.classList.toggle("blur");// eslint-disable-line
      });
    }
  };

  const manageRoutePage = () => {
    handleRouteJSON();
    tabbarManager();
  };

  const tabbarManager = () => {
    const $tabItems = document.querySelectorAll(`.city_link`);
    const tabItemArray = Array.from($tabItems);
    tabItemArray.map(item => {
      item.addEventListener(`click`, e => {
        tabItemArray.map(singleItem => {
          singleItem.classList.remove(`active_city`);
        });
        handleClickTabItem(e);
      });
    });
  };

  const handleClickTabItem = e => {
    const currentTarget = e.currentTarget;
    currentTarget.classList.add(`active_city`);
    activeCityId = currentTarget.dataset.id;
    handleRouteJSON();
  };

  const handleRouteJSON = () => {
    const url = `./assets/data/cities.json`;
    fetch(url)
      .then(r => r.json())
      .then(parseCities);
  };

  let filteredRoutes = []; // eslint-disable-line

  const parseCities = data => {
    const city = data.cities[activeCityId];
    const routes = city.routes;

    //1. Routes section verwijderen wanneer reeds eens aangemaakt
    if (document.querySelector(`.routes`)) {
      document.querySelector(`.routes`).remove();
    }

    //2. Routes section met Flickity aanmaken
    const $routesContainer = document.querySelector(`.routes_container`);
    const $section = document.createElement(`section`);
    $routesContainer.appendChild($section);
    $section.classList.add(`routes`, `carousel`);
    $section.setAttribute(
      `data-flickity`,
      `{ "contain": true, "wrapAround": true, "prevNextButtons": false, "pageDots": false, "lazyload": 100 }`
    );

    //3. Toevoegen van de Articles aan de Routes section
    routes.map(route => {
      createRouteCards(route, routes);
    });

    //4. Script & Link toevoegen aan head voor asyncroon te werken op de Articles die hierboven worden toegevoegd
    const $head = document.querySelector(`.head`);
    const $script = document.createElement(`script`);
    const $style = document.createElement(`link`);
    $head.appendChild($script);
    $head.appendChild($style);
    $script.setAttribute(
      `src`,
      `https://npmcdn.com/flickity@2.2.1/dist/flickity.pkgd.js`
    );
    $style.setAttribute(
      `href`,
      `https://npmcdn.com/flickity@2.2.1/dist/flickity.css`
    );
    $style.setAttribute(`rel`, `stylesheet`);
    $script.setAttribute(`id`, `script`);
    $style.setAttribute(`id`, `style`);

    handleStartButtonLogics(routes);
  };

  const createRouteCards = (route, routes) => {
    const $routes = document.querySelector(`.routes`);

    const $article = document.createElement(`article`);
    $routes.appendChild($article);
    $article.classList.add(`route`);
    $article.classList.add(`carousel-cell`);

    const $divArt = document.createElement(`div`);
    $article.appendChild($divArt);
    $divArt.classList.add(`route_divArt`);

    const $divImg = document.createElement(`div`);
    const $h1 = document.createElement(`h1`);
    const $p = document.createElement(`p`);

    const $divParams = document.createElement(`div`);
    const $steps = document.createElement(`div`);
    const $time = document.createElement(`div`);
    const $waypoints = document.createElement(`div`);
    const $a = document.createElement(`a`);

    $divArt.appendChild($divImg);
    $divArt.appendChild($h1);
    $divArt.appendChild($p);
    $article.appendChild($a);

    $divArt.appendChild($divParams);
    $divParams.appendChild($steps);
    $divParams.appendChild($time);
    $divParams.appendChild($waypoints);

    $divImg.classList.add(`route_img`);
    $h1.classList.add(`route_name`);
    $p.classList.add(`route_desc`);
    $divParams.classList.add(`route_parameters`);
    $steps.classList.add(`route_parameter`);
    $time.classList.add(`route_parameter`);
    $waypoints.classList.add(`route_parameter`);

    $a.classList.add(`route_button`);
    $h1.innerHTML = `<h1 style="color:${route.color1};">${route.name}</h1>`;

    if (globalLanguage === `nl`) {
      $p.textContent = route.descnl;
    }

    if (globalLanguage === `fr`) {
      $p.textContent = route.descfr;
    }

    if (globalLanguage === `en`) {
      $p.textContent = route.descen;
    }

    $divImg.innerHTML = `<img src="${route.img}" alt="Route image" height="250" width="250">`;

    $steps.innerHTML = `<img src="${route.stepsImg}" class="img_parameter" alt="Image for how many km" width="3O" height="30"/> <p class="route_parameter_text">${route.distance}</p>`;
    $time.innerHTML = `<img src="${route.timeImg}" class="img_parameter" alt="Image for how many minutes" width="3O" height="30" /> <p class="route_parameter_text">${route.time}</p>`;
    $waypoints.innerHTML = `<img src="${route.wpImg}" class="img_parameter" alt="Image for how many waypoints" width="3O" height="30"/> <p class="route_parameter_text">${route.waypoints.length}</p>`;

    if (globalLanguage === `nl`) {
      $h1.innerHTML = `<h1 style="color:${route.color1}; grid-area:route_name; margin-bottom: 0.8rem;">${route.namenl}</h1>`;
    }

    if (globalLanguage === `fr`) {
      $h1.innerHTML = `<h1 style="color:${route.color1}; grid-area:route_name; margin-bottom: 0.8rem;">${route.namefr}</h1>`;
    }

    if (globalLanguage === `en`) {
      $h1.innerHTML = `<h1 style="color:${route.color1}; grid-area:route_name; margin-bottom: 0.8rem;">${route.nameen}</h1>`;
    }

    $a.dataset.id = route.id;

    const $routeIds = document.querySelectorAll(`.routeId`);
    const routeIdArr = Array.from($routeIds);

    let newRouteIdArray = []; // eslint-disable-line
    routeIdArr.map(routeId => {
      newRouteIdArray.push(routeId.textContent);
    });

    const unlockedRouteIds = [...new Set(newRouteIdArray)]; // eslint-disable-line

    let unlockedRouteIdArray = []; // eslint-disable-line

    unlockedRouteIds.map(routeId => {
      const unlockedRouteId = routes.filter(route => {
        return route.id === parseInt(routeId);
      });

      unlockedRouteIdArray.push(unlockedRouteId[0]);
    });

    $a.setAttribute(`href`, `#`);
    $a.classList.add(`locked`);
    $a.classList.remove(`unlocked`);

    if (globalLanguage === `nl`) {
      $a.textContent = `Voer code in +`;
      $a.setAttribute(`style`, `background-color:${route.color1}`);
    }

    if (globalLanguage === `fr`) {
      $a.textContent = `Entrez un code +`;
      $a.setAttribute(`style`, `background-color:${route.color1}`);
    }

    if (globalLanguage === `en`) {
      $a.textContent = `Enter a code +`;
      $a.setAttribute(`style`, `background-color:${route.color1}`);
    }

    $article.classList.add(`locked`);
    $article.classList.remove(`unlocked`);
    $article.dataset.id = route.globalId;

    const filterRoute = unlockedRouteIdArray.filter(unlockedRoute => {
      return unlockedRoute.id === route.id;
    });

    filteredRoutes.push(filterRoute[0]);

    const $lockedRoutes = document.querySelectorAll(`.locked`);
    const lockedRoutesArray = Array.from($lockedRoutes);
    const $routePage = document.querySelector(`.routePage`);
    lockedRoutesArray.map(lockedRoute => {
      lockedRoute.addEventListener(`click`, () => {
        if (
          lockedRoute.classList.contains(`route_button`) &&
          lockedRoute.classList.contains(`locked`)
        ) {
          const $popup = document.querySelector(`.popup_code`);
          $popup.classList.remove(`hidden`);
          $routePage.classList.add(`hidden`);
          showCodeScreen($popup, globalLanguage);
        }
      });
    });
  };

  const routeDetailCarousel = waypoint => {
    //1. Routes section met Flickity aanmaken
    const $imagesContainer = document.querySelector(`.images_container`);

    const $section = document.createElement(`section`);
    $imagesContainer.appendChild($section);
    $section.classList.add(`images`, `carousel`);
    $section.setAttribute(
      `data-flickity`,
      `{ "contain": true, "wrapAround": true, "prevNextButtons": false, "pageDots": true, "lazyload": 100 }`
    );

    for (let i = 0; i < 3; i++) {// eslint-disable-line
      const $image = document.createElement(`img`);
      $section.appendChild($image);
      $image.classList.add(`image`);
      $image.classList.add(`carousel-cell`);
      $image.setAttribute(
        `src`,
        `assets/img/details/${waypoint.name.toLowerCase()}_${i}.jpg`
      );
    }

    //2. Script & Link toevoegen aan head voor asyncroon te werken op de Articles die hierboven worden toegevoegd
    const $head = document.querySelector(`.head`);
    const $script = document.createElement(`script`);
    const $style = document.createElement(`link`);
    $head.appendChild($script);
    $head.appendChild($style);
    $script.setAttribute(
      `src`,
      `https://npmcdn.com/flickity@2.2.1/dist/flickity.pkgd.js`
    );
    $style.setAttribute(
      `href`,
      `https://npmcdn.com/flickity@2.2.1/dist/flickity.css`
    );
    $style.setAttribute(`rel`, `stylesheet`);
    $script.setAttribute(`id`, `script`);
    $style.setAttribute(`id`, `style`);
  };

  const handleStartButtonLogics = routes => {
    const $allArticle = document.querySelectorAll(`.route`);
    const $allA = document.querySelectorAll(`.route_button`);
    const articleArray = Array.from($allArticle);
    const aArray = Array.from($allA);

    let lastRouteArray = []; // eslint-disable-line
    let lastAArray = []; // eslint-disable-line

    filteredRoutes.map(route => {
      if (route === undefined) {
        route = {};
        route.id = 999;
      }

      lastRouteArray.push(route.id);
    });

    for (let i = 0; i < articleArray.length; i++) {// eslint-disable-line
      //eslint-disable-line
      lastAArray.push(aArray[i]);

      if (routes[i].id === lastRouteArray[i]) {
        aArray[i].setAttribute(
          `href`,
          `index.php?page=route&id=${routes[i].id}&city=${activeCityId}&cityRouteId=${routes[i].id}`
        );
        aArray[i].setAttribute(`style`, `background-color:${routes[i].color1}`);
        aArray[i].classList.add(`unlocked`);
        aArray[i].classList.remove(`locked`);
        if (globalLanguage === `nl`) {
          aArray[i].textContent = `Starten`;
        }

        if (globalLanguage === `fr`) {
          aArray[i].textContent = `Commencer`;
        }

        if (globalLanguage === `en`) {
          aArray[i].textContent = `Start`;
        }

        articleArray[i].classList.add(`unlocked`);
        articleArray[i].classList.remove(`locked`);
      }
    }
  };

  const showCodeScreen = (page, language) => {
    let codeValue = ``;
    const $a = document.createElement(`a`);
    const $routePage = document.querySelector(`.routePage`);

    if (language === `dutch`) {
      language = `nl`;
    }

    if (language === `french`) {
      language = `fr`;
    }

    if (language === `english`) {
      language = `nl`;
    }

    if (language === `nl`) {
      // eslint-disable-line
      page.innerHTML = `
      <div class="code_content">
    <h1 class="page_title_small">Voer je persoonlijke code<br/>hier in</h1>
    <p class="sub_info">Deze kan je vinden op het door<br/>jou gekozen ticketje</p>
    <form class="code_form">
      <input type="hidden" name="action" value="entercode"/>
      <input type="hidden" name="l" value="nl"/>
      <div class="code_div">
        <div class="code_input">
        <input type="text" name="code" class="code neumorphism_box" maxlength="5" disabled/>
        <a class="help_btn_code">Hulp nodig?</a>
        </div>
        <div class="character_btns">
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">0</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">1</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">2</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">3</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">4</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">5</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">6</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">7</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">8</button>
          <button class="char_btn code_btn btn_shadow" data-type="number" type="button">9</button>
          <button class="char_btn code_btn btn_shadow" data-type="route" type="button">S</button>
          <button class="char_btn code_btn btn_shadow" data-type="city" type="button">T</button>
          <button class="char_btn code_btn btn_shadow" data-type="route" type="button">F</button>
          <button class="char_btn code_btn btn_shadow" data-type="city" type="button">K</button>
          <button class="char_btn code_btn btn_shadow" data-type="city" type="button">L</button>
          <button class="char_btn code_btn btn_shadow" data-type="city" type="button">V</button>
          <button class="extra_btn delete_btn code_btn btn_shadow" data-type="remove" type="button"><</button>
          <button class="extra_btn clear_btn code_btn btn_shadow" data-type="clear" type="button">C</button>
        </div>
      </div>
    </form></div>`;

      const $codeDiv = document.querySelector(`.code_div`);
      const $codeInput = document.querySelector(`.code`);

      setInterval(() => {
        const value = $codeInput.value;
        const firstCharacter = value[0];
        const secondCharacter = value[1];

        $codeDiv.appendChild($a);
        $a.classList.add(`page_btn`, `btn_shadow`);

        //Check if value has 5 characters en the first character or second character is true -> Returns the code is valid to continue
        if (value.length === 5) {
          if (
            (firstCharacter === `K` ||
              firstCharacter === `T` ||
              firstCharacter === `L` ||
              firstCharacter === `V`) &&
            (secondCharacter === `S` ||
              secondCharacter === `T` ||
              secondCharacter === `F`)
          ) {
            $a.innerHTML = `Ga verder >`;
            $a.classList.remove(`hidden`);
            if ($routePage) {
              $a.setAttribute(
                `href`,
                `index.php?page=routes&l=nl&code=${value}&action=enternewcode`
              );
            } else {
              $a.setAttribute(
                `href`,
                `index.php?page=routes&l=nl&code=${value}`
              );
            }
          } else {
            $a.innerHTML = ``;
            $a.classList.add(`hidden`);
            $a.disabled = true;
            $a.removeAttribute(`href`);
          }
        } else {
          $a.innerHTML = ``;
          $a.classList.add(`hidden`);
          $a.disabled = true;
          $a.removeAttribute(`href`);
        }

        const $allBtns = document.querySelectorAll(`.char_btn`);
        const btnArray = Array.from($allBtns);

        btnArray.map(btn => {
          if (value.length === 0) {
            if (btn.dataset.type === `route` || btn.dataset.type === `number`) {
              btn.setAttribute(`disabled`, true);
              btn.classList.add(`inactive_button`);
            } else {
              btn.removeAttribute(`disabled`);
              btn.classList.remove(`inactive_button`);
            }
          }

          if (value.length === 1) {
            if (btn.dataset.type === `route`) {
              btn.removeAttribute(`disabled`);
              btn.classList.remove(`inactive_button`);
            } else {
              btn.setAttribute(`disabled`, true);
              btn.classList.add(`inactive_button`);
            }

            if (btn.dataset.type === `number`) {
              btn.setAttribute(`disabled`, true);
              btn.classList.add(`inactive_button`);
            } else {
              btn.removeAttribute(`disabled`);
              btn.classList.remove(`inactive_button`);
            }
          }

          if (value.length > 1) {
            if (btn.dataset.type === `route` || btn.dataset.type === `city`) {
              btn.setAttribute(`disabled`, true);
              btn.classList.add(`inactive_button`);
            } else {
              btn.removeAttribute(`disabled`);
              btn.classList.remove(`inactive_button`);
            }
          }
        });
      }, 100);
    }

    if (language === `fr`) {
      // eslint-disable-line
      page.innerHTML = `
      <div class="code_content">
    <h1 class="page_title_small">Entrez votre code<br/>personnel ici</h1>
    <p class="sub_info">Vous pouvez le trouver sur le ticket que<br/>vous avez choisi</p>
    <form class="code_form">
      <input type="hidden" name="action" value="entercode"/>
      <input type="hidden" name="l" value="fr"/>
      <div class="code_div">
        <div class="code_input">
        <input type="text" name="code" class="code neumorphism_box" maxlength="5" disabled/>
        <a class="help_btn_code" disabled>Besoin d'aide?</a>
        </div>
        <div class="character_btns">
          <button class="char_btn code_btn btn_shadow" type="button">0</button>
          <button class="char_btn code_btn btn_shadow" type="button">1</button>
          <button class="char_btn code_btn btn_shadow" type="button">2</button>
          <button class="char_btn code_btn btn_shadow" type="button">3</button>
          <button class="char_btn code_btn btn_shadow" type="button">4</button>
          <button class="char_btn code_btn btn_shadow" type="button">5</button>
          <button class="char_btn code_btn btn_shadow" type="button">6</button>
          <button class="char_btn code_btn btn_shadow" type="button">7</button>
          <button class="char_btn code_btn btn_shadow" type="button">8</button>
          <button class="char_btn code_btn btn_shadow" type="button">9</button>
          <button class="char_btn code_btn btn_shadow" type="button">S</button>
          <button class="char_btn code_btn btn_shadow" type="button">T</button>
          <button class="char_btn code_btn btn_shadow" type="button">F</button>
          <button class="char_btn code_btn btn_shadow" type="button">K</button>
          <button class="char_btn code_btn btn_shadow" type="button">L</button>
          <button class="char_btn code_btn btn_shadow" type="button">V</button>
          <button class="extra_btn delete_btn code_btn btn_shadow" data-type="remove" type="button"><</button>
          <button class="extra_btn clear_btn code_btn btn_shadow" data-type="clear" type="button">C</button>
        </div>
      </div>
    </form></div>`;

      const $codeDiv = document.querySelector(`.code_div`);
      const $codeInput = document.querySelector(`.code`);

      setInterval(() => {
        const value = $codeInput.value;
        const firstCharacter = value[0];
        const secondCharacter = value[1];

        $codeDiv.appendChild($a);
        $a.classList.add(`page_btn`, `btn_shadow`);

        //Check if value has 5 characters en the first character or second character is true -> Returns the code is valid to continue
        if (value.length === 5) {
          if (
            (firstCharacter === `K` ||
              firstCharacter === `T` ||
              firstCharacter === `L` ||
              firstCharacter === `V`) &&
            (secondCharacter === `S` ||
              secondCharacter === `T` ||
              secondCharacter === `F`)
          ) {
            $a.innerHTML = `Continuez >`;
            $a.classList.remove(`ongeldig`);
            if ($routePage) {
              $a.setAttribute(
                `href`,
                `index.php?page=routes&l=nl&code=${value}&action=enternewcode`
              );
            } else {
              $a.setAttribute(
                `href`,
                `index.php?page=routes&l=fr&code=${value}`
              );
            }
          } else {
            $a.innerHTML = `Code invalide`;
            $a.classList.add(`ongeldig`);
            $a.disabled = true;
            $a.removeAttribute(`href`);
          }
        } else {
          $a.innerHTML = `Code invalide`;
          $a.classList.add(`ongeldig`);
          $a.disabled = true;
          $a.removeAttribute(`href`);
        }
      }, 100);
    }

    if (language === `en`) {
      // eslint-disable-line
      page.innerHTML = `
      <div class="code_content">
    <h1 class="page_title_small">Enter your personal<br/>code here</h1>
    <p class="sub_info">You can find the code on the back<br/>of the card you've chosen</p>
    <form class="code_form">
      <input type="hidden" name="action" value="entercode"/>
      <input type="hidden" name="l" value="en"/>
      <div class="code_div">
        <div class="code_input">
        <input type="text" name="code" class="code neumorphism_box" maxlength="5" disabled/>
        <a class="help_btn_code" disabled>Need help?</a>
        </div>
        <div class="character_btns">
          <button class="char_btn code_btn btn_shadow" type="button">0</button>
          <button class="char_btn code_btn btn_shadow" type="button">1</button>
          <button class="char_btn code_btn btn_shadow" type="button">2</button>
          <button class="char_btn code_btn btn_shadow" type="button">3</button>
          <button class="char_btn code_btn btn_shadow" type="button">4</button>
          <button class="char_btn code_btn btn_shadow" type="button">5</button>
          <button class="char_btn code_btn btn_shadow" type="button">6</button>
          <button class="char_btn code_btn btn_shadow" type="button">7</button>
          <button class="char_btn code_btn btn_shadow" type="button">8</button>
          <button class="char_btn code_btn btn_shadow" type="button">9</button>
          <button class="char_btn code_btn btn_shadow" type="button">S</button>
          <button class="char_btn code_btn btn_shadow" type="button">T</button>
          <button class="char_btn code_btn btn_shadow" type="button">F</button>
          <button class="char_btn code_btn btn_shadow" type="button">K</button>
          <button class="char_btn code_btn btn_shadow" type="button">L</button>
          <button class="char_btn code_btn btn_shadow" type="button">V</button>
          <button class="extra_btn delete_btn code_btn btn_shadow" data-type="remove" type="button"><</button>
          <button class="extra_btn clear_btn code_btn btn_shadow" data-type="clear" type="button">C</button>
        </div>
      </div>
    </form></div>`;

      const $codeDiv = document.querySelector(`.code_div`);
      const $codeInput = document.querySelector(`.code`);

      setInterval(() => {
        const value = $codeInput.value;
        const firstCharacter = value[0];
        const secondCharacter = value[1];

        $codeDiv.appendChild($a);
        $a.classList.add(`page_btn`, `btn_shadow`);

        //Check if value has 5 characters en the first character or second character is true -> Returns the code is valid to continue
        if (value.length === 5) {
          if (
            (firstCharacter === `K` ||
              firstCharacter === `T` ||
              firstCharacter === `L` ||
              firstCharacter === `V`) &&
            (secondCharacter === `S` ||
              secondCharacter === `T` ||
              secondCharacter === `F`)
          ) {
            $a.innerHTML = `Continue >`;
            $a.classList.remove(`ongeldig`);
            if ($routePage) {
              $a.setAttribute(
                `href`,
                `index.php?page=routes&l=nl&code=${value}&action=enternewcode`
              );
            } else {
              $a.setAttribute(
                `href`,
                `index.php?page=routes&l=en&code=${value}`
              );
            }
          } else {
            $a.innerHTML = `Invalid code`;
            $a.classList.add(`ongeldig`);
            $a.disabled = true;
            $a.removeAttribute(`href`);
          }
        } else {
          $a.innerHTML = `Invalid code`;
          $a.classList.add(`ongeldig`);
          $a.disabled = true;
          $a.removeAttribute(`href`);
        }
      }, 100);
    }

    if ($routePage) {
      const pageBtn = document.querySelector(`.back_btn`);
      if (pageBtn) {
        pageBtn.addEventListener(`click`, () => {
          window.location = `index.php?page=routes`;
        });
      }
    }

    const $codeContent = document.querySelector(`.code_content`);
    const $header = document.querySelector(`.header`);

    if ($routePage) {
      $codeContent.classList.add(`code_div_popup`);
      $header.classList.add(`hidden`);
    } else {
      if ($codeContent) {
        $codeContent.classList.remove(`code_div_popup`);
      }
    }

    const $code = document.querySelector(`.code`);

    const $allBtns = document.querySelectorAll(`.char_btn`);
    const allBtnArray = Array.from($allBtns);

    const $allExtraBtns = document.querySelectorAll(`.extra_btn`);
    const allExtraBtnArray = Array.from($allExtraBtns);

    allExtraBtnArray.map(btn => {
      btn.addEventListener(`click`, e => {
        if (e.currentTarget.dataset.type === `clear`) {
          codeValue = ``;
          $code.value = ``;
        }

        if (e.currentTarget.dataset.type === `remove`) {
          codeValue = codeValue.substring(0, codeValue.length - 1);
          $code.value = codeValue;
        }
      });
    });

    allBtnArray.map(btn => {
      btn.addEventListener(`click`, e => {
        if (codeValue.length >= 5) {
          codeValue = codeValue; // eslint-disable-line
        } else {
          codeValue += e.currentTarget.textContent;
        }

        $a.setAttribute(`href`, `index.php?page=routes&l=nl&code=${codeValue}`);
        $code.value = codeValue;
      });
    });

    const $help = document.querySelector(`.help_btn_code`);
    $help.addEventListener(`click`, () => {
      handleHelpPopup();
    });
  };

  const handleHelpPopup = () => {
    const $body = document.querySelector(`.body`);
    const $invisibleDiv = document.createElement(`div`);
    const $popupStyle = document.createElement(`div`);
    const $popupDiv = document.createElement(`div`);
    const $popup_text = document.createElement(`p`);// eslint-disable-line
    const $popup_close = document.createElement(`a`);// eslint-disable-line
    const $gif = document.createElement(`img`);

    $body.appendChild($invisibleDiv);
    $body.appendChild($popupStyle);
    $popupStyle.appendChild($popupDiv);
    $popupDiv.appendChild($popup_close);
    $popupDiv.appendChild($gif);
    $popupDiv.appendChild($popup_text);

    $invisibleDiv.classList.add(`invisible_overlay`);
    $popupStyle.classList.add(`popup_style`);
    $popupDiv.classList.add(`help_popup`);
    $popup_text.classList.add(`popup_text`);// eslint-disable-line
    $popup_close.classList.add(`popup_close`);// eslint-disable-line
    $gif.classList.add(`popup_image`);

    $gif.setAttribute(`src`, `./assets/img/help.gif`);
    $gif.setAttribute(`alt`, `Help Illustration`);

    const $page4 = document.querySelector(`.page4`);
    $page4.classList.add(`blur`);

    $popup_text.textContent = `Je vindt een code aan de installatie, deze laat je toe om een bepaalde wandeling te starten!`;// eslint-disable-line
    $popup_close.textContent = `sluit`;// eslint-disable-line

    $invisibleDiv.addEventListener(`click`, () => {
      $invisibleDiv.remove();
      $popupDiv.remove();
      $page4.classList.remove(`blur`);
    });

    $popup_close.addEventListener(`click`, () => {// eslint-disable-line
      $invisibleDiv.remove();
      $popupDiv.remove();
      $page4.classList.remove(`blur`);
    });
  };

  const manageHomePage = () => {
    //Handle Page 1
    const $pageBtn1 = $page1.querySelector(`.page_btn`);
    $pageBtn1.addEventListener(`click`, () => {
      $page1.classList.add(`inactive`);
      $page2.classList.remove(`inactive`);
    });

    //Handle Page 2
    const $pageBtns2 = $page2.querySelectorAll(`.page_btn`);
    const page2ButtonsArray = Array.from($pageBtns2);

    page2ButtonsArray.map(pageBtns => {
      pageBtns.addEventListener(`click`, e => {
        const currentTarget = e.currentTarget;
        currentLanguage = currentTarget.dataset.language;

        $page2.classList.add(`inactive`);
        $page3.classList.remove(`inactive`);

        if (currentLanguage === `dutch`) {
          $page3.innerHTML = `
          <div class="test_ar_div">
            <h1 class="page_title_small">Test de A.R. Experience</h1>
            <p class="sub_info">Sta je bij de installatie? </p>
            <p class="sub_info">Scan het A.R. vlak en kijk wat er gebeurt</p>
            <div class=" arscene_intro btn_shadow">
              <iframe src="index.php?page=arscene" class="arscene_iframe"></iframe>
            </div>
          </div>
          <a class="page_btn btn_shadow">Voer code in ></a>`;

          openPage4();
          goBackToPage2();
        }

        if (currentLanguage === `french`) {
          $page3.innerHTML = `
          <div class="test_ar_div">
            <h1 class="page_title_small">Teste d'experience A.R.</h1>
            <p class="sub_info">Êtes-vous à l'installation?</p>
            <p class="sub_info">Scannez le A.R. à plat et regardez ce qui se passe</p>
            <div class="arscene_div arscene_intro btn_shadow">
              <iframe src="index.php?page=arscene" class="arscene_iframe"></iframe>
            </div>
          </div>
          <a class="page_btn btn_shadow">Entrez le code ></a>`;

          openPage4();
          goBackToPage2();
        }

        if (currentLanguage === `english`) {
          $page3.innerHTML = `
          <div class="test_ar_div">
            <h1 class="page_title_small">Test the A.R. Experience</h1>
            <p class="sub_info">Are you next to a installation?</p>
            <p class="sub_info">Scan the A.R. image an see what happens</p>
            <div class="arscene_div arscene_intro btn_shadow">
              <iframe src="index.php?page=arscene" class="arscene_iframe"></iframe>
            </div>
          </div>
          <a class="page_btn btn_shadow">Enter your code ></a>`;
          goBackToPage2();
          openPage4();
        }
      });
    });
  };

  const goBackToPage2 = () => {
    const pageBtn = $page3.querySelector(`.back_btn`);
    if (pageBtn) {
      pageBtn.addEventListener(`click`, () => {
        $page3.classList.add(`inactive`);
        $page2.classList.remove(`inactive`);
      });
    }
  };

  const openPage4 = () => {
    const $pageBtn3 = $page3.querySelector(`.page_btn`);
    $pageBtn3.addEventListener(`click`, () => {
      $page3.classList.add(`inactive`);
      $page4.classList.remove(`inactive`);

      if (currentLanguage === `dutch`) {
        showCodeScreen($page4, "dutch"); // eslint-disable-line
      }

      if (currentLanguage === `french`) {
        showCodeScreen($page4, "french"); // eslint-disable-line
      }

      if (currentLanguage === `english`) {
        showCodeScreen($page4, "english"); // eslint-disable-line
      }

      const pageBtn = $page4.querySelector(`.back_btn`);
      if (pageBtn) {
        pageBtn.addEventListener(`click`, () => {
          $page4.classList.add(`inactive`);
          $page3.classList.remove(`inactive`);
        });
      }
    });
  };

  /*AR*/
  const handleAR = () => {
    //Show AR Screen
    const cityRouteId = document.querySelector(`.cityRouteId`).textContent;// eslint-disable-line

    const aframe = AFRAME; // eslint-disable-line
    let scanned = false; // eslint-disable-line

    const $div = document.querySelector(`.div`);

    setInterval(() => {
      if ($div) {
        const $body = document.querySelector(`.body`);
        $body.classList.add(`marginfix`);
      }
    }, 0);

    const $waypointInfo = document.querySelector(`.waypointInfo`);

    setInterval(() => {
      const $iframe = document.querySelector(`.arscene_iframe`);

      if ($iframe) {
        const $iframeContent = $iframe.contentWindow.document.body;
        if ($iframeContent) {
          const $marker = $iframeContent.querySelectorAll(`.marker`);
          const allMarkers = Array.from($marker);

          allMarkers.map(marker => {
            document.querySelector(`.ar_tag`).textContent =
              marker.object3D.visible;
            if (marker.object3D.visible === true) {
              showARInfo(marker.object3D.el.classList[1], $waypointInfo);
            }
          });
        }
      }
      let visitedWaypoints = []; // eslint-disable-line
      triggerFinishAllPoints(visitedWaypoints);
    }, 100);
  };

  const showARInfo = (activeRoute, $waypointInfoElement) => {
    const cityRouteId = document.querySelector(`.cityRouteId`).textContent;

    fetch(`./assets/data/cities.json`)
      .then(r => r.json())
      .then(data => {
        const cities = data.cities;
        const currentCity = cities[activeCityId];
        const currentRoute = currentCity.routes[cityRouteId];

        const filteredWaypoint = currentRoute.waypoints.filter(waypoint => {
          return waypoint.globalId === parseInt(activeRoute);
        });

        const currentWaypoint = filteredWaypoint[0];
        if (currentWaypoint) {
          $waypointInfoElement.innerHTML = `<h1>${currentWaypoint.name}</h1>
          <div>
            <button class="play">Play</button>
            <button class="pause">Pause</button>
            <button class="restart">Restart</button>
          </div>`;

          const $playBtn = document.querySelector(`.play`);
          const $pauseBtn = document.querySelector(`.pause`);
          const $restartBtn = document.querySelector(`.restart`);
          const audio = new Audio(
            `./assets/audio/${currentWaypoint.globalId}.mp3`
          );

          $playBtn.addEventListener(`click`, () => {
            audio.play();
          });

          $pauseBtn.addEventListener(`click`, () => {
            audio.pause();
          });

          $restartBtn.addEventListener(`click`, () => {
            audio.load();
            audio.play();
          });
        } else {
          $waypointInfoElement.textContent = ``;
        }
      });

    saveRouteToPhp(activeRoute);
  };

  const saveRouteToPhp = activeRoute => {
    let strippedString = activeRoute;
    strippedString = strippedString.replace(/[',]+g/, ``);
    createActiveRouteCookie(parseInt(strippedString));
  };

  const createActiveRouteCookie = activeRoute => {
    var json_str = JSON.stringify(activeRoute); // eslint-disable-line
    createCookie(`activeRoute`, json_str, 3);
  };

  /* eslint-disable*/
  var createCookie = function (name, value, days) {
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };
  /* eslint-enable*/

  /*MIX ROUTES & AR*/
  const triggerFinishAllPoints = visitedWaypoints => {
    const cityRouteId = document.querySelector(`.cityRouteId`).textContent;

    fetch(`./assets/data/cities.json`)
      .then(r => r.json())
      .then(data => {
        const cities = data.cities;
        const currentCity = cities[activeCityId];
        const currentRoute = currentCity.routes[cityRouteId];

        const waypoints = currentRoute.waypoints;

        const lineString = new H.geo.LineString();// eslint-disable-line

        waypoints.map(waypoint => {
          lineString.pushPoint({
            lat: waypoint.geolocation.lat,
            lng: waypoint.geolocation.lng
          });
        });

        // Deel van de HERE API
        // map.addObject(new H.map.Polyline(
        //   lineString, { style: { lineWidth: 8 } }
        // ));

        const exists = waypoints.filter(waypoint => waypoint.visited === `yes`);
        visitedWaypoints.push(exists);

        if (exists.length >= waypoints.length) {
          const $popupPrizeNotification = document.querySelector(
            `.popupPrizeNotification`
          );
          $popupPrizeNotification.classList.remove(`hidden`);

          $popupPrizeNotification.addEventListener(`click`, handlePrizePopup);
        }
      });
  };

  const handlePrizePopup = e => {
    const $popupForClaim = document.querySelector(`.popupForClaim`);
    $popupForClaim.classList.remove(`hidden`);

    const $closePrizePopup = document.querySelector(`.closePrizePopup`);
    $closePrizePopup.addEventListener(`click`, () => {
      $popupForClaim.classList.add(`hidden`);
      e.currentTarget.classList.remove(`hidden`);
    });
  };

  /*Routes*/
  let mapData = {};// eslint-disable-line
  let userLocation = {};// eslint-disable-line
  let markers = []; // eslint-disable-line
  let map;
  const platform = ``;// eslint-disable-line

  // Deel van de HERE API
  // const platform = new H.service.Platform({
  //   apikey: `Ymzvxu_5jYrtjqdyrlORjoasI2KdTSwzdLZuyNkPH3k` // eslint-disable-line
  // });


  const handleMaps = () => {
    fetch(`./assets/data/cities.json`) // eslint-disable-line
      .then(r => r.json())
      .then(parseMaps);

    const $skipOnboarding = document.querySelector(`.skip_onboarding_form`);
    if ($skipOnboarding) {
      $skipOnboarding.classList.remove(`invalid`);
      $skipOnboarding.removeAttribute(`novalidate`);
    }

    handleOnboarding();

    setInterval(() => {
      let visitedWaypoints = []; // eslint-disable-line
      triggerFinishAllPoints(visitedWaypoints);
    }, 100);
  };

  const handleOnboarding = () => {
    const $onboarding = document.querySelector(`.onboarding`);
    const $onboardingSeen = document.querySelector(`.onboardingSeen`);
    const $singleRoutePage = document.querySelector(`.singleRoutePage`);
    $singleRoutePage.classList.add(`hidden`);

    if ($onboarding) {
      let currentOnboarding = 1;
      loadOnboardingView(currentOnboarding);

      const dispatcher = new SwipeEventDispatcher($onboarding);
      dispatcher.on(`SWIPE_LEFT`, () => {
        if (currentOnboarding < 3) {
          currentOnboarding += 1;
        } else if (currentOnboarding === 3) {
          currentOnboarding = 3;
          $singleRoutePage.classList.remove(`hidden`);
          $onboarding.remove();
          location.reload();
        }

        loadOnboardingView(currentOnboarding);
      });

      dispatcher.on(`SWIPE_RIGHT`, () => {
        if (currentOnboarding > 0) {
          currentOnboarding -= 1;
        } else if (currentOnboarding === 0) {
          currentOnboarding = 1;
        }

        loadOnboardingView(currentOnboarding);
      });
    } else {
      if (parseInt($onboardingSeen.textContent) === 1) {
        $singleRoutePage.classList.remove(`hidden`);
      }
    }
  };

  const loadOnboardingView = currentOnboarding => {
    const $onboarding1 = document.querySelector(`.onboarding1`);
    const $onboarding2 = document.querySelector(`.onboarding2`);
    const $onboarding3 = document.querySelector(`.onboarding3`);

    if (currentOnboarding === 1) {
      $onboarding2.classList.add(`hidden`);
      $onboarding3.classList.add(`hidden`);
      $onboarding1.classList.remove(`hidden`);
    }

    if (currentOnboarding === 2) {
      $onboarding1.classList.add(`hidden`);
      $onboarding2.classList.remove(`hidden`);
      $onboarding3.classList.add(`hidden`);
    }

    if (currentOnboarding === 3) {
      $onboarding2.classList.add(`hidden`);
      $onboarding3.classList.remove(`hidden`);
    }
  };

  const parseUrl = (data, cityData, map, routeId) => {
    //removeAllMapMarkers(map);
    addMarkersToMap(map, data, cityData, routeId);
  };

  const addMarkersToMap = (map, data, cityData, routeId) => {
    //const route = data.response.route;
    const route = cityData.routes[routeId];

    const waypoints = route.waypoints;

    waypoints.map(waypoint => {
      //Get Visited Global Way Points
      const $visitedPoints = document.querySelectorAll(`.visitedPoint`);
      const visitedPointArray = Array.from($visitedPoints);

      let newVisitedArray = []; // eslint-disable-line
      visitedPointArray.map(point => {
        newVisitedArray.push(point.textContent);
      });

      const $visitedPointsEl = document.querySelector(`.visitedPoints`);
      $visitedPointsEl.textContent = ``;

      const visitedPoints = [...new Set(newVisitedArray)]; // eslint-disable-line

      let waypointVisitedArray = []; // eslint-disable-line

      visitedPoints.map(point => {
        const filterPoints = waypoints.find(waypoint => {
          return waypoint.globalId === parseInt(point);
        });

        if (filterPoints === undefined) {
          return;
        } else {
          waypointVisitedArray.push(filterPoints[0]);
        }
      });

      waypointVisitedArray.map(waypoint => {
        waypoint.visited = `yes`;
      });

      //Make Waypoint visible
      const waypointChecked = `./assets/img/waypointdone.png`;
      const waypointUnChecked = `./assets/img/waypointnotdone.png`;

      // Deel van de HERE API
      // const iconChecked = new H.map.Icon(waypointChecked); // eslint-disable-line
      // const iconUnChecked = new H.map.Icon(waypointUnChecked); // eslint-disable-line

      if (waypoint.visited === `no`) {
        // Deel van de HERE API
        // const marker = new H.map.Marker( // eslint-disable-line
        //   { lat: waypoint.geolocation.lat, lng: waypoint.geolocation.lng }, // eslint-disable-line
        //   { icon: iconUnChecked } // eslint-disable-line
        // );
        makeMarker(waypointUnChecked, cityData, routeId, waypoint);
      }

      if (waypoint.visited === `yes`) {
        // Deel van de HERE API
        // const marker = new H.map.Marker( // eslint-disable-line
        //   { lat: waypoint.geolocation.lat, lng: waypoint.geolocation.lng }, // eslint-disable-line
        //   { icon: iconChecked } // eslint-disable-line
        // );
        makeMarker(waypointChecked, cityData, routeId, waypoint);
      }
    });
  };


  const makeMarker = (markerImg, cityData, routeId, waypoint) => {
    // var group = new H.map.Group(); //eslint-disable-line
    const route = cityData.routes[routeId];
    // map.addObject(group);
    // group.addObject(marker);

    //markers.push(marker);

    const marker = document.createElement('div');
    marker.classList.add(`marker`);
    marker.style.left = `${waypoint.marker.left}`;
    marker.style.top = `${waypoint.marker.top}`;
    marker.style.backgroundImage = `url(${markerImg})`;

    map.appendChild(marker);

    const $content = document.querySelector(`.content`);

    const $image = document.querySelector(`.map_img`);
    $image.addEventListener(`click`, () => {
      $content.classList.add(`hidden`);
    });

    marker.addEventListener(`click`, e => {// eslint-disable-line
      const $h1 = document.createElement(`h1`);
      const $p = document.createElement(`p`);
      const $button = document.createElement(`a`);

      $content.classList.remove(`hidden`);

      $content.textContent = ``;
      $content.appendChild($h1);
      $content.appendChild($p);
      $content.appendChild($button);

      $button.classList.add(`detail_content_a`);

      $h1.style.color = route.color1;
      $h1.textContent = waypoint.name;
      $p.textContent = waypoint.description;
      $button.textContent = `Meer info`;

      $button.addEventListener(`click`, () => {
        handleClickMoreInfoButton(waypoint, route);
      });
    });

    // Deel van de HERE API
    // if (cityData) {
    //   marker.addEventListener(`tap`, e => {
    //     const currentMarker = e.target;
    //     const lat = currentMarker.b.lat;
    //     const lng = currentMarker.b.lng;
    //     const clickedWaypoint = findWaypoint(
    //       lat,
    //       lng,
    //       cityData.routes[routeId].waypoints
    //     );

    //     const $h1 = document.createElement(`h1`);
    //     const $p = document.createElement(`p`);
    //     const $button = document.createElement(`button`);

    //     const $content = document.querySelector(`.content`);
    //     $content.textContent = ``;
    //     $content.appendChild($h1);
    //     $content.appendChild($p);
    //     $content.appendChild($button);

    //     $h1.textContent = clickedWaypoint.name;
    //     $p.textContent = clickedWaypoint.description;
    //     $button.textContent = `Meer info`;

    //     // let activeAudio;

    //     map.addEventListener(`tap`, e => {
    //       if (e.target instanceof H.map.Marker) {
    //         // eslint-disable-line
    //         // eslint-disable-line
    //         getClickPosition(e);
    //       } else {
    //         const $content = document.querySelector(`.content`);
    //         $content.classList.add(`hidden`);
    //         //activeAudio.load();
    //       }
    //     });

    //     map.addEventListener(`drag`, () => {
    //       const $content = document.querySelector(`.content`);
    //       $content.classList.add(`hidden`);
    //       //activeAudio.load();
    //     });

    //     $button.addEventListener(`click`, () => {
    //       handleClickMoreInfoButton(clickedWaypoint, route);
    //     });
    //   });
    // }

    // eslint-disable-next-line camelcase
    const $buttons_ar = document.querySelectorAll(`.route_choice_btn`);

    const buttonsArArray = Array.from($buttons_ar);

    buttonsArArray.map(item => {
      item.classList.add(`btn_gradient_${route.id}`);
    });
  };

  const handleClickMoreInfoButton = (waypoint, route) => {
    //Delete content for better performance
    const $existingPage = document.querySelector(`.singleRoutePage`);
    const audio = new Audio(`./assets/audio/${waypoint.globalId}.mp3`);
    $existingPage.classList.add(`hidden`);

    //Create Page above existing content
    const $detailPage = document.querySelector(`.detail_container`);
    const $header = document.createElement(`div`);
    $detailPage.parentElement.parentElement.appendChild($header);
    $header.innerHTML = `<header class="header">
    <img src="././assets/img/stickerlogo.png" alt="Logo van a.r.u.next" width="29" height="47">
      <h1 class="logo_title">a.r.u.next</h1>
    <nav class="navbar">
      <div class="hamburger-menu">
      <div class="line line-1"></div>
      <div class="line line-2"></div>
      <div class="line line-3"></div>
      </div>

      <ul class="nav-list">
      <li class="nav-item nav-item-1"><a class="nav-link" href="index.php?page=routes">Alle tours</a></li>
      <li class="nav-item nav-item-2"><a class="nav-link" href="index.php?page=faq">Instructies & help</a></li>
      <li class="nav-item nav-item-3"><a class="nav-link" href="#">Over NEXT Festival</a></li>
      <li class="nav-item nav-item-4"><a class="nav-link" href="#">Over de Eurometropool</a></li>
      </ul>
      <form method="post">
          <input type="hidden" name="action" value="changeLanguage"/>
          <input type="submit" name="language" class="nav-language" value="nl" />
          <input type="submit" name="language" class="nav-language" value="fr" />
          <input type="submit" name="language" class="nav-language" value="en" class="active"/>
      </form>
    </nav>
    </header>`;
    $header.style.position = `absolute`;
    $header.style.top = `0`;

    hamburger();
    routeDetailCarousel(waypoint);

    $detailPage.classList.remove(`hidden`);
    $detailPage.textContent = ``;
    const $article = document.createElement(`article`);
    const $h1 = document.createElement(`h1`);
    const $button = document.createElement(`button`);

    $detailPage.appendChild($article);
    $article.appendChild($h1);
    // $h1.textContent = waypoint.name;
    $article.appendChild($button);
    $button.classList.add(`back_button`);
    $button.textContent = `< terug`;
    $button.style.backgroundColor = `${route.color1}`;

    $button.addEventListener(`click`, () => {
      audio.pause();

      window.location = `index.php?page=route&id=${getUrlVars()["id"]}&city=${// eslint-disable-line
        getUrlVars()["city"]// eslint-disable-line
        }&cityRouteId=${getUrlVars()["cityRouteId"]}`;// eslint-disable-line
      // $existingPage.classList.remove(`hidden`);
      // $detailPage.classList.add(`hidden`);
    });

    // const $div = document.createElement(`div`);
    // $article.appendChild($div);

    const $detailArticle = document.createElement(`article`);
    $detailArticle.classList.add(`article_detail`);
    $detailPage.appendChild($detailArticle);
    $detailArticle.innerHTML = `<div class="article_detail_top">
      <h1 style="color: ${route.color1}">${waypoint.name}</h1>
      <div class="audio_div"></div>
    </div>
    <hr>
    <div class="article_detail_bottom">
      <p class="detail_description">${waypoint.long_desc}</p>
    </div>`;

    //Audio
    const $audioDiv = document.querySelector(`.audio_div`);
    $audioDiv.innerHTML = `<button class="play">Play</button>
    <button class="pause">Pause</button>
    <button class="restart">Restart</button>`;

    const $playBtn = document.querySelector(`.play`);
    const $pauseBtn = document.querySelector(`.pause`);
    const $restartBtn = document.querySelector(`.restart`);

    $playBtn.addEventListener(`click`, () => {
      audio.play();
    });

    $pauseBtn.addEventListener(`click`, () => {
      audio.pause();
    });

    $restartBtn.addEventListener(`click`, () => {
      audio.load();
      audio.play();
    });
  };

  /*eslint-disable*/
  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }
  /*eslint-enable*/

  //Deel van de HERE API
  // const getClickPosition = e => {
  //   const $content = document.querySelector(`.content`);

  //   const contentStyle = getComputedStyle($content);

  //   const xPosition =
  //     e.currentPointer.viewportX - parseInt(contentStyle.width) / 2;
  //   const yPosition =
  //     e.currentPointer.viewportY - parseInt(contentStyle.height) / 2;

  //   $content.style.top = `${yPosition} px`;
  //   $content.style.left = `${xPosition} px`;

  //   $content.classList.remove(`hidden`);
  // };

  // const findWaypoint = (lat, lng, waypoints) => {
  //   const triggeredWaypoint = waypoints.filter(
  //     waypoint =>
  //       String(waypoint.geolocation.lat).substring(0, 8) ===
  //       String(lat).substring(0, 8)
  //   );
  //   return triggeredWaypoint[0];
  // };

  const parseMaps = data => {
    const cityId = document.querySelector(`.cityId`).textContent;
    const routeId = document.querySelector(`.routeId`).textContent; // eslint-disable-line
    const cityRouteId = document.querySelector(`.cityRouteId`).textContent;
    mapData = data.cities[cityId].maps;

    const $arBtn = document.querySelector(`.arBtn`);
    $arBtn.setAttribute(
      `href`,
      `index.php?page=ar&id=${cityRouteId}&city=${activeCityId}&cityRouteId=${cityRouteId}`
    );

    //Deel van de HERE API
    //const defaultLayers = platform.createDefaultLayers();
    /* eslint-disable*/
    // map = new H.Map(
    //   document.getElementById("map"),
    //   defaultLayers.vector.normal.map,
    //   {
    //     center: { lat: mapData.lat, lng: mapData.lng },
    //     style: "default",
    //     zoom: mapData.zm,
    //     pixelRatio: window.devicePixelRatio || 1
    //   }
    // );

    const $mapImg = document.createElement(`img`);
    map = document.getElementById("map");
    map.appendChild($mapImg);
    $mapImg.setAttribute(`src`, `./assets/img/kortrijk.jpg`);
    $mapImg.classList.add(`map_img`);

    // Deel van de HERE Api
    // const ui = H.ui.UI.createDefault(map, defaultLayers);
    // var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    // /* eslint-enable*/
    // window.addEventListener(`resize`, () => map.getViewPort().resize());

    fetch(data.cities[cityId].routes[cityRouteId].route)
      .then(r => r.json())
      .then(d => parseUrl(d, data.cities[cityId], map, cityRouteId));

    const $map_info = document.querySelector(`.H_imprint`);
    if ($map_info) {
      $map_info.remove();
    }
  };

  init();
}
