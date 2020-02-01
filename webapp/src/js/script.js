{
  const $page1 = document.querySelector(`.page1`);
  const $page2 = document.querySelector(`.page2`);
  const $page3 = document.querySelector(`.page3`);
  const $page4 = document.querySelector(`.page4`);

  let currentLanguage;

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
          <h1>Test de A.R. Experience</h1>
          <p class="sub_info">Sta je bij de installatie?<br/>Scan het A.R. vlak en kijk wat er gebeurt</p>
          <div></div>
          <a class="page_btn">Voer de code in</a>`;

          openPage4();
          goBackToPage2();
        }

        if (currentLanguage === `french`) {
          $page3.innerHTML = `<a class="back_btn">Retour</a>
          <h1>Teste d'experience A.R.</h1>
          <p class="sub_info">Êtes-vous à l'installation?<br/>Scannez le A.R. à plat et regardez ce qui se passe</p>
          <div></div>
          <a class="page_btn">Entrez le code</a>`;

          openPage4();
          goBackToPage2();
        }

        if (currentLanguage === `english`) {
          $page3.innerHTML = `<a class="back_btn">Back</a>
          <h1>Test the A.R. Experience</h1>
          <p class="sub_info">Are you next to a installation?<br/>Scan the A.R. image an see what happens</p>
          <div></div>
          <a class="page_btn">Enter your code</a>`;
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
        $page4.innerHTML = `<a class="back_btn">Terug</a>
      <h1>Voer je persoonlijke code<br/>hier in</h1>
      <p class="sub_info">Deze kan je vinden op het<br/>door jou gekozen ticketje</p>
      <a href="index.php?page=routes&l=nl" class="page_btn">Start!</a>`;
      }

      if (currentLanguage === `french`) {
        $page4.innerHTML = `<a class="back_btn">Retour</a>
      <h1>Entrez votre code personnel<br/>ici</h1>
      <p class="sub_info">Vous pouvez le trouver dessus<br/>billet choisi par vous</p>
      <a href="index.php?page=routes&l=fr" class="page_btn">Allons-y!</a>`;
      }

      if (currentLanguage === `english`) {
        $page4.innerHTML = `<a class="back_btn">Back</a>
      <h1>Enter your personal code here</h1>
      <p class="sub_info">You can find it on<br/>the ticket you've chosen</p>
      <a href="index.php?page=routes&l=en" class="page_btn">Lets go!</a>`;
      }

      const pageBtn = $page4.querySelector(`.back_btn`);
      pageBtn.addEventListener(`click`, () => {
        $page4.classList.add(`inactive`);
        $page3.classList.remove(`inactive`);
      });
    });


  };

  const init = () => {
    const $index = document.querySelector(`.index`);
    if ($index) {
      manageHomePage();
    }
  };

  init();
}
