let words = [];
fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    words = data.split('\n').map(word => word.trim().toLowerCase());
    console.log('Word list loaded successfully!');
  })
  .catch(error => {
    console.error('Error loading word list:', error);
  });

function findMatchingWords(pattern, isContainsMode = false) {
  if (isContainsMode) {
    return words.filter(word => word.includes(pattern));
  } else {
    return words.filter(word => {
      const regexPattern = pattern
        .replace(/_/g, '.')
        .replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(word);
    });
  }
}

function findAndDisplayWords() {
  const wordInput = document.getElementById('wordInput').value.toLowerCase();
  const containsMode = document.getElementById('containsMode').checked;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  
  if (!wordInput) {
    resultsDiv.textContent = 'Please enter a word pattern.';
    return;
  }
  
  if (!containsMode && (!wordInput.includes('_') && !wordInput.includes('*'))) {
    resultsDiv.textContent = 'In pattern mode, please use underscores (_) or asterisks (*).';
    return;
  }
  
  const matchingWords = findMatchingWords(wordInput, containsMode);
  
  if (matchingWords.length === 0) {
    resultsDiv.textContent = 'No matching words found.';
  } else {
    matchingWords.sort();
    
    resultsDiv.textContent = `Found ${matchingWords.length} ${containsMode ? 'words containing "' + wordInput + '"' : 'matching words'}:`;
    
    if (matchingWords.length > 100) {
      createPaginatedDisplay(matchingWords, resultsDiv);
    } else {
      const wordList = document.createElement('ul');
      matchingWords.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        wordList.appendChild(listItem);
      });
      resultsDiv.appendChild(wordList);
    }
  }
}

function createPaginatedDisplay(words, container) {
  const wordsPerPage = 50;
  let currentPage = 1;
  const totalPages = Math.ceil(words.length / wordsPerPage);
  
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination';
  
  const pageInfo = document.createElement('span');
  pageInfo.id = 'pageInfo';
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationDiv.appendChild(pageInfo);
  
  const prevButton = document.createElement('button');
  prevButton.textContent = '← Previous';
  prevButton.disabled = true;
  
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next →';
  nextButton.disabled = totalPages <= 1;
  
  const wordListContainer = document.createElement('div');
  wordListContainer.id = 'wordListContainer';
  
  function displayCurrentPage() {
    const start = (currentPage - 1) * wordsPerPage;
    const end = Math.min(start + wordsPerPage, words.length);
    const currentWords = words.slice(start, end);
    
    wordListContainer.innerHTML = '';
    const wordList = document.createElement('ul');
    currentWords.forEach(word => {
      const listItem = document.createElement('li');
      listItem.textContent = word;
      wordList.appendChild(listItem);
    });
    wordListContainer.appendChild(wordList);
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }
  
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayCurrentPage();
      window.scrollTo(0, container.offsetTop);
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayCurrentPage();
      window.scrollTo(0, container.offsetTop);
    }
  });
  
  paginationDiv.appendChild(prevButton);
  paginationDiv.appendChild(nextButton);
  
  container.appendChild(paginationDiv);
  container.appendChild(wordListContainer);
  
  displayCurrentPage();
}

document.getElementById('wordInput').addEventListener('input', () => {
  findAndDisplayWords();
});

const themeStyle = document.getElementById('theme-style');
const themeButton = document.getElementById('themeButton');
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeButton.addEventListener('click', () => {
  const newTheme = themeStyle.getAttribute('href') === 'light-theme.css' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

function setTheme(theme) {
  if (theme === 'dark') {
    themeStyle.setAttribute('href', 'dark-theme.css');
    themeButton.textContent = '☀️ Light Mode';
  } else {
    themeStyle.setAttribute('href', 'light-theme.css');
    themeButton.textContent = '🌙 Dark Mode';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('wordInput').value) {
    findAndDisplayWords();
  }
});
