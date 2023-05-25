function getSpecificArtPiece(objectNumber) {
  return fetch(`https://www.rijksmuseum.nl/api/en/collection/${objectNumber}?key=iP2jbeZV`)
    .then(response => response.json())
    .then(data => {
      const description = data.artObject.description;
      return description;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function getListOfArtist(nameOfArtist) {
  try {
    const response = await fetch(`https://www.rijksmuseum.nl/api/nl/collection?key=iP2jbeZV&involvedMaker=${nameOfArtist}&ps=50`);
    const data = await response.json();
    let tbody = document.getElementById('artwork-table-body');
    tbody.innerHTML = '';

    for (let i = 0; i < data.artObjects.length; i++) {
      if (data.artObjects[i].principalOrFirstMaker === nameOfArtist) {
        let createDiv = document.createElement('div');
        tbody.appendChild(createDiv);
        createDiv.className = 'backgroundArtDiv'
        let createTitle = document.createElement('h2');
        createTitle.innerHTML = data.artObjects[i].title;
        createDiv.appendChild(createTitle);
        let image = document.createElement('img');
        image.className = 'artImage'
        image.src = data.artObjects[i].webImage.url;
        createDiv.appendChild(image);
        let createImgInfoDiv = document.createElement('div');

        if (data.artObjects[i].productionPlaces[0] !== undefined) {
          const description = await getSpecificArtPiece(data.artObjects[i].objectNumber);
          createImgInfoDiv.innerHTML =
            `<h4>Artiest : ${data.artObjects[i].principalOrFirstMaker} <br> <br> 
        Volledige titel : ${data.artObjects[i].longTitle} <br> <br> 
        Beschrijving : ${description} <br> <br> 
        Plaats van productie : ${data.artObjects[i].productionPlaces[0]}</h4> 
        <a href="${data.artObjects[i].links.web}">Link naar Rijksmuseum</a>`;
        } else {
          const description = await getSpecificArtPiece(data.artObjects[i].objectNumber);
          createImgInfoDiv.innerHTML = `
        <h4>Artiest : ${data.artObjects[i].principalOrFirstMaker} <br> <br> 
        Volledige titel : ${data.artObjects[i].longTitle} <br> <br> 
        Beschrijving : ${description} <br> <br> 
        Plaats van productie : Onbekend</h4>
        <h4> <a href="${data.artObjects[i].links.web}">Link naar Rijksmuseum</a> </h4>`;
        }

        createDiv.appendChild(createImgInfoDiv);
      }
    }
  } catch (error) {
    console.log('rejected', error);
  }
}

window.onload = function () {
  let searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', function () {
    getListOfArtist(document.getElementById('artistDropdown').value);
  });
};