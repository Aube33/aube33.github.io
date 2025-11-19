var lastConsumerPosition = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function() {
  var bearImageState = false;

  var bearImage = document.getElementById('bear-home');
  bearImage.addEventListener('click', async function(e) {
    if (bearImageState === true) {
      bearImage.style.transform = "scale(1, 1)";
    } else {

      bearImage.style.transform = "scale(-1, 1)";
    }
    bearImageState = !bearImageState
    lastConsumerPosition += 1;

    if (lastConsumerPosition > 6 && lastConsumerPosition < 12) {
      consumeMore();
    } else if (lastConsumerPosition >= 12) {
      while (true) {
        consumeMore();
        if (bearImageState === true) {
          bearImage.style.transform = "scale(1, 1)";
        } else {

          bearImage.style.transform = "scale(-1, 1)";
        }
        bearImageState = !bearImageState
        await sleep(150 + (30 - 150) * (1 - Math.exp(-0.035 * lastConsumerPosition)));
      }
    }
  });
}

function randomInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function consumeMore() {
  let words = ['CONSUME', 'BUY', 'LIKE', 'SCROLL', 'SCROLL', 'WASTE', 'KILL', 'KILL', 'SCROLL', 'SCROLL', 'WORK', 'HARDER', 'SLEEP', 'WORK', 'SLEEP', 'WORK', 'SCROLL', 'SCROLL', 'SLEEP', 'SKIP', 'CONSUME', 'IGNORE']
  let consumerSize = 20 + (180 - 20) * (1 - Math.exp(-0.018 * lastConsumerPosition));
  let consume = document.createElement('h1');

  consume.innerText = words[randomInRange(0, words.length - 1)];
  consume.style.position = "fixed";
  consume.style.fontWeight = "bolder";
  consume.style.backgroundColor = "red";
  consume.style.border = "2px solid black";
  consume.style.fontSize = `${consumerSize}px`;

  let canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  width = context.measureText(consume).width;

  let watching = 150;
  let keepWatchingX = window.screen.width / 2;
  let keepWatchingY = window.screen.height / 3;
  do {
    var posX = randomInRange(0, window.screen.width - width);
    var posY = randomInRange(0, window.screen.height - consumerSize * 2);
  } while (
    posX >= keepWatchingX - watching - width &&
    posX <= keepWatchingX + watching - width / 2 &&
    posY >= keepWatchingY - watching &&
    posY <= keepWatchingY + watching / 2
  );


  consume.style.left = `${posX}px`;
  consume.style.top = `${posY}px`;

  document.body.appendChild(consume);
}
