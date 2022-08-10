import { filmsMock } from "./filmsMock.js";

// ==============================
const ALL_FILMS = "all_films";
const FAVOURITE_FILMS = "favourite_films";
// ==============================

// Инициализация localStorage:

if (!fromStorage(ALL_FILMS) && !fromStorage(FAVOURITE_FILMS)) {
    toStorage(ALL_FILMS, filmsMock);
    toStorage(FAVOURITE_FILMS, []);
}

// Рисуем список фильмов ========
const storagedFilms = fromStorage(ALL_FILMS);
renderFilmList(storagedFilms, ALL_FILMS);

// Логика переключения разделов, Все фильмы/Избранные фильмы
const favouriteFilmsBtn = document.querySelector(".film-cards-container__favourite-films");
favouriteFilmsBtn.addEventListener("click", () => handleFilmsListSwitch(favouriteFilmsBtn))

function toStorage (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function fromStorage (key) {
    return JSON.parse(localStorage.getItem(key));
}

// Функция рендера списка фильмов

function renderFilmList(filmList, listType ) {
    const favouriteFilmsBtnHTML = document.querySelector(".film-cards-container__favourite-films");
    favouriteFilmsBtnHTML.insertAdjacentHTML(
        "afterend",
        `<div id="${listType}" class="film-cards-container"></div>`
    );

    const filmsContainer = document.querySelector(".film-cards-container");
    // Рисуем список фильмов
    if (filmList.length) {
        filmList.forEach((film) => renderFilmCard(film, filmsContainer));
    } else {
        filmsContainer.innerHTML = '<div>Список пуст</div>';
    }

    // Слушатели кликов по кнопке добавления в избранное
    const likeBtns = document.querySelectorAll(".film-card__button");
    likeBtns.forEach((btn, i) =>
        btn.addEventListener("click", () =>
            handleLikeBtnClick(filmList, listType, i)));

    // Слушатели открытия и закрытия модального окна
    const filmsTitles = document.querySelectorAll(".film-card__title");
    filmsTitles.forEach((title, i) =>
        title.addEventListener("click", () => {
            const clickedFilm = filmList[i];
            renderFilmModal(clickedFilm, filmsContainer);

            const closeModalBtn = document.querySelector(".close-modal-icon");
            closeModalBtn.addEventListener("click", () => {
                const modal = document.querySelector(".modal");
                modal.remove();
            },
                { once: true }
            );
    }))
}

// Функция отрисовки карточки фильмов
function renderFilmCard(film, targetContainer) {
    const { imgUrl, movieName, releaseYear, isFavourite } = film;
    const btnImg = isFavourite ? "favourite.png" : "notFavourite.png";

    targetContainer.insertAdjacentHTML(
        "beforeend",
        `<div" class="film-card">
                  <img class="film-card__poster" src="./${imgUrl}" alt="Poster"/>
                  <div class="film-card__title">${movieName}</div>
                  <div class="film-card__year">${releaseYear}</div>
                  <button class="film-card__button">
                      <img class="film-card__button-img" src="./assets/img/${btnImg}" alt="img Favourit"/>              
                  </button>
              </div>`
    );
}

// Функция отрисовки модального окна
function renderFilmModal(clickedFilm, targetContainer) {
    const { imgUrl, movieName, releaseYear, isFavourite, description } = clickedFilm;
    const btnImg = isFavourite ? "favourite.png" : "notFavourite.png";

    targetContainer.insertAdjacentHTML(
        "afterend",
        `<div class="modal">
                  <div class="modal-content">
                      <div class="close-modal">
                          <img class="close-modal-icon" src="./assets/img/cross.png">
                      </div>
                      <img class="film-card__poster" src="${imgUrl}" /> 
                      <div class="film-card__title">${movieName}</div> 
                      <div class="film-card__year">${releaseYear}</div> 
                      <div class="film-card__description">${description}</div>               
                      <button class="film-card__button"></button>
                  </div>
              </div>`
    );
}



// Функция-обработчик для кнопки добавления в избранное

function handleLikeBtnClick(filmList, listType, i) {
    filmList[i].isFavourite = !filmList[i].isFavourite;

    const sortedFilmList = sortByIsFavourite(filmList);
    const sortedFavouriteFilmList = sortFavouriteFilms(sortedFilmList);

    const filmsListContainer = document.getElementById(listType);

    switch (listType) {
        case ALL_FILMS:
            toStorage(ALL_FILMS, sortedFilmList);
            toStorage(FAVOURITE_FILMS, sortedFavouriteFilmList);
            filmsListContainer.remove();
            renderFilmList(sortedFilmList, listType);
            return;
        case FAVOURITE_FILMS:
            const newFilmsList = fromStorage(ALL_FILMS);
            newFilmsList[i].isFavourite = !newFilmsList[i].isFavourite;
            toStorage(ALL_FILMS, sortByIsFavourite(newFilmsList));
            toStorage(FAVOURITE_FILMS, sortedFavouriteFilmList);
            filmsListContainer.remove();
            renderFilmList(sortedFavouriteFilmList, listType);
            return;
        default:
            return;
    }
}

// Функция сортировки

function sortByIsFavourite(films) {
    return films
        .sort((a, b) => a.id - b.id)
        .sort((a) => (a.isFavourite ? -1 : 1));
}

// Функция сортировки по флагу
function sortFavouriteFilms (films) {
    return films
        .filter((film) => film.isFavourite)
        .sort((a, b) => b.id - a.id)
}

// Функция переключения списков
function handleFilmsListSwitch (switcherBtn) {
    const filmsContainer = document.querySelector(".film-cards-container");
    const filmsCardContainerTitle = document.querySelector(".film-card-container__title");

    switch (filmsContainer.id) {
        case ALL_FILMS:
            filmsContainer.remove();
            filmsCardContainerTitle.innerHTML = "Favourite Films";
            switcherBtn.innerHTML = "See All Films";
            renderFilmList(fromStorage(FAVOURITE_FILMS), FAVOURITE_FILMS);
            return;
        case FAVOURITE_FILMS:
            filmsContainer.remove();
            filmsCardContainerTitle.innerHTML = "All Films";
            switcherBtn.innerHTML = "See Favourite Films";
            renderFilmList(fromStorage(ALL_FILMS), ALL_FILMS);
            return;
        default:
            return;
    }


}