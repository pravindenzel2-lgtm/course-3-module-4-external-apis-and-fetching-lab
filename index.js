const weatherApi = "https://api.weather.gov/alerts/active?area=";

document.addEventListener("DOMContentLoaded", () => {
  const stateInput = document.getElementById("state-input");
  const fetchButton = document.getElementById("fetch-alerts");
  const alertsDisplay = document.getElementById("alerts-display");
  const errorMessage = document.getElementById("error-message");

  async function fetchWeatherAlerts(state) {
    const response = await fetch(`${weatherApi}${state}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather alerts: ${response.status}`);
    }

    return await response.json();
  }

  function displayAlerts(data) {
    alertsDisplay.innerHTML = "";

    const features = data.features || [];

    const summary = document.createElement("h2");
    summary.textContent = `${data.title}: ${features.length}`;
    alertsDisplay.append(summary);

    features.forEach((alert) => {
      const headline = document.createElement("p");
      headline.textContent = alert.properties.headline;
      alertsDisplay.append(headline);
    });
  }

  function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    errorMessage.classList.add("error");
  }

  fetchButton.addEventListener("click", async () => {
    const state = stateInput.value.trim().toUpperCase();

    alertsDisplay.innerHTML = "";
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    stateInput.value = "";

    if (!/^[A-Z]{2}$/.test(state)) {
      displayError("Please enter a valid two-letter state abbreviation.");
      return;
    }

    try {
      const data = await fetchWeatherAlerts(state);
      displayAlerts(data);

      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
    } catch (error) {
      displayError(error.message);
    }
  });
});