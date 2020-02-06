{
  const $page1 = document.querySelector(`.page1`);
  const $page2 = document.querySelector(`.page2`);
  const $page3 = document.querySelector(`.page3`);
  const $page4 = document.querySelector(`.page4`);

  let currentLanguage;
  let activeCityId = 0;
  let unlockedRouteId = [];

  const init = () => {
    const $index = document.querySelector(`.index`);
    if ($index) {
      manageHomePage();

      const startTags = [
        "Start exploring >",
        "Commencez à explorer >",
        "Start met verkennen >"
      ];

      let iPrev = 0;
      const $startBtn = document.querySelector(`.startBtn`);

      setInterval(() => {
        const iNew = iPrev;

        if (iNew === startTags.length - 1) {
          iPrev = 0;
        } else {
          iPrev++;
        }

        $startBtn.textContent = startTags[iNew];
      }, 1500);

      const $body = document.querySelector(`.body`);
      $body.removeAttribute("style");
    }

    const $routePage = document.querySelector(`.routePage`);

    if ($routePage) {
      manageRoutePage();
    }

    const $singleRoutePage = document.querySelector(`.singleRoutePage`);
    if ($singleRoutePage) {
      handleMaps();
      handleAR();
    }

    // fetch(`index.php?page=routes`, {
    //   headers: new Headers({ Accept: 'application/json' }),
    //   method: 'POST',
    //   body: 'sdlfmldsfkmldsfkmldfsk'
    // })
    //   .then(r => r.json())
    //   .then(json => {
    //     console.log(json);
    //   }).catch(err => console.log(err));
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

  const parseCities = data => {
    const city = data.cities[activeCityId];
    const routes = city.routes;

    const $routes = document.querySelector(`.routes`);
    $routes.textContent = ``;

    routes.map(route => {
      createRouteCards(route);
    });

    const $a = document.querySelectorAll(`.route_button`);
    const allA = Array.from($a);

    const $routeIds = document.querySelectorAll(`.routeId`);
    const routeIdArray = Array.from($routeIds);

    routeIdArray.map(routeId => {
      unlockedRouteId.push(routeId.textContent);
      unlockedRouteId.sort();
    });

    console.log(unlockedRouteId);

    for (let i = 0; i < allA.length; i++) {
      // console.log(unlockedRouteIdNew[i]);
      // console.log(allA[i].dataset.id);
      // console.log("");

      if (unlockedRouteId[i] !== undefined) {
        allA[i].setAttribute(`href`, `index.php?page=route&id=${routes[i].id}&city=${activeCityId}&cityRouteId=${i}`);
        allA[i].classList.add(`unlocked`);
        allA[i].classList.remove(`locked`);
        allA[i].textContent = `Start`;
      }

      if (unlockedRouteId[i] === undefined) {
        allA[i].setAttribute(`href`, `#`);
        allA[i].classList.add(`locked`);
        allA[i].classList.remove(`unlocked`);
        allA[i].textContent = `Voer code in >`;
      }

      const $lockedRoutes = document.querySelectorAll(`.locked`);
      const lockedRoutesArray = Array.from($lockedRoutes);
      const $routePage = document.querySelector(`.routePage`);
      lockedRoutesArray.map(lockedRoute => {
        lockedRoute.addEventListener(`click`, e => {
          const $popup = document.querySelector(`.popup_code`);
          $popup.classList.remove(`hidden`);
          $routePage.classList.add(`hidden`);
          showPopupCodeScreen(currentLanguage, $popup);
        });
      });
    }
  };

  const createRouteCards = route => {
    const $routes = document.querySelector(`.routes`);
    const $article = document.createElement(`article`);
    $routes.appendChild($article);
    $article.classList.add(`route`);

    const $h1 = document.createElement(`h1`);
    const $ul = document.createElement(`ul`);
    const $li = document.createElement(`li`);
    const $a = document.createElement(`a`);

    $article.appendChild($h1);
    $article.appendChild($ul);
    $article.appendChild($a);
    $ul.appendChild($li);

    $h1.classList.add(`route_name`);
    $ul.classList.add(`route_parameters`);
    $li.classList.add(`route_parameter`);
    $a.classList.add(`route_button`);

    $a.dataset.id = route.id;

    $h1.textContent = route.name;

    $ul.innerHTML = `<li class="route_parameter">${route.distance}</li>
    <li class="route_parameter">${route.time}</li>
    <li class="route_parameter">${route.waypoints.length} points</li>`;
  };

  const showPopupCodeScreen = (language, $popup) => {
    let codeValue = ``;
    const $a = document.createElement(`a`);

    $popup.innerHTML = `<form>
    <input type="hidden" name="action" value="entercode"/>
    <input type="hidden" name="l" value="nl"/>
    <div class="code_div">
      <input type="text" name="code" class="code" maxlength="5" disabled/>
      <div class="character_btns">
        <button class="char_btn code_btn" type="button">0</button>
        <button class="char_btn code_btn" type="button">1</button>
        <button class="char_btn code_btn" type="button">2</button>
        <button class="char_btn code_btn" type="button">3</button>
        <button class="char_btn code_btn" type="button">4</button>
        <button class="char_btn code_btn" type="button">5</button>
        <button class="char_btn code_btn" type="button">6</button>
        <button class="char_btn code_btn" type="button">7</button>
        <button class="char_btn code_btn" type="button">8</button>
        <button class="char_btn code_btn" type="button">9</button>
        <button class="char_btn code_btn" type="button">S</button>
        <button class="char_btn code_btn" type="button">T</button>
        <button class="char_btn code_btn" type="button">F</button>
        <button class="char_btn code_btn" type="button">K</button>
        <button class="char_btn code_btn" type="button">L</button>
        <button class="char_btn code_btn" type="button">V</button>
        <button class="extra_btn clear_btn code_btn" data-type="clear" type="button">C</button>
        <button class="extra_btn delete_btn code_btn" data-type="remove" type="button"><</button>
      </div>
    </div>
  </form>`;

    const $codeDiv = document.querySelector(`.code_div`);

    $codeDiv.appendChild($a);
    $a.innerHTML = `Unlock nieuwe route!`;

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
          codeValue = codeValue;
        } else {
          codeValue += e.currentTarget.textContent;
        }

        $a.setAttribute(
          `href`,
          `index.php?page=routes&l=nl&code=${codeValue}&action=enternewcode`
        );
        $code.value = codeValue;
      });
    });
  };

  const showCodeScreen = (page, language) => {
    let codeValue = ``;
    const $a = document.createElement(`a`);

    if (language === "dutch") {
      page.innerHTML = `<a class="back_btn">Terug</a>
      <div class="code_content">
    <h1 class="page_title_small">Voer je persoonlijke code<br/>hier in</h1>
    <p class="sub_info">Deze kan je vinden op het door<br/>jou gekozen ticketje</p>
    <form>
      <input type="hidden" name="action" value="entercode"/>
      <input type="hidden" name="l" value="nl"/>
      <div class="code_div">
        <div class="code_input">
        <input type="text" name="code" class="code neumorphism_box" maxlength="5" disabled/>
        <button class="help_btn_code">Hulp nodig?</button>
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

      $codeDiv.appendChild($a);
      $a.classList.add(`page_btn`, `btn_shadow`);
      $a.innerHTML = `Ga verder >`;
    }

    if (language === "french") {
      page.innerHTML = `<a class="back_btn">Retour</a>
      <div class="code_content">
    <h1 class="page_title_small">Entrez votre code personnel</h1>
    <p class="sub_info">Vous le trouverez<br/>au le ticket vous choisisez</p>
    <form>
      <input type="hidden" name="action" value="entercode"/>
      <input type="hidden" name="l" value="nl"/>
      <div class="code_div">
        <div class="code_input">
        <input type="text" name="code" class="code neumorphism_box" maxlength="5" disabled/>
        <button class="help_btn_code">Aider?</button>
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

      $codeDiv.appendChild($a);
      $a.classList.add(`page_btn btn_shadow`);
      $a.innerHTML = `Commencer >`;
    }

    if (language === "english") {
      page.innerHTML = `<a class="back_btn">Back</a>
      <div class="code_content">
    <h1 class="page_title_small">Enter you personal code here</h1>
    <p class="sub_info">You can find the code on the<br/>ticket you've chosen</p>
    <form>
      <input type="hidden" name="action" value="entercode"/>
      <input type="hidden" name="l" value="nl"/>
      <div class="code_div">
        <div class="code_input">
        <input type="text" name="code" class="code neumorphism_box" maxlength="5" disabled/>
        <button class="help_btn_code">Need help?</button>
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

      $codeDiv.appendChild($a);
      $a.classList.add(`page_btn btn_shadow`);
      $a.innerHTML = `Start >`;
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
          codeValue = codeValue;
        } else {
          codeValue += e.currentTarget.textContent;
        }

        $a.setAttribute(`href`, `index.php?page=routes&l=nl&code=${codeValue}`);
        $code.value = codeValue;
      });
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
          $page3.innerHTML = `<a class="back_btn">Terug</a>
          <div class="test_ar_div">
            <h1 class="page_title_small">Test de A.R. Experience</h1>
            <p class="sub_info">Sta je bij de installatie?<br/>Scan het A.R. vlak en kijk wat er gebeurt</p>
            <div class="arscene_div btn_shadow">
              <iframe src="index.php?page=arscene" class="arscene_iframe"></iframe>
            </div>
          </div>
          <a class="page_btn btn_shadow">Voer code in ></a>`;

          openPage4();
          goBackToPage2();
        }

        if (currentLanguage === `french`) {
          $page3.innerHTML = `<a class="back_btn">Retour</a>
          <div class="test_ar_div">
            <h1 class="page_title_small">Teste d'experience A.R.</h1>
            <p class="sub_info">Êtes-vous à l'installation?<br/>Scannez le A.R. à plat et regardez ce qui se passe</p>
            <div class="arscene_div btn_shadow">
              <iframe src="index.php?page=arscene" class="arscene_iframe"></iframe>
            </div>
          </div>
          <a class="page_btn btn_shadow">Entrez le code ></a>`;

          openPage4();
          goBackToPage2();
        }

        if (currentLanguage === `english`) {
          $page3.innerHTML = `<a class="back_btn">Back</a>
          <div class="test_ar_div">
            <h1 class="page_title_small">Test the A.R. Experience</h1>
            <p class="sub_info">Are you next to a installation?<br/>Scan the A.R. image an see what happens</p>
            <div class="arscene_div btn_shadow">
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
    pageBtn.addEventListener(`click`, () => {
      $page3.classList.add(`inactive`);
      $page2.classList.remove(`inactive`);
    });
  };

  const openPage4 = () => {
    const $pageBtn3 = $page3.querySelector(`.page_btn`);
    $pageBtn3.addEventListener(`click`, () => {
      $page3.classList.add(`inactive`);
      $page4.classList.remove(`inactive`);

      if (currentLanguage === `dutch`) {
        showCodeScreen($page4, "dutch");
      }

      if (currentLanguage === `french`) {
        showCodeScreen($page4, "french");
      }

      if (currentLanguage === `english`) {
        showCodeScreen($page4, "english");
      }

      const pageBtn = $page4.querySelector(`.back_btn`);
      pageBtn.addEventListener(`click`, () => {
        $page4.classList.add(`inactive`);
        $page3.classList.remove(`inactive`);
      });
    });
  };

  /*AR*/
  const handleAR = () => {
    //Show AR Screen
    const $arBtn = document.querySelector(`.arBtn`);
    $arBtn.addEventListener(`click`, () => {
      const $pageTitle = document.querySelector(`.page_title`);
      const $content = document.querySelector(`.content`);
      const $map = document.getElementById(`map`);

      $pageTitle.classList.add(`hidden`);
      $content.classList.add(`hidden`);
      $map.classList.add(`hidden`);

      const $arPage = document.querySelector(`.arPage`);
      $arPage.innerHTML = `<div class="arscene_div">
      <iframe src="index.php?page=arscene" class="arscene_iframe"></iframe>
      </div>`;
    });
  };

  /*Routes*/
  let mapData = {};
  let userLocation = {};
  let markers = [];
  let map;

  const platform = new H.service.Platform({
    'apikey': 'Ymzvxu_5jYrtjqdyrlORjoasI2KdTSwzdLZuyNkPH3k'
  });

  const handleMaps = () => {
    fetch("./assets/data/cities.json")
      .then(r => r.json())
      .then(parseMaps);

    setInterval(() => {
      fetchUserLocation();
    }, 100);
  };

  const parseUrl = (data, cityData, map, routeId) => {
    addMarkersToMap(map, data, cityData, routeId);
  };

  const addMarkersToMap = (map, data, cityData, routeId) => {
    const route = data.response.route;

    route.map(routeData => {
      const waypoints = routeData.waypoint;

      //Route met wijzers mee
      const maneuvers = routeData.leg[1].maneuver;

      maneuvers.map(maneuver => {
        console.log(maneuver);
      });

      waypoints.map(waypoint => {
        const marker = new H.map.Marker({ lat: waypoint.originalPosition.latitude, lng: waypoint.originalPosition.longitude });
        map.addObject(marker);

        markers.push(marker);

        marker.addEventListener(`tap`, e => {
          const currentMarker = e.target;
          const lat = currentMarker.b.lat;
          const lng = currentMarker.b.lng;
          const clickedWaypoint = findWaypoint(lat, lng, cityData.routes[routeId].waypoints);

          // const xPos = getClickPosition(e).x;
          // console.log(xPos);

          map.addEventListener('tap', e => {
            if (e.target instanceof H.map.Marker) {
              // Some action. Typically, you want to use the data that you may have referenced
              // in the marker creation code, or get the coordinates. Here we log the data
              getClickPosition(e);
            } else {
              const $content = document.querySelector(`.content`);
              $content.classList.add(`hidden`);
            }
          });

          map.addEventListener(`drag`, e => {
            const $content = document.querySelector(`.content`);
            $content.classList.add(`hidden`);
          });

          const $h1 = document.createElement(`h1`);
          const $p = document.createElement(`p`);
          const $button = document.createElement(`button`);

          const $content = document.querySelector(`.content`);
          $content.textContent = ``;
          $content.appendChild($h1);
          $content.appendChild($p);
          $content.appendChild($button);

          $h1.textContent = clickedWaypoint.name;
          $p.textContent = clickedWaypoint.description;
          $button.textContent = `Meer info`;
          $button.addEventListener(`click`, e => {
            handleClickMoreInfoButton(clickedWaypoint);
          });
        });
      });

      if (userLocation !== ``) {
        setInterval(() => {
          const userMarker = new H.map.Marker({ lat: userLocation.lat, lng: userLocation.lng });
          map.addObject(userMarker);
        }, 1000)
      }
    });
  };

  const handleClickMoreInfoButton = waypoint => {
    console.log(waypoint);
    //Delete content for better performance
    const $existingPage = document.querySelector(`.singleRoutePage`);
    $existingPage.classList.add(`hidden`);

    //Create Page above existing content
    const $detailPage = document.querySelector(`.detailPage`);
    $detailPage.classList.remove(`hidden`);
    $detailPage.textContent = ``;
    const $article = document.createElement(`article`);
    const $h1 = document.createElement(`h1`);
    const $button = document.createElement(`button`);
    $article.classList.add(`detail_page`);


    $detailPage.appendChild($article);
    $article.appendChild($h1);
    $h1.textContent = waypoint.name;
    $article.appendChild($button);
    $button.textContent = `Terug`;
    $button.addEventListener(`click`, e => {
      $existingPage.classList.remove(`hidden`);
      $detailPage.classList.add(`hidden`);
    });
  };

  const getClickPosition = e => {
    const $content = document.querySelector(`.content`);

    const contentStyle = getComputedStyle($content);

    const xPosition = e.currentPointer.viewportX - (parseInt(contentStyle.width) / 2);
    const yPosition = e.currentPointer.viewportY - (parseInt(contentStyle.height) / 2);

    $content.style.top = `${yPosition}px`;
    $content.style.left = `${xPosition}px`;

    $content.classList.remove(`hidden`);
  };

  const findWaypoint = (lat, lng, waypoints) => {
    const triggeredWaypoint = waypoints.filter(waypoint => String(waypoint.geolocation.lat).substring(0, 8) === String(lat).substring(0, 8));
    return triggeredWaypoint[0];
  };

  const parseMaps = data => {
    const cityId = document.querySelector(`.cityId`).textContent;
    const routeId = document.querySelector(`.routeId`).textContent;
    const cityRouteId = document.querySelector(`.cityRouteId`).textContent;
    mapData = data.cities[cityId].maps;

    const defaultLayers = platform.createDefaultLayers();

    map = new H.Map(document.getElementById('map'),
      defaultLayers.vector.normal.map, {
      center: { lat: mapData.lat, lng: mapData.lng },
      style: "default",
      zoom: mapData.zm,
      pixelRatio: window.devicePixelRatio || 1
    });

    const ui = H.ui.UI.createDefault(map, defaultLayers);
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    window.addEventListener('resize', () => map.getViewPort().resize());
    console.log(cityRouteId);
    console.log(data.cities[cityId]);

    fetch(data.cities[cityId].routes[cityRouteId].route)
      .then(r => r.json())
      .then(d => parseUrl(d, data.cities[cityId], map, cityRouteId));
  };

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (location) {
      userLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        acc: location.coords.accuracy
      };
    });
  };

  init();
}
