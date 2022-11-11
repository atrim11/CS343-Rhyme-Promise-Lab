// const query = "hello";

const searchBoxElem = document.getElementById("query");
const resultsContainerElem = document.getElementById("results");

// when someone presses enter in the search box,
searchBoxElem.addEventListener("keydown", whenSomeKeyPressed);

async function whenSomeKeyPressed(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const rhymes = await searchForRhymes(searchBoxElem.value);
    const rhymeResultsElems = -1; // await createRhymeElements(rhymes);
    if (rhymes.length > 0) {
      clearResultsElem();
      rhymeResultsElems = await createRhymeElements(rhymes);
      if (rhymeResultsElems.length > 0) {
        populateResultsElem(rhymeResultsElems);
      }
    }
    // const rhymeElements = await createRhymeElements(rhymes);
    // console.log(rhymeElements !== undefined);

    // if (rhymeElements == undefined) {
    //   console.log("in if");
    //   clearResultsElem();
    //   populateResultsElem(rhymeElements);
    // }
    // clearResultsElem();
    // populateResultsElem(rhymeElements);
  }
}

function searchForRhymes(query) {
  const rhymeResults = fetch(
    `https://rhymebrain.com/talk?function=getRhymes&word=${query}`
  )
    .then(function (responseFromEndpoint) {
      console.log(responseFromEndpoint);
      return responseFromEndpoint.json();
    })
    .then(function (rhymeResultsJson) {
      const truncatedTo10 = rhymeResultsJson.slice(0, 10);
      console.log(truncatedTo10);
      return truncatedTo10;
    }).then(function (truncatedTo10) {
      return truncatedTo10;
    });
  return rhymeResults;
}

function createRhymeElements(rhymeResultsJson) {
  const wordInfos = getWordsInfos(rhymeResultsJson)
    .then(function (wordInfos) {
      const rhymeResultsElems = rhymeResultsJson.map((rhymeWord, i) => {
        let resultElem = document.createElement("div");
        resultElem.classList.add("result");
        resultElem.dataset.score = rhymeWord.score;
        resultElem.append(rhymeWord.word);
        resultElem.append(createWordInfoElements(wordInfos[i]));
        resultElem = styleRhymeResult(resultElem);
        return rhymeResultsElems;
      });
      return rhymeResultsElems;
    })
    .then(function (rhymeResultsElems) {
      return rhymeResultsElems;
    });
  return wordInfos;

  // return rhymeResultsJson.map((rhymeWord, i) => {
  //   let resultElem = document.createElement("div");
  //   resultElem.classList.add("result");
  //   resultElem.dataset.score = rhymeWord.score;
  //   resultElem.append(rhymeWord.word);
  //   resultElem.append(createWordInfoElements(wordInfos[i]));
  //   resultElem = styleRhymeResult(resultElem);
  //   return resultElem;
}

function getWordsInfos(rhymes) {
  const wordsInfos = Promise.all(
    rhymes.map(async (rhyme) => {
      const wordInfo = fetch(
        `https://rhymebrain.com/talk?function=getWordInfo&word=${rhyme.word}`
        // "example-rhyme-results.json"
      )
        .then(function (wordInfoEnd) {
          return wordInfoEnd.json();
        })
        .then(function (wordInfoJson) {
          return wordInfoJson;
        });
      return wordInfo;
    })
  ).then(function (wordsInfos) {
    return wordsInfos;
  });
  return wordsInfos;
}

function createWordInfoElements(wordInfo) {
  const wordInfoElem = document.createElement("dl");
  for (const [key, value] of Object.entries(wordInfo)) {
    const dt = document.createElement("dt");
    dt.append(key);
    const dd = document.createElement("dd");
    dd.append(value);
    wordInfoElem.append(dt);
    wordInfoElem.append(dd);
  }
  return wordInfoElem;
}

function styleRhymeResult(resultElem) {
  const styledResult = resultElem;
  const resultScore = parseInt(resultElem.dataset.score, 10);
  styledResult.style.fontSize = `${0.5 + (3.5 * resultScore) / 300}rem`;
  return styledResult;
}

function clearResultsElem() {
  Array.from(resultsContainerElem.childNodes).forEach((child) => {
    child.remove();
  });
}

function populateResultsElem(rhymeResultsElems) {
  resultsContainerElem.append(rhymeResultsElems);
}
