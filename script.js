let initialGDP, initialUnemployment, initialInflation;
let realGDP, unemployment, inflation;
let iteration = 0;
let R;
let resultObj;
let results = [];
// Track selected buttons for each input
let selectedButtons = {};
// Store fixed values based on button clicks
let inputValues = {};

// Attach event listeners for dropdowns
document
  .getElementById("policyType")
  .addEventListener("change", updateGameVisibility);
document
  .getElementById("economicCondition")
  .addEventListener("change", updateGameVisibility);

function updateGameVisibility() {
  const policyType = document.getElementById("policyType").value;
  const economicCondition = document.getElementById("economicCondition").value;

  if (policyType) {
    if (economicCondition) {
      generateInitialValues(economicCondition);
      displayInitialValues();
      setupPolicyInputs(policyType);

      const progressBar = document.getElementById("progressBarFill");
      progressBar.style.width = "0%";
      //   progressBar.textContent = "";
      //   document.getElementById("iterationCount").textContent = "0";
    } else {
      resetEconomicValues();
    }
  } else {
    resetGame();
  }
}

function resetEconomicValues() {
  document.getElementById("initialValues").style.display = "none";
  document.getElementById("gameInputs").style.display = "none";
  document.getElementById("gameOutputs").style.display = "none";
  document.getElementById("buttons").style.display = "none";
}

function generateInitialValues(economicCondition) {
  R = Math.floor(Math.random() * 6) + 1;
  // console.log(R);
  if (economicCondition === "recession") {
    initialGDP = (Math.random() * 2 - 3).toFixed(2);
    initialUnemployment = (Math.random() * 14 + 10).toFixed(2);
    initialInflation = (Math.random() * 9 - 9).toFixed(2);
  } else if (economicCondition === "inflation") {
    initialGDP = (Math.random() * 15 + 5).toFixed(2);
    initialUnemployment = (Math.random() * 3).toFixed(2);
    initialInflation = (Math.random() * 13 + 7).toFixed(2);
  } else if (economicCondition === "hyperinflation") {
    initialGDP = (Math.random() * 50 + 50).toFixed(2);
    initialUnemployment = 0;
    initialInflation = (Math.random() * 300 + 500).toFixed(2);
  }

  if (results.length === 0) {
    resultObj = {
      Year: 0,
      GDP: initialGDP,
      Unemployment: initialUnemployment,
      Inflation: initialInflation,
    };

    results.push(resultObj);
    UpdateTable();

    console.log(results);
  }
}

function displayInitialValues() {
  document.getElementById("initialGDP").textContent = initialGDP;
  document.getElementById("initialUnemployment").textContent =
    initialUnemployment;
  document.getElementById("initialInflation").textContent = initialInflation;
  document.getElementById("initialValues").style.display = "block";
  document.getElementById("gameInputs").style.display = "block";
  document.getElementById("buttons").style.display = "flex";
  document.getElementById("progress").style.display = "block";
  document.getElementById("gameOutputs").style.display = "none";
}

function setupPolicyInputs(policyType) {
  const gameInputsContainer = document.getElementById("gameInputs");
  gameInputsContainer.innerHTML = "";

  let inputsHTML = "";

  if (policyType === "monetary" || policyType === "both") {
    inputsHTML += `
      <label for="discountRate">Discount Rate (%):</label>
      <div class="toggle-container">
          <input  type="number" id="discountRate" step="0.01" min="0" />
          <div class="button-container">
            <button class="toggle-button" onclick="toggleButton('discountRate', 1, this)">+</button>
            <button class="toggle-button" onclick="toggleButton('discountRate', -1, this)">-</button>
          </div>
      </div>
      <label for="reserveRequirement">Reserve Requirement (%):</label>
      <div class="toggle-container">
          <input type="number" id="reserveRequirement" step="1" min="0" />
          <div class="button-container">
            <button class="toggle-button" onclick="toggleButton('reserveRequirement', 1, this)">+</button>
            <button class="toggle-button" onclick="toggleButton('reserveRequirement', -1, this)">-</button>
          </div> </div>
       <label for="marketOperation">Open Market Operations (%):</label>
      <div class="toggle-container">
          <input type="number" id="marketOperation" min="0" step="1" />
          <div class="button-container">
            <button class="toggle-button" onclick="toggleButton('marketOperation', 1, this)">Buy</button>
            <button class="toggle-button" onclick="toggleButton('marketOperation', -1, this)">Sell</button>
          </div> </div>
    `;
  }
  if (policyType === "fiscal" || policyType === "both") {
    inputsHTML += `
     
      <label for="taxChange">Tax Change (%):</label>
      <div class="toggle-container">
          <input type="number" id="taxChange" min="0" step="0.01" />
          <div class="button-container">
            <button class="toggle-button" onclick="toggleButton('taxChange', 1, this)">+</button>
            <button class="toggle-button" onclick="toggleButton('taxChange', -1, this)">-</button>
          </div>  </div>
      <label for="govSpending">Government Spending (%):</label>
      <div class="toggle-container">
          <input type="number" id="govSpending" step="1" min="0" />
          <div class="button-container">
            <button class="toggle-button" onclick="toggleButton('govSpending', 1, this)">+</button>
            <button class="toggle-button" onclick="toggleButton('govSpending', -1, this)">-</button>
          </div>  </div>
    `;
  }

  gameInputsContainer.innerHTML = inputsHTML;

  // Restore previously selected button colors and input values after refreshing the UI
  Object.keys(selectedButtons).forEach((inputId) => {
    const selectedButton = selectedButtons[inputId];
    if (selectedButton) {
      selectedButton.style.backgroundColor =
        selectedButton.value > 0 ? "blue" : "red";
    }
    if (inputValues[inputId] !== undefined) {
      document.getElementById(inputId).value = Math.abs(inputValues[inputId]);
    }
  });
}
function getInputValue(id) {
  if (selectedButtons[id]) {
    // Return the internally stored value (positive or negative based on button)
    return inputValues[id];
  } else {
    // If no button is selected, treat it as a positive number
    const input = document.getElementById(id);
    return Math.abs(parseFloat(input.value) || 0); // Default to positive value
  }
}

function toggleButton(id, value, button) {
  const input = document.getElementById(id);

  let currentValue = parseFloat(input.value) || 0;

  if (selectedButtons[id] !== button) {
    // Apply the corresponding sign (+ or -) to the current value
    inputValues[id] =
      value > 0 ? Math.abs(currentValue) : -Math.abs(currentValue);
  }

  if (selectedButtons[id]) {
    selectedButtons[id].style.backgroundColor = ""; // Reset the color of the previously selected button
  }
  selectedButtons[id] = button; // Track the currently selected button
  button.style.backgroundColor = value > 0 ? "blue" : "red"; // Blue for +, Red for -

  input.value = Math.abs(inputValues[id]); // Keep the input value always positive
}

function playGame() {
  initialGDP = realGDP || initialGDP;
  initialUnemployment = unemployment || initialUnemployment;
  initialInflation = inflation || initialInflation;

  displayInitialValues();
  // console.log(initialGDP, initialUnemployment, initialInflation);

  const discountRate = inputValues["discountRate"] || 0;
  const reserveRequirement = inputValues["reserveRequirement"] || 0;
  const marketOperation = inputValues["marketOperation"] || 0;
  const taxChange = inputValues["taxChange"] || 0;
  const govSpending = inputValues["govSpending"] || 0;

  realGDP = (
    initialGDP -
    discountRate / (3 * R) -
    reserveRequirement / (2.1 * R) +
    marketOperation / (1.6 * R) -
    taxChange / (4 * R) +
    govSpending / (2.6 * R)
  ).toFixed(2);

  unemployment = (
    parseFloat(initialUnemployment) +
    discountRate / (2 * R) +
    reserveRequirement / (2.2 * R) -
    marketOperation / (1.8 * R) +
    taxChange / (4.1 * R) -
    govSpending / (2.8 * R)
  ).toFixed(2);

  inflation = (
    initialInflation -
    discountRate / (4 * R) +
    reserveRequirement / (1.9 * R) +
    marketOperation / (1.5 * R) -
    taxChange / (2.1 * R) +
    govSpending / (1.9 * R)
  ).toFixed(2);

  if (isNaN(unemployment)) {
    unemployment = 0;
  }

  document.getElementById("outputGDP").textContent = realGDP;
  document.getElementById("outputUnemployment").textContent = unemployment;
  document.getElementById("outputInflation").textContent = inflation;
  document.getElementById("gameOutputs").style.display = "block";

  iteration++;

  // show all results

  resultObj = {
    Year: iteration,
    GDP: realGDP,
    Unemployment: unemployment,
    Inflation: inflation,
  };

  results.push(resultObj);
  UpdateTable();

  // console.log(results);

  // update all results on browser

  updateProgress();

  setTimeout(() => {
    // Check for winning criteria or update this to your own criteria
    if (realGDP > 2 && unemployment < 4 && inflation > 0 && inflation < 3) {
      alertt("Congratulations! You've Stabilized the Economy!");
      document.getElementById("submitButton").disabled = true;
      document.getElementById("outputGDP2").textContent = realGDP;
      document.getElementById("outputUnemployment2").textContent = unemployment;
      document.getElementById("outputInflation2").textContent = inflation;

      /*  resetGame(); // Reset game after win */
      return;
    }
    // Check if years are complete

    if (iteration >= 10) {
      alertt();
      // disable submit btn
      document.getElementById("submitButton").disabled = true;
      document.getElementById("outputGDP2").textContent = realGDP;
      document.getElementById("outputUnemployment2").textContent = unemployment;
      document.getElementById("outputInflation2").textContent = inflation;
      // document.getElementById("gameOutputs").style.display = "block";

      //   resetGame();
      //   resetGame(); // Reset game after alert
    }
  }, 200);
}

function updateProgress() {
  const progressBar = document.getElementById("progressBarFill");
  const iterationCount = document.getElementById("iterationCount");

  progressBar.style.width = (iteration * 10).toString() + "%";
  //   progressBar.textContent = (iteration * 10).toString() + "%";
  iterationCount.textContent = iteration;
}

function resetGame() {
  document.getElementById("policyType").value = "";
  document.getElementById("economicCondition").value = "";
  document.getElementById("initialValues").style.display = "none";
  document.getElementById("gameInputs").style.display = "none";
  document.getElementById("buttons").style.display = "none";
  document.getElementById("progress").style.display = "none";
  document.getElementById("gameOutputs").style.display = "none";
  iteration = 0;
  selectedButtons = {}; // Clear selected buttons on reset
  inputValues = {}; // Clear fixed input values on reset
  // clear progress bar
  const iterationCount = document.getElementById("iterationCount");
  iterationCount.textContent = iteration;

  //reset stored values
  results = [];
  document.getElementById("resultTable").classList.remove("result-container");

  UpdateTable();

  // remove overlay and alert on reset
  const alertOverlay = document.getElementById("customAlertOverlay");
  const alertMessage = document.getElementById("alertMessage");

  // Set the custom message in the alert
  //   alertMessage.textContent = message;

  // Display the custom alert
  alertOverlay.style.display = "none";

  // Enable the submit button
  document.getElementById("submitButton").disabled = false;
}
// Function to trigger the custom alert with a message (Game Over or You Win)
function alertt(message) {
  const alertOverlay = document.getElementById("customAlertOverlay");
  const alertMessage = document.getElementById("alertMessage");

  // reset btn below progress bar
  document.getElementById("submitButton").disabled = true;
  document.getElementById("outputGDP2").textContent = realGDP;
  document.getElementById("outputUnemployment2").textContent = unemployment;
  document.getElementById("outputInflation2").textContent = inflation;

  // Set the custom message in the alert
  alertMessage.textContent = message;

  // Display the custom alert
  alertOverlay.style.display = "flex";
}

// Function to reset the game

// Function to update the table dynamically
// Initial array with objects

// Function to update the table dynamically

function UpdateTable() {
  const tableContainer = document.getElementById("dynamic-table");
  tableContainer.innerHTML = ""; // Clear any existing content

  // Check if there is any results in the array
  if (results.length > 0) {
    document.getElementById("resultTable").classList.add("result-container");
    // Create the header row (keys of the first object)
    const headerRow = document.createElement("div");
    headerRow.classList.add("result-row", "header-row");
    Object.keys(results[0]).forEach((key) => {
      const headerCell = document.createElement("div");
      headerCell.textContent = key;
      headerCell.classList.add("result-cell", "hcell");
      headerRow.appendChild(headerCell);
    });
    tableContainer.appendChild(headerRow);

    // Create rows for the results
    results.forEach((item) => {
      const row = document.createElement("div");
      row.classList.add("result-row");
      Object.values(item).forEach((value) => {
        const cell = document.createElement("div");
        cell.textContent = value;
        cell.classList.add("result-cell");
        row.appendChild(cell);
      });
      tableContainer.appendChild(row);
    });
  }
}

// Call UpdateTable initially to populate the table

// Call UpdateTable initially to populate the table
