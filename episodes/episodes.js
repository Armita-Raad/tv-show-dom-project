document.addEventListener("DOMContentLoaded", async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const seriesId = queryParams.get("seriesId");
  if (seriesId) {
    const episodes = await getEpisodes(seriesId);
    displayEpisodes(episodes);
    populateDropdown(episodes);
  } else {
    console.log("series id not valid");
  }
});
const getEpisodes = async (seriesId) => {
  try {
    const response = await axios.get(
      `https://api.tvmaze.com/shows/${seriesId}/episodes`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
const displayEpisodes = (episodes) => {
  const episodeContainer = document.querySelector(".episodes");
  episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    episodeContainer.append(episodeCard);
  });
};
const createEpisodeCard = (episode) => {
  const card = document.createElement("div");
  card.classList.add("episode-card");
  card.id = episode.id;

  const image = document.createElement("img");
  image.src = episode.image.medium;

  const p = document.createElement("p");
  p.textContent = `S${formatNumber(episode.season)}-E${formatNumber(
    episode.number
  )} ${episode.name}`;

  const link = document.createElement("a");
  link.href = episode.url;

  const div = document.createElement("div");
  div.classList.add("icon-div");
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-play");
  div.append(icon);
  link.append(div);

  const exceptImage = document.createElement("div");
  exceptImage.classList.add("except-image");
  exceptImage.append(p, link);

  const summaryParagraph = document.createElement("div");
  summaryParagraph.classList.add("episode-summary");
  summaryParagraph.innerHTML = episode.summary;
  summaryParagraph.style.display = "none";
  exceptImage.append(summaryParagraph);

  // Add event listeners for mouseover and mouseout
  exceptImage.addEventListener("mouseover", () => {
    summaryParagraph.style.display = "block";
  });

  exceptImage.addEventListener("mouseout", () => {
    summaryParagraph.style.display = "none";
  });

  card.append(image, exceptImage);
  return card;
};
const formatNumber = (number) => {
  if (number < 10) {
    return `0${number}`;
  } else {
    return number;
  }
};
const populateDropdown = (episodes) => {
  const dropdown = document.querySelector('select[name="ep"]');
  dropdown.innerHTML = "<option>All Episodes</option>";
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${formatNumber(episode.season)}-E${formatNumber(
      episode.number
    )} ${episode.name}`;
    dropdown.append(option);
  });

  dropdown.addEventListener("change", handleEpisodeSelection);
};

// handling if all the episodes have to be shown or only one episode
const handleEpisodeSelection = () => {
  const dropdown = document.querySelector('select[name="ep"]');
  const selectedValue = dropdown.value;
  if (selectedValue === "All Episodes") {
    displayAllEpisodes();
  } else {
    displaySelectedEpisode(selectedValue);
  }
};

// function to display all episodes
const displayAllEpisodes = () => {
  const cards = document.querySelectorAll(".episode-card");
  cards.forEach((card) => {
    card.style.display = "block";
  });
};

// Function to display the selected episode
const displaySelectedEpisode = (selectedValue) => {
  const cards = document.querySelectorAll(".episode-card");
  cards.forEach((card) => {
    const cardId = card.id;
    if (cardId === selectedValue) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};
