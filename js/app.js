(function() {
  // vars
  const tweetBox = document.querySelector('#tweet');
  const form = document.querySelector('#form');
  const tweetListContainer = document.querySelector('#tweet-list');

  function animateTweet( tweet ) {
    TweenMax.set(tweet, {autoAlpha: 0, y: 200});
    TweenMax.to(tweet, .3, {
      autoAlpha: 1,
      y: 0,
      ease:Back.easeOut
    });
  }

  function animateTweetList( tweetList ) {
    TweenMax.set(tweetList, {autoAlpha: 0});
    TweenMax.staggerTo(tweetList, .5, {
      autoAlpha: 1,
      ease:Back.easeOut
    }, .2);
  }

  // https://stackoverflow.com/questions/40843773/localstorage-keeps-overwriting-my-data
  function saveTweet( e ) {
    e.preventDefault();
    // retrieve the contents of the textarea
    let tweetText = tweetBox.value;
    // retrieve content of local storage and turn it into an array, or create an
    // empth array and assign it as the local storage content
    const localStorageContent = JSON.parse(localStorage.getItem("userTweet")) || [];
    // if the textbox has text of a tweet
    if(tweetText !== '') {
      // add the tweet to the local storage content array
      localStorageContent.push(tweetText);
      // turn the local storage content array into strings and store it into
      // local storage
      localStorage.setItem( 'userTweet', JSON.stringify( localStorageContent) );
      // create the element to display the newly added tweet
      // and add it to the DOM
      const lastSavedTweet = localStorageContent[localStorageContent.length - 1];
      const tweetElem = document.createElement( 'div' );
      const dataAttr = document.createAttribute( 'data-key' );
      dataAttr.value = `${localStorageContent.length - 1}`;
      tweetElem.setAttributeNode( dataAttr );
      tweetElem.classList.add( 'tweet-list-item' );

      const paragraph = document.createElement( 'p' );
      paragraph.textContent = lastSavedTweet;

      tweetElem.appendChild( paragraph );

      const removeBtn = document.createElement( 'button' );
      removeBtn.textContent = 'X';
      removeBtn.classList.add( 'remove-tweet' );

      tweetElem.appendChild( removeBtn );

      tweetListContainer.appendChild( tweetElem );

      // use GSAP to fade in the newly added tweet
      animateTweet( tweetElem );

      // empty the textarea
      tweetBox.value = '';
    } else {
      // if the form is submitted without tweets,
      // alert the user to add one
      alert('Enter the text of your Tweet');
    }
  }

  function displayTweets( animate = false ) {
    // retrieve the list of tweets from local storage
    const localStorageContent = JSON.parse( localStorage.getItem( 'userTweet' ) );
    // there are tweets into local storage
    if( localStorageContent !== null ) {
      // build the html with the tweet and add a data-key with
      // the value of the array index (useful for removal task)
      const tweetList = localStorageContent.map( ( tweet, index ) => `<div data-key="${index}" class="tweet-list-item"><p>${tweet}</p> <button class="remove-tweet">X</button></div>` );
      // turn the array of retrieved tweets into string and
      // add it to the DOM
      const tweetListStr = tweetList.join( ' ' );
      tweetListContainer.innerHTML = tweetListStr;

      // if animate param is true, add staggered
      // animation to the list as it's displayed
      // add staggered animation to list when displayed
      if( animate ) {
        const tweets = document.querySelectorAll( '.tweet-list-item' );
        animateTweetList( tweets );
      }
    }
  }

  function removeTweet(e) {

    // make sure the action takes place when the remove tweet button
    // is clicked, not when other areas are clicked
    if ( e.target.className === 'remove-tweet' ) {
      // retrieve the data-key value (array index) from the
      // removeTweetBtn being clicked
      const elemKey = e.target.parentElement.getAttribute('data-key');
      // retrieve the contents of local storage and turn them into array
      let localStorageContent = JSON.parse( localStorage.getItem( 'userTweet' ) );
      // check there are items in the local storage content array
      if(localStorageContent.length > 0) {
        // data-key value is the same as the array index of local storage content
        // array - use it to remove the item with that index from the array
        localStorageContent.splice( elemKey, 1 );
        // update local storage with the shrunk array
        localStorage.setItem( 'userTweet', JSON.stringify( localStorageContent ) );
        // alert user
        alert( 'tweet removed' );
        // display tweets
        displayTweets();
      }

    } else {
      // if there are no tweets to remove, just return and do nothing
      // this scenario is unlikely since the remove button is on the
      // displayed tweet, and if there are no tweets in local storage
      // there won't be a remove button displayed
      return;
    }

  }

  // bind saveTweet to the form submission event
  form.addEventListener('submit', saveTweet);

  // bind removeTweet to remove button
  tweetListContainer.addEventListener( 'click', removeTweet, false );


  // display all tweets contained into localStorage on page load
  displayTweets( true );
})()
